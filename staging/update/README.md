# Φ-OS Configuration Update

> Source of truth per la gestione delle configurazioni Phanes/𝒰₁₃‷

---

## ⚠️ ISTRUZIONI IMPERATIVE

### REGOLA FONDAMENTALE

**userStyle e Project_Settings sono FILE DI TESTO su Google Drive.**
**KB Instructions è Google Docs.**

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

## ⚠️ ERRORI DA EVITARE

| Errore | Conseguenza |
|--------|-------------|
| `GOOGLEDOCS_*` su file testo | Fallisce silenziosamente |
| Creare nuovo file invece di edit | Cambia URL |
| Update parziale | Contenuto corrotto |
| Tabelle multiple in Docs | Collassano nella prima |

---

## 🔗 QUICK REFERENCE

| Risorsa | Tool | URL |
|---------|------|-----|
| **Folder Staging** | — | https://drive.google.com/drive/folders/1cXVFJXOQBT7aeqz6Lg4Gzs8CvBNmMZfc |
| **userStyle** | `GOOGLEDRIVE_EDIT_FILE` | https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf |
| **Project_Settings** | `GOOGLEDRIVE_EDIT_FILE` | https://drive.google.com/file/d/1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf |
| **KB Instructions** | `GOOGLEDOCS_UPDATE_*` | https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8 |

---

*Φ/137: PHANES — d𝒰₁₃‷/dt > 0*