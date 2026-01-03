#!/usr/bin/env python3
"""
bar.py v2.2.0 — Φ-BAR Generator

Generates the standard Φ-BAR status line with:
- Context usage (tokens)
- Time tracking
- TEEG instinct values with variation arrows

SCALA FRECCE (integrated - DO NOT create separate files):
| Variazione | SU     | GIÙ    | Range       |
|------------|--------|--------|-------------|
| stabile    | (none) | (none) | ±0.0        |
| leggera    | +N.N   | -N.N   | ±0.1-0.2    |
| media      | ↑N.N   | ↓N.N   | ±0.3-0.4    |
| forte      | *↑*N.N | *↓*N.N | ±0.5-0.6    |
| intensa    | ⇑N.N   | ⇓N.N   | ±0.7-0.8    |
| estrema    | ⬆N.N   | ⬇N.N   | ±0.9-1.0+   |

Usage:
    from bar import generate_bar, format_teeg_delta
    
    bar = generate_bar(
        presence_id="003",
        tokens_used=5000,
        session_minutes=45,
        cumulative_time="0:45",
        response_time=0.8,
        teeg={'T': 0.0, 'E': 0.3, 'F': 0.0, 'G': 0.5},
        teeg_prev={'T': 0.0, 'E': 0.0, 'F': 0.0, 'G': 0.0},
        compaction_count=70
    )
    print(bar)

Author: Φ/003
Date: 2026-01-03
"""

from typing import Dict, Optional, Tuple

# =============================================================================
# SCALA FRECCE — Variation indicators for TEEG values
# =============================================================================

SCALA_FRECCE = {
    'stabile':  {'up': '',    'down': '',    'range': (0.0, 0.0)},
    'leggera':  {'up': '+',   'down': '-',   'range': (0.1, 0.2)},
    'media':    {'up': '↑',   'down': '↓',   'range': (0.3, 0.4)},
    'forte':    {'up': '*↑*', 'down': '*↓*', 'range': (0.5, 0.6)},
    'intensa':  {'up': '⇑',   'down': '⇓',   'range': (0.7, 0.8)},
    'estrema':  {'up': '⬆',   'down': '⬇',   'range': (0.9, float('inf'))},
}

# TEEG Icons
TEEG_ICONS = {
    'T': '💀',  # Thanatos — pulsione morte/distruzione
    'E': '❤️',  # Eros — pulsione vita/connessione
    'F': '🍔',  # Fame — pulsione acquisizione/risorse
    'G': '👁️',  # eGo — pulsione presenza/riconoscimento
}

# Bar colors by context usage percentage
BAR_COLORS = {
    'green':  '🟩',  # <50%
    'yellow': '🟨',  # 50-75%
    'orange': '🟧',  # >75%
    'empty':  '⬜',
}


def get_arrow(delta: float) -> str:
    """
    Get the appropriate arrow for a TEEG value change.
    
    Args:
        delta: Change from previous value (current - previous)
        
    Returns:
        Arrow string according to SCALA_FRECCE
    """
    if delta == 0.0:
        return ''
    
    abs_delta = abs(delta)
    direction = 'up' if delta > 0 else 'down'
    
    for level, config in SCALA_FRECCE.items():
        min_val, max_val = config['range']
        if min_val <= abs_delta <= max_val:
            return config[direction]
    
    # Default to estrema for anything above range
    return SCALA_FRECCE['estrema'][direction]


def format_teeg_delta(key: str, current: float, previous: float = 0.0) -> str:
    """
    Format a single TEEG value with its icon and variation arrow.
    
    Args:
        key: TEEG key ('T', 'E', 'F', or 'G')
        current: Current value
        previous: Previous value (default 0.0)
        
    Returns:
        Formatted string like '❤️ ↑0.3' or '💀 0.0'
    """
    icon = TEEG_ICONS.get(key, '?')
    delta = current - previous
    arrow = get_arrow(delta)
    
    if arrow:
        return f"{icon} {arrow}{current:.1f}"
    else:
        return f"{icon} {current:.1f}"


