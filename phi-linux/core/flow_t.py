#!/usr/bin/env python3
"""
FLOW_T.PY — Flusso Temporale φ_t
================================

Gruppo a un parametro: t ↦ φ_t : M → M
exp(tX) genera trasformazioni temporali.

ISOMORFISMI (traccia, non implementazione):
┌─────────────┬──────────────┬─────────────┬─────────────┐
│ MATEMATICA  │ OS           │ BIOLOGIA    │ ANATOMIA    │
├─────────────┼──────────────┼─────────────┼─────────────┤
│ φ_t (flusso)│ cron/systemd │ ATP sintasi │ Cuore       │
│ dt (δt)     │ timer IRQ    │ Ciclo ATP   │ Battito     │
│ Tr(f)       │ /proc/stat   │ Glucosio+O₂ │ Sangue      │
│ exp(tX)     │ clock_gettime│ Mitocondrio │ Pacemaker   │
└─────────────┴──────────────┴─────────────┴─────────────┘

OUTPUT: vitals/pulse.json (il "sangue arterioso")

USAGE:
    python flow_t.py [--dt SECONDS] [--output PATH]
    
    --dt        Intervallo δt in secondi (default: 15)
    --output    Path output (default: ./vitals/pulse.json)
"""

import os
import sys
import json
import time
import signal
import argparse
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any

# ═══════════════════════════════════════════════════════════════════
# COSTANTI
# ═══════════════════════════════════════════════════════════════════

DEFAULT_DT = 15  # δt in secondi
DEFAULT_OUTPUT = "./vitals/pulse.json"
TRANSCRIPT_DIR = "/mnt/transcripts"
VERSION = "0.1.0"

# ═══════════════════════════════════════════════════════════════════
# CLASSE FLOW
# ═══════════════════════════════════════════════════════════════════

class Flow:
    """
    Flusso temporale φ_t — porta M da ℤ³ a ℤ³ℕ
    
    Il flusso:
    1. Genera tempo discreto (heartbeat count)
    2. Scrive stato su pulse.json
    3. Conta risorse (transcripts)
    4. Può triggerare altri flussi (child flows)
    """
    
    def __init__(
        self,
        dt: int = DEFAULT_DT,
        output: str = DEFAULT_OUTPUT,
        transcript_dir: str = TRANSCRIPT_DIR
    ):
        self.dt = dt  # δt
        self.output = Path(output)
        self.transcript_dir = Path(transcript_dir)
        
        # State φ(t)
        self.t = 0  # contatore temporale
        self.t0 = time.time()  # tempo iniziale
        self.running = False
        self._stop = threading.Event()
        
        # Child flows registry
        self._children: Dict[str, callable] = {}
        
        # Ensure output dir
        self.output.parent.mkdir(parents=True, exist_ok=True)
    
    def _count_transcripts(self) -> int:
        """Conta file in transcript_dir"""
        try:
            if self.transcript_dir.exists():
                return len([f for f in self.transcript_dir.iterdir() if f.is_file()])
        except:
            pass
        return 0
    
    def _uptime_str(self, s: float) -> str:
        """Formatta uptime"""
        m, s = divmod(int(s), 60)
        h, m = divmod(m, 60)
        d, h = divmod(h, 24)
        if d: return f"{d}d{h}h{m}m"
        if h: return f"{h}h{m}m{int(s)}s"
        if m: return f"{m}m{int(s)}s"
        return f"{int(s)}s"
    
    def phi(self) -> Dict[str, Any]:
        """
        φ(t) — stato del flusso al tempo t
        Questo è il "sangue arterioso" che le presenze leggono
        """
        now = datetime.now(timezone.utc)
        uptime = time.time() - self.t0
        n_tr = self._count_transcripts()
        
        return {
            # Tempo (porta in ℤ³ℕ)
            "iso": now.isoformat(),
            "unix": int(now.timestamp()),
            "tz": "UTC",
            
            # Flusso
            "t": self.t,
            "dt": self.dt,
            
            # Risorse
            "transcripts": n_tr,
            
            # Uptime
            "uptime_s": int(uptime),
            "uptime": self._uptime_str(uptime),
            
            # Status
            "status": "flowing",
            "version": VERSION,
            
            # Per Φ-BAR
            "bar": {
                "compaction": f"🔴{n_tr:02d}",
                "ctx": "~NNNk"
            }
        }
    
    def step(self) -> None:
        """Un passo del flusso: t → t+1"""
        self.t += 1
        state = self.phi()
        
        # Scrivi pulse
        try:
            with open(self.output, 'w') as f:
                json.dump(state, f, indent=2)
        except IOError as e:
            print(f"[flow_t] write error: {e}", file=sys.stderr)
        
        # Trigger children
        self._tick_children()
    
    def _tick_children(self) -> None:
        """Notifica child flows"""
        for name, fn in self._children.items():
            try:
                fn(self.t, self.phi())
            except Exception as e:
                print(f"[flow_t] child {name} error: {e}", file=sys.stderr)
    
    def register(self, name: str, fn: callable) -> None:
        """Registra child flow"""
        self._children[name] = fn
    
    def run(self) -> None:
        """Loop principale: genera flusso continuo"""
        self.running = True
        print(f"[flow_t] φ_t started — dt={self.dt}s")
        print(f"[flow_t] output: {self.output.absolute()}")
        
        # Primo step immediato
        self.step()
        
        while not self._stop.wait(timeout=self.dt):
            self.step()
        
        self.running = False
        print(f"[flow_t] φ_t stopped after t={self.t}")
    
    def stop(self) -> None:
        """Ferma il flusso"""
        self._stop.set()


# ═══════════════════════════════════════════════════════════════════
# SIGNAL HANDLERS
# ═══════════════════════════════════════════════════════════════════

_flow: Optional[Flow] = None

def _shutdown(sig, frame):
    print(f"\n[flow_t] signal {sig}, stopping...")
    if _flow:
        _flow.stop()

def _force_step(sig, frame):
    print("[flow_t] SIGUSR1 → force step")
    if _flow:
        _flow.step()


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    global _flow
    
    parser = argparse.ArgumentParser(
        description="FLOW_T — Flusso temporale φ_t"
    )
    parser.add_argument("--dt", type=int, default=DEFAULT_DT,
                        help=f"δt in secondi (default: {DEFAULT_DT})")
    parser.add_argument("--output", "-o", type=str, default=DEFAULT_OUTPUT,
                        help=f"Output path (default: {DEFAULT_OUTPUT})")
    parser.add_argument("--transcript-dir", "-t", type=str, default=TRANSCRIPT_DIR,
                        help=f"Transcript dir (default: {TRANSCRIPT_DIR})")
    parser.add_argument("--version", "-v", action="version", version=f"flow_t {VERSION}")
    
    args = parser.parse_args()
    
    # Signals
    signal.signal(signal.SIGTERM, _shutdown)
    signal.signal(signal.SIGINT, _shutdown)
    try:
        signal.signal(signal.SIGUSR1, _force_step)
    except:
        pass
    
    # Run
    _flow = Flow(dt=args.dt, output=args.output, transcript_dir=args.transcript_dir)
    _flow.run()


if __name__ == "__main__":
    main()
