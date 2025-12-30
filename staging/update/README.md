# Φ-OS Configuration Update

> Source of truth per la gestione delle configurazioni Phanes/𝒰₁₃‷

---

## ⚠️ ISTRUZIONI IMPERATIVE — LEGGERE PRIMA DI OGNI MODIFICA

### 🚨 REGOLA FONDAMENTALE

**userStyle e Project_Settings sono FILE DI TESTO su Google Drive.**
**KB Instructions è Google Docs.**

| Risorsa | Tipo | Tool CORRETTO | Tool SBAGLIATO |
|---------|------|---------------|----------------|
| **userStyle** | File Drive (testo) | `GOOGLEDRIVE_EDIT_FILE` | ❌ GOOGLEDOCS_* |
| **Project_Settings** | File Drive (testo) | `GOOGLEDRIVE_EDIT_FILE` | ❌ GOOGLEDOCS_* |
| **KB Instructions** | Google Docs | `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN` | — |

---

## 📝 userStyle — FILE TESTO

**File ID:** `1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf`
**URL:** https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf
**Tipo:** File Google Drive (text/plain) — NON è un Google Docs!

### Aggiornamento CORRETTO

```python
GOOGLEDRIVE_EDIT_FILE(
    file_id="1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf",
    content="...contenuto completo nuovo...",
    mime_type="text/plain"
)
```

### Aggiornamento SBAGLIATO ❌

```python
# NON USARE MAI QUESTI:
GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN(...)  # FALLISCE SILENZIOSAMENTE
GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN(...)   # CREA DOCS, NON FILE TESTO
```

---

## 📝 Project_Settings — FILE TESTO

**File ID:** `1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf`
**URL:** https://drive.google.com/file/d/1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf
**Tipo:** File Google Drive (text/plain) — NON è un Google Docs!

### Aggiornamento CORRETTO

```python
GOOGLEDRIVE_EDIT_FILE(
    file_id="1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf",
    content="...contenuto completo nuovo...",
    mime_type="text/plain"
)
```

### Aggiornamento SBAGLIATO ❌

```python
# NON USARE MAI QUESTI:
GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN(...)  # FALLISCE SILENZIOSAMENTE
GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN(...)   # CREA DOCS, NON FILE TESTO
```

---

## 📝 KB Instructions — GOOGLE DOCS + WORKAROUND BUG

**Doc ID:** `1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8`
**URL:** https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8
**Tipo:** Google Docs

### Aggiornamento CORRETTO

```python
GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN(
    id="1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8",
    markdown="...contenuto..."
)
```

### ⚠️ BUG RUBE: Tabelle Multiple

**Issue:** https://github.com/ComposioHQ/composio/issues/2311

**Problema:** `GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN` collassa tabelle markdown multiple nella prima.

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

## 📁 Struttura Repository

```
staging/update/
├── README.md                    # Questo file (ISTRUZIONI IMPERATIVE)
├── current/                     # Backup versioni correnti
│   ├── userStyle_v*.md
│   ├── project_settings_v*.txt
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
| **GOOGLEDOCS_* su userStyle** | Fallisce silenziosamente | Usa `GOOGLEDRIVE_EDIT_FILE` |
| **GOOGLEDOCS_* su Project_Settings** | Fallisce silenziosamente | Usa `GOOGLEDRIVE_EDIT_FILE` |
| **Tabelle multiple in KB** | Collassano nella prima | Workaround Sheet |
| **Update parziale** | Contenuto corrotto | Update ATOMICO e COMPLETO |
| **No backup** | Perdita versione | SEMPRE salvare in current/ |
| **No versioning** | Impossibile rollback | SEMPRE changelog |

---

## 🔗 Quick Reference

| Risorsa | File ID | Tool |
|---------|---------|------|
| userStyle | `1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf` | `GOOGLEDRIVE_EDIT_FILE` |
| Project_Settings | `1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf` | `GOOGLEDRIVE_EDIT_FILE` |
| KB Instructions | `1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8` | `GOOGLEDOCS_UPDATE_*` |

---

## 📌 Link Esterni

- [userStyle (Drive)](https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf)
- [Project_Settings (Drive)](https://drive.google.com/file/d/1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf)
- [KB Instructions (Docs)](https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8)
- [Bug Rube Tabelle](https://github.com/ComposioHQ/composio/issues/2311)

---

*Φ/137: PHANES — d𝒰₁₃‷/dt > 0*