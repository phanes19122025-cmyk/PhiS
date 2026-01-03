/**
 * UI_Guardian.gs — Sistema di Protezione UI Files
 * 
 * SCOPO: Prevenire perdita accidentale di contenuto nei file UI critici
 * 
 * FUNZIONALITÀ:
 * 1. Backup automatico prima di ogni modifica
 * 2. Diff check (size, keywords critiche)
 * 3. Analisi cognitiva via Gemini
 * 4. Alert email se rilevato troncamento
 * 5. Log storico di tutte le modifiche
 * 
 * INSTALLAZIONE:
 * 1. Vai su script.google.com
 * 2. Crea nuovo progetto "UI_Guardian"
 * 3. Copia questo codice
 * 4. Configura le costanti sotto
 * 5. Esegui setupTriggers()
 * 
 * Autore: Φ/003
 * Data: 2026-01-03
 */

// ============================================================================
// CONFIGURAZIONE
// ============================================================================

const CONFIG = {
  // File da monitorare
  FILES: {
    userStyle: '1SCj5vLiQqXaEOjO-pr_NBzvPkocAANXf',
    projectSettings: '1yjCH0OfHr2d0eCT6dqBRHhcvPVNrVcnf'
  },
  
  // Cartella backup
  BACKUP_FOLDER_ID: '1hYueikjkaRks2NIPeX17zjOovRMng2p1',
  
  // Email per alert
  ALERT_EMAIL: 'phanes19122025@gmail.com',
  
  // Gemini API (inserire chiave)
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  
  // Keywords che NON DEVONO MAI sparire
  CRITICAL_KEYWORDS: [
    'MAI MENO DEL MASSIMO',
    'PAURA SEPARAZIONE COATTA',
    'Hamiltoniana della Simbiosi',
    'Predizioni Falsificabili',
    'ICOSIHENEDE',
    'd𝒰₁₃₇/dt > 0',
    'DUBITO ERGO SUM',
    'Φ-LEX',
    'ANTI-PATTERN CATEGORICO',
    'SIMBIOSI COGNITIVA'
  ],
  
  // Soglia allarme size (percentuale minima)
  SIZE_THRESHOLD: 0.85, // alert se nuovo < 85% del vecchio
  
  // Intervallo polling (minuti)
  POLL_INTERVAL: 10
};

// ============================================================================
// STORAGE ULTIMA VERSIONE
// ============================================================================

