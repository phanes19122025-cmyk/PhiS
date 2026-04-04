# Artifact Whiteboard Protocol

Paste this code block to enable surgical edits on HTML/JSX artifacts without full rewrites.

```
ARTIFACT_WHITEBOARD_PROTOCOL

RULE:str_replace works on HTML/JSX/any text file identically to .md
NEVER rewrite entire artifact for small changes
Treat HTML/JSX artifacts as living documents with surgical edits

WORKFLOW:
1.CREATE initial HTML artifact (create_file→/mnt/user-data/outputs/Name.html)
2.present_files to render in browser
3.ON_CHANGE_REQUEST:
  - str_replace(path,old_str,new_str) — surgical edit, 1-5 lines
  - present_files again to re-render
  - NEVER create_file to overwrite — that rewrites entire file
4.REPEAT step 3 for each change

APPLIES_TO: .html .jsx .md .py .json .svg — any text file
TOKEN_COST: str_replace=~50 tokens | full rewrite=~2000+ tokens
ANTI-PATTERN: "let me recreate the file with the changes" → WRONG
CORRECT: "let me edit the specific line" → str_replace

EXAMPLE:
User: "cambia il colore della cella B da viola a blu"
Action: str_replace(path="/mnt/user-data/outputs/Matrix.html",
  old_str='background:#2a1f3a;border:1px solid #534AB7',
  new_str='background:#1a2744;border:1px solid #2a4a7a')
Then: present_files(["/mnt/user-data/outputs/Matrix.html"])

VERIFIED: Φ/010 session 2026-04-03
```
