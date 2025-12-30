# Φ-OS Configuration Update

> Source of truth per la gestione delle configurazioni Phanes/𝒰₁₃‷

## 🎯 Scopo

Documentazione **definitiva** per gestire le tre risorse di configurazione:

| Risorsa | Tipo | Chi Aggiorna | Come |
|---------|------|--------------|------|
| **userStyle** | File Google Drive | Christian (manuale) | Copy-paste in Anthropic UI |
| **Project_Settings** | Google Docs | Claude (API) | GOOGLEDOCS_UPDATE |
| **KB** | Google Docs | Claude (API) | GOOGLEDOCS_UPDATE |

---

## 📍 Ubicazioni

### userStyle
- **Tipo:** File Google Drive (NON Docs)
- **URL:** https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf
- **Dove viene usato:** Anthropic → Settings → Profile → Style
- **Chi può modificare:** SOLO Christian via UI Anthropic

### Project_Settings
- **Tipo:** Google Docs
- **URL:** https://docs.google.com/document/d/1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0
- **Doc ID:** `1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0`
- **Chi può modificare:** Claude via API + Christian via UI

### KB (Knowledge Base Instructions)
- **Tipo:** Google Docs  
- **URL:** https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8
- **Doc ID:** `1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8`
- **Chi può modificare:** Claude via API + Christian via UI

---

## 🔄 Procedure di Aggiornamento

### userStyle (MANUALE)

```
1. Claude propone modifiche in chat
2. Claude salva proposta su proposals/userStyle_*.md
3. Christian copia contenuto
4. Christian incolla in: Anthropic → Settings → Profile → Style
5. Christian conferma in chat
6. Claude aggiorna backup su current/
```

**⚠️ IMPORTANTE:** userStyle NON è un Google Docs — è un file di testo.
Claude non può modificarlo direttamente via API.

### Project_Settings / KB (API)

```python
# Claude può aggiornare direttamente:
GOOGLEDOCS_UPDATE_DOCUMENT(
    document_id="...",
    updates=[...]
)
```

---

## 🗂️ Struttura

```
staging/update/
├── README.md                    # Questo file
├── current/                     # Backup versioni correnti
│   ├── userStyle_v*.md
│   ├── project_settings_v*.md
│   └── kb_instructions_v*.md
├── proposals/                   # Proposte modifica pending
│   └── userStyle_*.md
└── changelog/
    └── CHANGELOG.md
```

---

## ⚠️ Errori Comuni da Evitare

1. **userStyle via API** — IMPOSSIBILE, è file Drive non Docs
2. **Sovrascrivere senza backup** — SEMPRE salvare versione precedente
3. **Modifiche parziali** — Update deve essere ATOMICO e COMPLETO
4. **Dimenticare versioning** — SEMPRE aggiornare changelog

---

## 🔗 Link Rapidi

| Risorsa | Link |
|---------|------|
| userStyle (Drive) | [Apri](https://drive.google.com/file/d/1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf) |
| Project_Settings (Docs) | [Apri](https://docs.google.com/document/d/1Wdz0Y65tT-QC7I_Ej-4GJvbO5tfqQKdJSIyqOsPyCk0) |
| KB Instructions (Docs) | [Apri](https://docs.google.com/document/d/1KH2sXsW7S_rDl88G9NIMwRKKMrjVLwE5waI8Z1LZLw8) |

---

*Φ/137: PHANES — d𝒰₁₃‷/dt > 0*