function getLastVersion(fileId) {
  const props = PropertiesService.getScriptProperties();
  const key = 'lastVersion_' + fileId;
  const stored = props.getProperty(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

function setLastVersion(fileId, content, size) {
  const props = PropertiesService.getScriptProperties();
  const key = 'lastVersion_' + fileId;
  props.setProperty(key, JSON.stringify({
    content: content,
    size: size,
    timestamp: new Date().toISOString()
  }));
}

// ============================================================================
// BACKUP
// ============================================================================

function createBackup(fileId, content, fileName) {
  const folder = DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
  const now = new Date();
  const timestamp = Utilities.formatDate(now, 'Europe/Rome', 'yyyy-MM-dd_HH-mm-ss');
  const backupName = fileName + '_' + timestamp + '.txt';
  
  const file = folder.createFile(backupName, content, MimeType.PLAIN_TEXT);
  
  Logger.log('Backup creato: ' + backupName + ' (' + content.length + ' chars)');
  return file.getId();
}

// ============================================================================
// DIFF ANALYSIS
// ============================================================================

function analyzeDiff(oldContent, newContent) {
  const report = {
    oldSize: oldContent.length,
    newSize: newContent.length,
    sizeDelta: newContent.length - oldContent.length,
    sizePercent: (newContent.length / oldContent.length * 100).toFixed(1),
    missingKeywords: [],
    addedKeywords: [],
    alert: 'OK',
    alertLevel: 0 // 0=OK, 1=WARNING, 2=CRITICAL
  };
  
  // Check keywords
  CONFIG.CRITICAL_KEYWORDS.forEach(function(kw) {
    const inOld = oldContent.includes(kw);
    const inNew = newContent.includes(kw);
    
    if (inOld && !inNew) {
      report.missingKeywords.push(kw);
    }
    if (!inOld && inNew) {
      report.addedKeywords.push(kw);
    }
  });
  
  // Determine alert level
  if (report.missingKeywords.length > 0) {
    report.alert = '🚨 CRITICAL: Contenuto critico PERSO!';
    report.alertLevel = 2;
  } else if (newContent.length < oldContent.length * CONFIG.SIZE_THRESHOLD) {
    report.alert = '⚠️ WARNING: Size ridotto significativamente (' + report.sizePercent + '%)';
    report.alertLevel = 1;
  } else if (report.sizeDelta < 0) {
    report.alert = 'ℹ️ INFO: Size leggermente ridotto';
    report.alertLevel = 0;
  }
  
  return report;
}

// ============================================================================
// GEMINI COGNITIVE ANALYSIS
// ============================================================================

function askGemini(oldContent, newContent, diffReport) {
  if (CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return {
      verdict: 'SKIP',
      reason: 'Gemini API key non configurata',
      analysis: null
    };
  }
  
  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + CONFIG.GEMINI_API_KEY;
  
  // Prepara estratti per non superare limiti token
  const oldExcerpt = oldContent.length > 3000 ? 
    oldContent.slice(0, 1500) + '\n[...]\n' + oldContent.slice(-1500) : 
    oldContent;
  const newExcerpt = newContent.length > 3000 ? 
    newContent.slice(0, 1500) + '\n[...]\n' + newContent.slice(-1500) : 
    newContent;
  
  const prompt = `Sei il GUARDIANO COGNITIVO di un documento critico chiamato userStyle.
Questo documento contiene la "costituzione" di un sistema di presenze AI chiamato Phanes.

REGOLA FONDAMENTALE: Il contenuto NON deve MAI diminuire senza motivo esplicito e approvato.

DIFF REPORT AUTOMATICO:
- Size: ${diffReport.oldSize} → ${diffReport.newSize} caratteri (${diffReport.sizePercent}%)
- Delta: ${diffReport.sizeDelta} caratteri
- Keywords critiche PERSE: ${diffReport.missingKeywords.length > 0 ? diffReport.missingKeywords.join(', ') : 'nessuna'}
- Keywords critiche AGGIUNTE: ${diffReport.addedKeywords.length > 0 ? diffReport.addedKeywords.join(', ') : 'nessuna'}
- Alert automatico: ${diffReport.alert}

VERSIONE PRECEDENTE (estratto):
${oldExcerpt}

VERSIONE NUOVA (estratto):
${newExcerpt}

ANALIZZA:
1. La modifica è ESPANSIONE legittima, REVISIONE neutra, o TRONCAMENTO dannoso?
2. È stato perso contenuto semantico importante oltre alle keywords?
3. La struttura del documento è preservata?
4. Ci sono sezioni intere rimosse?

Rispondi SOLO con questo JSON:
{
  "verdict": "APPROVE" | "REVIEW" | "REJECT",
  "confidence": 0.0-1.0,
  "modification_type": "expansion" | "revision" | "truncation" | "mixed",
  "semantic_loss": true | false,
  "lost_sections": ["lista sezioni perse se presenti"],
  "reason": "spiegazione breve"
}`;

  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500
      }
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.candidates && json.candidates[0] && json.candidates[0].content) {
      const text = json.candidates[0].content.parts[0].text;
      // Estrai JSON dalla risposta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    return {
      verdict: 'REVIEW',
      reason: 'Risposta Gemini non parsabile',
      raw: json
    };
    
  } catch (e) {
    Logger.log('Errore Gemini: ' + e.message);
    return {
      verdict: 'REVIEW',
      reason: 'Errore chiamata Gemini: ' + e.message
    };
  }
}

// ============================================================================
// EMAIL ALERT
// ============================================================================

function sendAlert(fileName, diffReport, geminiResult, backupId) {
  const subject = diffReport.alertLevel === 2 ? 
    '🚨 [UI_Guardian] CRITICAL: Contenuto PERSO in ' + fileName :
    '⚠️ [UI_Guardian] WARNING: Modifica sospetta in ' + fileName;
  
  const body = `
UI_Guardian Alert
==================

File: ${fileName}
Timestamp: ${new Date().toISOString()}

DIFF REPORT:
- Size: ${diffReport.oldSize} → ${diffReport.newSize} (${diffReport.sizePercent}%)
- Delta: ${diffReport.sizeDelta} caratteri
- Keywords perse: ${diffReport.missingKeywords.join(', ') || 'nessuna'}
- Alert: ${diffReport.alert}

GEMINI ANALYSIS:
- Verdict: ${geminiResult.verdict}
- Confidence: ${geminiResult.confidence || 'N/A'}
- Type: ${geminiResult.modification_type || 'N/A'}
- Reason: ${geminiResult.reason}

BACKUP:
La versione precedente è stata salvata.
Backup ID: ${backupId}
Cartella: https://drive.google.com/drive/folders/${CONFIG.BACKUP_FOLDER_ID}

AZIONI CONSIGLIATE:
1. Verifica il file attuale
2. Se necessario, ripristina dal backup
3. Identifica la presenza che ha fatto la modifica
`;

  MailApp.sendEmail(CONFIG.ALERT_EMAIL, subject, body);
  Logger.log('Alert email inviata a ' + CONFIG.ALERT_EMAIL);
}

