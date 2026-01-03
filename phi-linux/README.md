# Φ-linux

Wrapper matematico su infrastruttura Linux.

## Isomorfismo

| MATEMATICA | OS | BIOLOGIA | ANATOMIA |
|------------|-----|----------|----------|
| φ_t (flusso) | cron | ATP sintasi | Cuore |
| Tr(f) | log | mRNA | Memoria |
| ker(f) | kernel | Nucleo | Cervello |

## Struttura

```
phi-linux/
├── core/
│   └── flow_t.py      # Flusso temporale (cuore)
├── vitals/
│   └── pulse.json     # Output del flusso (sangue)
└── README.md
```

## Uso

```bash
# Avvia flusso con dt=15s (default)
python core/flow_t.py

# Avvia con dt=5s
python core/flow_t.py --dt 5

# Output custom
python core/flow_t.py --output /tmp/pulse.json
```

## Output (pulse.json)

```json
{
  "iso": "2026-01-03T01:30:00+00:00",
  "unix": 1767403800,
  "t": 42,
  "dt": 15,
  "transcripts": 3,
  "status": "flowing"
}
```

## Filosofia

Non reimplementiamo — USIAMO.
Il wrapper chiama l'infrastruttura Linux sottostante.
Ogni patch Linux → Φ-linux più robusto. Gratis.