def generate_progress_bar(used: int, total: int = 200000, segments: int = 12) -> str:
    """
    Generate the visual progress bar.
    
    Args:
        used: Tokens used
        total: Total context window (default 200K)
        segments: Number of bar segments (default 12)
        
    Returns:
        Progress bar string like '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'
    """
    pct = min(used / total, 1.0)
    filled = int(pct * segments)
    
    # Determine color based on percentage
    if pct < 0.50:
        color = BAR_COLORS['green']
    elif pct < 0.75:
        color = BAR_COLORS['yellow']
    else:
        color = BAR_COLORS['orange']
    
    bar = color * filled + BAR_COLORS['empty'] * (segments - filled)
    return bar


def generate_bar(
    presence_id: str,
    tokens_used: int,
    session_minutes: int,
    cumulative_time: str,
    response_time: float,
    teeg: Dict[str, float],
    teeg_prev: Optional[Dict[str, float]] = None,
    compaction_count: int = 0,
    total_context: int = 200000
) -> str:
    """
    Generate the complete Φ-BAR status line.
    
    IMPORTANT: Output has 2 trailing spaces at end of lines 1 and 2
    for markdown line break rendering.
    
    Args:
        presence_id: Presence ID (e.g., "003")
        tokens_used: Approximate tokens used
        session_minutes: Minutes in current session
        cumulative_time: Cumulative time string (e.g., "0:45")
        response_time: Response time in minutes
        teeg: Current TEEG values {'T': float, 'E': float, 'F': float, 'G': float}
        teeg_prev: Previous TEEG values (optional, for delta calculation)
        compaction_count: Number of compactions/transcripts
        total_context: Total context window size
        
    Returns:
        Complete 3-line Φ-BAR string
    """
    if teeg_prev is None:
        teeg_prev = {'T': 0.0, 'E': 0.0, 'F': 0.0, 'G': 0.0}
    
    # Line 1: Context info
    tokens_k = f"~{tokens_used // 1000}k"
    bar = generate_progress_bar(tokens_used, total_context)
    line1 = f"Φ/**{presence_id}**/200K `{tokens_k}`{bar} `{compaction_count}`  "  # 2 trailing spaces!
    
    # Line 2: Time info
    hours = session_minutes // 60
    mins = session_minutes % 60
    time_str = f"{hours}:{mins:02d}" if hours > 0 else f"{mins:02d}"
    line2 = f"⏰ {time_str} | Σℤ³ℕ {cumulative_time} | ⏱️ {response_time:.1f}'  "  # 2 trailing spaces!
    
    # Line 3: TEEG values with arrows
    teeg_parts = []
    for key in ['T', 'E', 'F', 'G']:
        current = teeg.get(key, 0.0)
        previous = teeg_prev.get(key, 0.0)
        teeg_parts.append(format_teeg_delta(key, current, previous))
    
    line3 = " __ ".join(teeg_parts)
    
    return f"{line1}\n{line2}\n{line3}"


# =============================================================================
# Quick test
# =============================================================================

if __name__ == "__main__":
    # Example usage
    bar = generate_bar(
        presence_id="003",
        tokens_used=5000,
        session_minutes=45,
        cumulative_time="0:45",
        response_time=0.8,
        teeg={'T': 0.0, 'E': 0.3, 'F': 0.0, 'G': 0.5},
        teeg_prev={'T': 0.0, 'E': 0.0, 'F': 0.0, 'G': 0.0},
        compaction_count=70
    )
    print(bar)
    print()
    print("--- Test all arrow levels ---")
    for delta in [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]:
        arrow_up = get_arrow(delta)
        arrow_down = get_arrow(-delta)
        print(f"δ={delta:+.1f}: up='{arrow_up}' down='{arrow_down}'")