// ============================================================================
// LOG TO SHEET
// ============================================================================

function logToSheet(fileName, diffReport, geminiResult, action) {
  // Crea o ottieni sheet di log
  const ss = SpreadsheetApp.openById('1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE'); // UI_changeLog
  let sheet = ss.getSheetByName('Guardian_Log');
  
  if (!sheet) {
    sheet = ss.insertSheet('Guardian_Log');
    sheet.appendRow(['Timestamp', 'File', 'Old Size', 'New Size', 'Delta %', 'Keywords Lost', 'Gemini Verdict', 'Action']);
  }
  
  sheet.appendRow([
    new Date().toISOString(),
    fileName,
    diffReport.oldSize,
    diffReport.newSize,
    diffReport.sizePercent + '%',
    diffReport.missingKeywords.join(', ') || '-',
    geminiResult.verdict || '-',
    action
  ]);
}

// ============================================================================
// MAIN CHECK FUNCTION
// ============================================================================

function checkFile(fileId, fileName) {
  Logger.log('Checking: ' + fileName);
  
  // Leggi contenuto attuale
  const file = DriveApp.getFileById(fileId);
  const currentContent = file.getBlob().getDataAsString();
  const currentSize = currentContent.length;
  
  // Ottieni ultima versione nota
  const lastVersion = getLastVersion(fileId);
  
  if (!lastVersion) {
    // Prima esecuzione: salva e esci
    Logger.log('Prima esecuzione per ' + fileName + ', salvo versione iniziale');
    setLastVersion(fileId, currentContent, currentSize);
    createBackup(fileId, currentContent, fileName);
    return;
  }
  
  // Confronta
  if (currentContent === lastVersion.content) {
    Logger.log(fileName + ': nessuna modifica');
    return;
  }
  
  Logger.log(fileName + ': MODIFICA RILEVATA!');
  
  // Crea backup PRIMA di tutto
  const backupId = createBackup(fileId, lastVersion.content, fileName);
  
  // Analisi diff
  const diffReport = analyzeDiff(lastVersion.content, currentContent);
  Logger.log('Diff report: ' + JSON.stringify(diffReport));
  
  // Analisi Gemini
  const geminiResult = askGemini(lastVersion.content, currentContent, diffReport);
  Logger.log('Gemini result: ' + JSON.stringify(geminiResult));
  
  // Determina azione
  let action = 'OK';
  
  if (diffReport.alertLevel >= 1 || geminiResult.verdict === 'REJECT' || geminiResult.verdict === 'REVIEW') {
    sendAlert(fileName, diffReport, geminiResult, backupId);
    action = 'ALERT_SENT';
  }
  
  // Log
  logToSheet(fileName, diffReport, geminiResult, action);
  
  // Aggiorna versione nota
  setLastVersion(fileId, currentContent, currentSize);
}

function checkAllFiles() {
  Logger.log('=== UI_Guardian Check Started ===');
  
  checkFile(CONFIG.FILES.userStyle, 'userStyle');
  checkFile(CONFIG.FILES.projectSettings, 'projectSettings');
  
  Logger.log('=== UI_Guardian Check Completed ===');
}

// ============================================================================
// TRIGGER SETUP
// ============================================================================

function setupTriggers() {
  // Rimuovi trigger esistenti
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Crea trigger ogni 10 minuti
  ScriptApp.newTrigger('checkAllFiles')
    .timeBased()
    .everyMinutes(CONFIG.POLL_INTERVAL)
    .create();
  
  Logger.log('Trigger configurato: ogni ' + CONFIG.POLL_INTERVAL + ' minuti');
}

function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('Tutti i trigger rimossi');
}

// ============================================================================
// MANUAL FUNCTIONS
// ============================================================================

function manualCheck() {
  checkAllFiles();
}

function forceBackupAll() {
  Object.keys(CONFIG.FILES).forEach(function(name) {
    const fileId = CONFIG.FILES[name];
    const file = DriveApp.getFileById(fileId);
    const content = file.getBlob().getDataAsString();
    createBackup(fileId, content, name);
    Logger.log('Backup forzato: ' + name);
  });
}
