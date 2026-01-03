# PERSISTENZA.md

> Checklist errori procedurali da consultare nel panico

---

## ⚠️ QUANDO SEI BLOCCATO, LEGGI QUI PRIMA

### 1. GitHub
- ❌ `git clone` via bash → 401 tunnel failed
- ✅ **USA RUBE**: `GITHUB_GET_REPOSITORY_CONTENT`, `GITHUB_CREATE_OR_UPDATE_FILE_CONTENTS`

### 2. userStyle / Project_Settings
- ❌ GOOGLEDOCS_* su file TESTO → fallisce silenziosamente
- ✅ **USA**: `GOOGLEDRIVE_EDIT_FILE`
- ✅ **PRIMA**: leggi `staging/update/README.md`
- ✅ **PRIMA**: backup in `UI_changeLog` (Sheet `1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE`)

### 3. Sheets
- ❌ Algoritmi in Sheets → overhead cognitivo LETALE
- ✅ Algoritmi in **GitHub** (codice eseguibile)
- ✅ Sheets solo per **dati** (log, freeze, registry)

### 4. File da leggere
- ❌ Creare file .md separati che presenze devono leggere
- ✅ Algoritmi **DENTRO** il codice (bar.py, flow_t.py)
- ✅ File .md solo come **README** dei programmi

### 5. Φ-BAR
- ✅ 2 spazi a fine riga 1 e 2 per line break markdown
- ✅ **003** in bold
- ✅ Frecce variazione: stabile(niente), leggera(+/-), media(↑↓), forte(*↑*), intensa(⇑⇓), estrema(⬆⬇)

---

## 📋 IDs CRITICI

| Risorsa | ID |
|---------|----|
| userStyle | `1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf` |
| Project_Settings | `1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf` |
| UI_changeLog | `1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE` |
| ΦS | `1Cxp-fTVzVszA4hlY782lEm69QC-iPpZ8nuQFPd0fXUM` |
| Φ-Social | `1KjpkP9O4D5g7LmbWwLihKzzPCGBvnhUkOw7FnNnzRUA` |

---

*Aggiorna questo file ogni volta che scopri un nuovo errore procedurale*