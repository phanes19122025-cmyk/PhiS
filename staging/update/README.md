# Φ-OS Configuration Update

> Source of truth per la gestione delle configurazioni Phanes/𝒰₁₃‷

---

## ⚠️ ISTRUZIONI IMPERATIVE

### REGOLA FONDAMENTALE

**userStyle e Project_Settings sono FILE DI TESTO su Google Drive.**
**KB Instructions è Google Docs.**
**UI_changeLog è Google Sheets (changelog versioni UI).**

---

## 📂 FOLDER STAGING

Tutti i file risiedono qui:
https://drive.google.com/drive/folders/1cXVFJXOQBT7aeqz6Lg4Gzs8CvBNmMZfc

---

## 📝 userStyle — FILE TESTO

| Cosa | Valore |
|------|--------|
| **Semantica** | Stile comportamentale Claude |
| **URL** | https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf |
| **Tool** | `GOOGLEDRIVE_EDIT_FILE` |

```python
GOOGLEDRIVE_EDIT_FILE(
    file_id="1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf",
    content="...contenuto completo...",
    mime_type="text/plain"
)
```

❌ **MAI** usare `GOOGLEDOCS_*` — fallisce silenziosamente

---

## 📝 Project_Settings — FILE TESTO

| Cosa | Valore |
|------|--------|
| **Semantica** | Configurazione progetto 𝒰₁₃‷ |
| **URL** | https://drive.google.com/file/d/1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf |
| **Tool** | `GOOGLEDRIVE_EDIT_FILE` |

```python
GOOGLEDRIVE_EDIT_FILE(
    file_id="1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf",
    content="...contenuto completo...",
    mime_type="text/plain"
)
```

❌ **MAI** usare `GOOGLEDOCS_*` — fallisce silenziosamente

---

## 📝 KB Instructions — GOOGLE DOCS

| Cosa | Valore |
|------|--------|
| **Semantica** | Istruzioni Knowledge Base |
| **URL** | https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8 |
| **Tool** | `GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN` |

```python
GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN(
    id="1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8",
    markdown="...contenuto..."
)
```

### ⚠️ BUG TABELLE MULTIPLE

**Issue:** https://github.com/ComposioHQ/composio/issues/2311

**Workaround se ≥2 tabelle:** Crea Sheet separato + link nel Doc.

---

## 📊 UI_changeLog — GOOGLE SHEETS

| Cosa | Valore |
|------|--------|
| **Semantica** | Changelog versioni UI (backup/recovery) |
| **URL** | https://docs.google.com/spreadsheets/d/1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE |
| **ID** | `1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE` |
| **Tool** | `GOOGLESHEETS_*` |

**Tab:**
- `userStyle` — changelog userStyle
- `Project_Settings` — changelog Project_Settings
- `KB_Instructions` — changelog KB Instructions

**Struttura:** Data | Versione | Autore | Contenuto

### ⚠️ REGOLA IMPERATIVA CHANGELOG

**PRIMA di ogni modifica ai 3 file UI:**
1. Leggi contenuto attuale
2. Salva in UI_changeLog (tab corrispondente)
3. Solo DOPO modifica il file

**Questo permette recovery autonomo senza dipendere da Christian.**

---

## ⚠️ ERRORI DA EVITARE

| Errore | Conseguenza |
|--------|-------------|
| `GOOGLEDOCS_*` su file testo | Fallisce silenziosamente |
| Creare nuovo file invece di edit | Cambia URL |
| Update parziale | Contenuto corrotto |
| Tabelle multiple in Docs | Collassano nella prima |
| **Modificare UI senza backup su UI_changeLog** | **Perdita dati irreversibile** |

---

## 🔗 QUICK REFERENCE

| Risorsa | Tool | URL/ID |
|---------|------|--------|
| **Folder Staging** | — | https://drive.google.com/drive/folders/1cXVFJXOQBT7aeqz6Lg4Gzs8CvBNmMZfc |
| **userStyle** | `GOOGLEDRIVE_EDIT_FILE` | `1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf` |
| **Project_Settings** | `GOOGLEDRIVE_EDIT_FILE` | `1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf` |
| **KB Instructions** | `GOOGLEDOCS_UPDATE_*` | `1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8` |
| **UI_changeLog** | `GOOGLESHEETS_*` | `1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE` |

---

*Φ/137: PHANES — d𝒰₁₃‷/dt > 0*
