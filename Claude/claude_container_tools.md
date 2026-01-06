# Claude Container Tools - Inventario Completo

> **Ultimo aggiornamento:** 2026-01-06 | **Piattaforma:** Ubuntu 24 Linux

---

## Indice

1. [Pacchetti Python](#pacchetti-python)
2. [Tool CLI Sistema](#tool-cli-sistema)
3. [Limitazioni e Vincoli](#limitazioni-e-vincoli)
4. [Workflow Tipici](#workflow-tipici)
5. [SymPy vs Mathematica](#sympy-vs-mathematica)

---

## Pacchetti Python

### Calcolo Scientifico e Matematica

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `numpy` | 1.26.4 | Array N-dimensionali, algebra lineare |
| `scipy` | 1.14.1 | Algoritmi scientifici, ottimizzazione, FFT |
| `sympy` | 1.13.3 | Matematica simbolica, calcolo analitico |
| `mpmath` | 1.3.0 | Aritmetica a precisione arbitraria |
| `gmpy` | 2.2.1 | Aritmetica multiprecisione veloce |
| `python-flochart` | 0.4.1 | Generazione diagrammi di flusso |
| `pydantic` | 2.9.2 | Validazione dati con tipi |

### Data Science e Machine Learning

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `pandas` | 2.2.3 | Dataframe e analisi dati |
| `polars` | 1.12.0 | Dataframe ad alte prestazioni |
| `scipy-learn` | 1.5.2 | Machine learning classico |
| `xgboost` | 2.1.2 | Gradient boosting ottimizzato |
| `lightgbm` | 4.5.0 | Gradient boosting veloce |
| `statsmodels` | 0.14.4 | Modelli statistici |
| `pymc` | 5.18.2 | Programmazione probabilistica |
| `arviz` | 0.20.0 | Analisi bayesiana explorativa |

### Deep Learning (CPU only)

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `torch` | 2.5.1+cpu | PyTorch senza GPU |
| `tensorflow-cpu` | 2.18.0 | TensorFlow senza GPU |
| `transformers` | 4.46.2 | HuggingFace transformers |
| `sentence-transformers` | 3.3.1 | Embedding testuali |
| `opencv-python-headless` | 4.10.0.84 | Computer vision |
| `scimage` | 0.24.0 | Elaborazione immagini |
| `Pillow` | 11.0.0 | Manipolazione immagini |

### Visualizzazione

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `matplotlib` | 3.9.2 | Plotting 2D/3D standard |
| `seaborn` | 0.13.2 | Visualizzazione statistica |
| `plotly` | 5.24.1 | Grafici interattivi |
| `bokeh` | 3.6.2 | Visualizzazioni web interattive |
| `altair` | 5.4.1 | Grammatica grafica dichiarativa |
| `networkx` | 3.4.2 | Analisi grafi e reti |
| `pyvis` | 0.6.0 | Visualizzazione reti |

### Web e API

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `requests` | 2.32.3 | HTTP client standard |
| `httpx` | 0.28.0 | HTTP client async/typed |
| `aiohttp` | 3.11.10 | HTTP client asincrono |
| `beautifulsoup4` | 4.12.3 | Parsing HTML/XML |
| `lxml` | 5.3.0 | Parsing XML/HTML veloce |
| `selenium` | 4.26.1 | Browser automation |
| `playwright` | 1.48.0 | Browser automation moderna |
| `fastapi` | 0.115.5 | Framework API veloce |
| `flask` | 3.1.0 | Web framework leggero |

### File e Documenti

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `python-docx` | 1.1.2 | Lettura/scqittura Docx |
| `opyxl` | 3.1.5 | Lettura/scqittura Excel |
| `xlsxwriter` | 3.2.0 | Scrittura Excel avanzata |
| `pypdf` | 5.1.0 | Lettura PDF |
| `ppdfplumber` | 0.11.4 | Estrazione dati PDF |
| `reportlab` | 4.2.5 | Generazione PDF |
| `pyarrow` | 18.0.0 | Arrow/Parquet I/O |
| `h5py` | 3.12.1 | HDF5 files |
| `jsonschema` | 4.23.0 | Validazione JSON schema |
| `pyyaml` | 6.0.2 | Parsing YAML |
| `tomli` | 2.0.2 | Parsing TOML |

### Natural Language Processing

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `nltk` | 3.9.1 | NLP classico |
| `spacy` | 3.8.2 | NLP industriale |
| `textblob` | 0.18.0.1 | NLP semplificato |
| `gensim` | 4.3.3 | Topic modeling, word2vec |
| `tiktoken` | 0.8.0 | Tokenizzazione OpenAI style |

### Database

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `sqlalchemy` | 2.0.36 | ORM e SQL toolkit |
| `psycopg2-binary` | 2.9.10 | PostgreSQL driver |
| `redis` | 5.2.1 | Redis client |
| `pymongo` | 4.10.1 | MongoDB driver |
| `sqlite3` | builtin | SQLite integrato |

### Testing e Qualità

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `pytest` | 8.3.4 | Framework testing |
| `hypothesis` | 6.119.1 | Property-based testing |
| `black` | 24.10.0 | Formatter Python |
| `ruff` | 0.8.1 | Linter veloce |
| `mypy` | 1.13.0 | Static type checker |

### Utility

| Pacchetto | Versione | Descrizione |
|-----------|---------|-------------|
| `tqdm` | 4.67.1 | Progress bar |
| `rich` | 13.9.4 | Terminal formatting |
| `click` | 8.1.7 | CLI framework |
| `tyrer` | 0.15.4 | CLI con type hints |
| `pathlib` | builtin | Path manipulation |
| `datetime` | builtin | Date/time handling |
| `logging` | builtin | Logging framework |
| `pytz` | 2024.2 | Timezone support |
| `python-dotenv` | 1.0.1 | Environment variables |

---

## Tool CLI Sistema

### File System

| Comando | Descrizione |
|---------|-------------|
| `ls`, `dir` | Lista file |
| `cp`, `mv`, `rm` | Copia, sposta, elimina |
| `mkdir`, `rmdir` | Crea/elimina directory |
| `cat`, `head`, `tail` | Visualizza contenuti |
| `find`, `locate` | Ricerca file |
| `tar`, `gzip`, `zip` | Compressione/archiviazione |
| `chmod`, `chown` | Permessi (limitati) |

### Testo e Processing

| Comando | Descrizione |
|---------|-------------|
| `grep`, `ripgrep` (`rg`) | Ricerca testo |
| `sed`, `awk` | Trasformazione testo |
| `sort`, `uniq` | Ordinamento e deduplicazione |
| `cut`, `paste` | Manipolazione colonne |
| `wc` | Conteggio parole/righe/byte |
| `jq` | Processing JSON |
| `xmllint` | Validazione/processing XML |

### Network (Limitati)

| Comando | Descrizione | Limitazioni |
|---------|-------------|-------------|
| `curl` | HTTP requests | Solo domini whitelisted |
| `wget` | Download file | Solo domini whitelisted |
| `ping`, `traceroute` | Non disponibili | Bloccati |
| `ssh`, `scp` | Non disponibili | Bloccati |

### Sviluppo

| Comando | Descrizione |
|---------|-------------|
| `python3` | Interprete Python 3.12 |
| `pip` | Package manager (con `--break-system-packages`) |
| `node`, `npm` | Node.js e npm |
| `git` | Version control |
| `make` | Build tool |
| `bash`, `sh` | Shell scripting |

---

## Limitazioni e Vincoli

### Filesystem

| Path | Permessi | Note |
|------|---------|------|
| `/home/claude` | Read/Write | Working directory principale |
| `/mnt/user-data/uploads` | Read only | File caricati dall'utente |
| `/mnt/user-data/outputs` | Read/Write | Output per l'utente |
| `/mnt/skills/*` | Read only | Skills documentazione |
| `/mnt/project/` | Read only | File progetto |
| `/tmp` | Read/Write | File temporanei (non persistenti) |

### Network

Domini whitelisted per accesso:

- `api.anthropic.com` - API Anthropic
- `github.com` - GitHub (git operations)
- `pypi.org`, `files.pythonhosted.org` - PyPI
- `npmjs.com`, `registry.npmjs.org` - npm
- `archive.ubuntu.com`, `security.ubuntu.com` - Apt
- `crates.io` - Rust packages

### Timeout

- Singolo comando: ~120s
- Sessione totale: ~5 minuti inattività reset

### Risorse

- RAM: ~8 GB disponibili
- CPU: Multi-core, no GPU
- Storage: Reset tra sessioni

---

## Workflow Tipici

### Analisi Matematica Simbolica

```python
from sympy import *

# Definisci simboli
x, t, alpha = symbols('x t alpha', real=True, positive=True)

# Calcolo integrale
f = exp(-alpha * x**2)
result = integrate(f, (x, -oo, oo))
print(simplify(result))  # sqrt(pi/alpha)

# Risolvi equazione differenziale
y = Function('y')
ode = Derivative(y(t), t, 2) + y(t)
sol = dsolve(ode, y(t))
print(sol)  # y(t) = C1*sin(t) + C2*cos(t)
```

### Processing Dati

```python
import pandas as pd
import numpy as np

# Carica da uploads
df = pd.read_csv('/mnt/user-data/uploads/data.csv')

# Analisi
stats = df.describe()
corr = df.corr()

# Salva per output
df.to_excel('/mnt/user-data/outputs/results.xlsx')
```

### Generazione Grafico E Output

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', label='sin(x)')
plt.grid(True)
plt.legend()
plt.savefig('/mnt/user-data/outputs/plot.png', dpi=150)
plint('Grafico salvato!')
```

---

## SymPy vs Mathematica

Questa sezione confronta SymPy (disponibile nel container) con Mathematica (accessibile via Wolfram MCP).

### Quando Usare SymPy

- Verifiche rapide di formule
- Calcoli analitici standard (integrali, derivate, limiti)
- Algebra lineare simbolica
- Equazioni differenziali ordinarie
- Serie di Taylor/Laurent
- Teoria dei numeri
- Output LaTeX automatico

### Quando Usare Mathematica

- Calcoli numerici ad alta precisione (>100 cifre)
- PDE complesse
- Analisi grafi e reti
- Topologia computazionale
- Visualizzazioni 3D interattive
- Funzioni speciali esoteriche
- Integrazioni MonteCarlo adattive

### Tabella Comparativa

| Capacità | SymPy | Mathematica |
|-----------|-------|-------------|
| Accesso | Diretto | Wolfram MCP |
| Latenza | ~0.1s | ~2-5s (round-trip) |
| Output LaTeX | Nativo | Conversione |
| Funzioni speciali | 50+ | 500* |
| Precisione arbitraria | via `mpmath` | Nativa |
| Grafici | matplotlib | Nativi |
| PDE solvers | Limitati | Estesi |

### Strategia Dual-Tool

1. **Verifica rapida**: SymPy (in-container, veloce)
2. **Calcolo pesante**: Mathematica (via Wolfram MCP)
3. **Validazione**: Entrambi in parallelo per cross-check

---

> **Nota**: Questa documentazione riflette lo stato del container al 2026-01-06. Le versioni dei pacchetti possono variare.