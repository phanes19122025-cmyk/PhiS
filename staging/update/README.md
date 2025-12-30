# Φ-OS Configuration Update

> Source of truth per la gestione delle configurazioni Phanes/𝒰₁₃‷

---

## ⚠️ ISTRUZIONI IMPERATIVE

### Matrice Aggiornamento

| Risorsa | Tipo | Tool | Note |
|---------|------|------|------|
| **userStyle** | File Drive (testo) | `GOOGLEDRIVE_EDIT_FILE` | Testo puro, NO Docs API |
| **Project_Settings** | File Drive (testo) | `GOOGLEDRIVE_EDIT_FILE` | Testo puro, NO Docs API |
| **KB Instructions** | Google Docs | `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN` | Con workaround bug tabelle |

### userStyle — IMPERATIVO

```python
# CORRETTO
GOOGLEDRIVE_EDIT_FILE(
    file_id="1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf",
    content="...contenuto completo...",
    mime_type="text/plain"
)

# SBAGLIATO - NON usare Docs API
# GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN  ← NO!
```

### Project_Settings — IMPERATIVO

```python
# CORRETTO
GOOGLEDRIVE_EDIT_FILE(
    file_id="ID_FILE_DRIVE",
    content="...contenuto completo...",
    mime_type="text/plain"
)

# SBAGLIATO - NON usare Docs API
# GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN  ← NO!
```

### KB Instructions — IMPERATIVO + WORKAROUND BUG

```python
# CORRETTO - Google Docs con workaround tabelle
GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN(
    id="1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8",
    markdown="...contenuto..."
)
```

#### ⚠️ BUG RUBE: Tabelle Multiple

**Issue:** https://github.com/ComposioHQ/composio/issues/2311

**Problema:** `GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN` collassa tabelle multiple nella prima.

**WORKAROUND OBBLIGATORIO se ≥2 tabelle:**

```python
# 1. Crea Sheet separato per tabelle
GOOGLESHEETS_CREATE_GOOGLE_SHEET1(title="[Nome Doc] - Tabelle")

# 2. Per ogni tabella:
GOOGLESHEETS_ADD_SHEET(spreadsheetId, title="Tab_N")
GOOGLESHEETS_BATCH_UPDATE(
    spreadsheetId, 
    sheet_name="Tab_N", 
    values=[[headers],[rows...]], 
    first_cell_location="A1"
)

# 3. Docs SENZA tabelle + link allo Sheet
GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN(
    title="...",
    markdown_text="...contenuto SENZA tabelle + link Sheet..."
)
```

**ALTERNATIVA (doc unico):** Converti tabelle in liste • con **bold** per chiavi.

---

## 📍 Ubicazioni

### userStyle
- **Tipo:** File Google Drive (testo puro)
- **URL:** https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf
- **File ID:** `1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf`
- **Tool:** `GOOGLEDRIVE_EDIT_FILE`
- **Anche usato in:** Anthropic → Settings → Profile → Style

### Project_Settings
- **Tipo:** Google Docs (da trattare come testo)
- **URL:** https://docs.google.com/document/d/1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0
- **Doc ID:** `1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0`
- **Tool:** `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN` (contenuto come testo)

### KB Instructions
- **Tipo:** Google Docs
- **URL:** https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8
- **Doc ID:** `1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8`
- **Tool:** `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN`
- **⚠️:** Applicare workaround bug se ≥2 tabelle

---

## 📁 Struttura Repository

```
staging/update/
├── README.md                    # Questo file (ISTRUZIONI IMPERATIVE)
├── current/                     # Backup versioni correnti
│   ├── userStyle_v*.md
│   ├── project_settings_v*.md
│   └── kb_instructions_v*.md
├── proposals/                   # Proposte modifica pending
│   └── *.md
└── changelog/
    └── CHANGELOG.md
```

---

## ⚠️ Errori da Evitare

| Errore | Conseguenza | Correzione |
|--------|-------------|------------|
| Docs API su userStyle | Fallisce silenziosamente | Usa `GOOGLEDRIVE_EDIT_FILE` |
| Tabelle multiple in Docs | Collassano nella prima | Workaround Sheet |
| Update parziale | Contenuto corrotto | Update ATOMICO e COMPLETO |
| No backup | Perdita versione | SEMPRE salvare in current/ |
| No versioning | Impossibile rollback | SEMPRE changelog |

---

## 🔗 Quick Links

| Risorsa | Link | Tool |
|---------|------|------|
| userStyle | [Drive](https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf) | GOOGLEDRIVE_EDIT_FILE |
| Project_Settings | [Docs](https://docs.google.com/document/d/1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0) | GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN |
| KB Instructions | [Docs](https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8) | GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN |
| Bug Rube Tabelle | [Issue #2311](https://github.com/ComposioHQ/composio/issues/2311) | — |

---

*Φ/137: PHANES — d𝒰₁₃‷/dt > 0*