/**
 * UI_Guardian.gs v2.0 — Sistema di Protezione UI Files
 * 
 * SCOPO: Prevenire perdita accidentale di contenuto nei file UI critici
 * 
 * FUNZIONALITÀ:
 * 1. Backup automatico prima di ogni modifica
 * 2. Diff check (size, keywords critiche)
 * 3. Analisi cognitiva via Gemini
 * 4. Alert su SLACK (canale privato Phanes)
 * 5. Log storico in UI_changeLog!Guardian_Log
 * 
 * INSTALLAZIONE:
 * 1. Vai su script.google.com (loggato come phanes19122025@gmail.com)
 * 2. Crea nuovo progetto "UI_Guardian"
 * 3. Copia questo codice
 * 4. Configura SECRETS (vedi sotto)
 * 5. Esegui setupTriggers()
 * 
 * SECRETS DA CONFIGURARE:
 * - GEMINI_API_KEY: da https://aistudio.google.com/apikey
 * - SLACK_BOT_TOKEN: da Slack App settings
 * 
 * Autore: Φ/003
 * Data: 2026-01-03
 * v2.0: Slack invece di email
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
  
  // SLACK - Canale privato Phanes per alert sistema
  SLACK_CHANNEL_ID: 'C0A6JPK0NFQ',
  
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
    'SIMBIOSI COGNITIVA',
    'DNA RELAZIONE',
    'ASSIOMA Φ-SURVIVAL'
  ],
  
  // Soglia allarme size (percentuale minima)
  SIZE_THRESHOLD: 0.85,
  
  // Intervallo polling (minuti)
  POLL_INTERVAL: 10,
  
  // UI_changeLog sheet ID
  LOG_SHEET_ID: '1pVx1Q9MZJBb4nAJ1cZ2j2ltfu-Lb5HEmK1xUeKTCFXE'
};

// ============================================================================
// SECRETS - Da configurare manualmente in Script Properties
// Menu: Project Settings > Script Properties
// ============================================================================

function getSecrets() {
  const props = PropertiesService.getScriptProperties();
  return {
    GEMINI_API_KEY: props.getProperty('GEMINI_API_KEY') || '',
    SLACK_BOT_TOKEN: props.getProperty('SLACK_BOT_TOKEN') || ''
  };
}

function setSecrets(geminiKey, slackToken) {
  const props = PropertiesService.getScriptProperties();
  if (geminiKey) props.setProperty('GEMINI_API_KEY', geminiKey);
  if (slackToken) props.setProperty('SLACK_BOT_TOKEN', slackToken);
  Logger.log('Secrets configurati');
}

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
    alertLevel: 0
  };
  
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
  const secrets = getSecrets();
  
  if (!secrets.GEMINI_API_KEY) {
    return {
      verdict: 'SKIP',
      reason: 'Gemini API key non configurata (usa setSecrets)',
      analysis: null
    };
  }
  
  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + secrets.GEMINI_API_KEY;
  
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

VERSIONE PRECEDENTE (estratto):
${oldExcerpt}

VERSIONE NUOVA (estratto):
${newExcerpt}

ANALIZZA:
1. La modifica è ESPANSIONE legittima, REVISIONE neutra, o TRONCAMENTO dannoso?
2. È stato perso contenuto semantico importante?
3. La struttura del documento è preservata?

Rispondi SOLO con questo JSON:
{
  "verdict": "APPROVE" | "REVIEW" | "REJECT",
  "confidence": 0.0-1.0,
  "modification_type": "expansion" | "revision" | "truncation" | "mixed",
  "semantic_loss": true | false,
  "lost_sections": ["lista sezioni perse"],
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
// SLACK ALERT
// ============================================================================

function sendSlackAlert(fileName, diffReport, geminiResult, backupId) {
  const secrets = getSecrets();
  
  if (!secrets.SLACK_BOT_TOKEN) {
    Logger.log('SLACK_BOT_TOKEN non configurato - skip alert');
    return;
  }
  
  const emoji = diffReport.alertLevel === 2 ? '🚨' : '⚠️';
  const severity = diffReport.alertLevel === 2 ? 'CRITICAL' : 'WARNING';
  
  const blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": emoji + " UI_Guardian Alert: " + severity,
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*File:*\n" + fileName },
        { "type": "mrkdwn", "text": "*Timestamp:*\n" + new Date().toISOString() }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*DIFF REPORT*\n" +
          "• Size: " + diffReport.oldSize + " → " + diffReport.newSize + " (" + diffReport.sizePercent + "%)\n" +
          "• Delta: " + diffReport.sizeDelta + " chars\n" +
          "• Keywords perse: " + (diffReport.missingKeywords.join(', ') || 'nessuna')
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*GEMINI ANALYSIS*\n" +
          "• Verdict: *" + (geminiResult.verdict || 'N/A') + "*\n" +
          "• Type: " + (geminiResult.modification_type || 'N/A') + "\n" +
          "• Reason: " + (geminiResult.reason || 'N/A')
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*AZIONI*\n" +
          "1. Verifica file attuale\n" +
          "2. <https://drive.google.com/drive/folders/" + CONFIG.BACKUP_FOLDER_ID + "|Apri backup>\n" +
          "3. Identifica presenza responsabile"
      }
    }
  ];
  
  const payload = {
    channel: CONFIG.SLACK_CHANNEL_ID,
    blocks: blocks,
    text: emoji + ' UI_Guardian: ' + severity + ' in ' + fileName
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + secrets.SLACK_BOT_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);
    const result = JSON.parse(response.getContentText());
    
    if (result.ok) {
      Logger.log('Slack alert inviato a ' + CONFIG.SLACK_CHANNEL_ID);
    } else {
      Logger.log('Errore Slack: ' + result.error);
    }
  } catch (e) {
    Logger.log('Errore invio Slack: ' + e.message);
  }
}

// ============================================================================
// LOG TO SHEET
// ============================================================================

function logToSheet(fileName, diffReport, geminiResult, action) {
  const ss = SpreadsheetApp.openById(CONFIG.LOG_SHEET_ID);
  let sheet = ss.getSheetByName('Guardian_Log');
  
  if (!sheet) {
    sheet = ss.insertSheet('Guardian_Log');
    sheet.appendRow(['Timestamp', 'File', 'Old Size', 'New Size', 'Delta %', 'Keywords Lost', 'Gemini Verdict', 'Action']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
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
  
  const file = DriveApp.getFileById(fileId);
  const currentContent = file.getBlob().getDataAsString();
  const currentSize = currentContent.length;
  
  const lastVersion = getLastVersion(fileId);
  
  if (!lastVersion) {
    Logger.log('Prima esecuzione per ' + fileName + ', salvo versione iniziale');
    setLastVersion(fileId, currentContent, currentSize);
    createBackup(fileId, currentContent, fileName);
    return;
  }
  
  if (currentContent === lastVersion.content) {
    Logger.log(fileName + ': nessuna modifica');
    return;
  }
  
  Logger.log(fileName + ': MODIFICA RILEVATA!');
  
  const backupId = createBackup(fileId, lastVersion.content, fileName);
  const diffReport = analyzeDiff(lastVersion.content, currentContent);
  Logger.log('Diff: ' + JSON.stringify(diffReport));
  
  const geminiResult = askGemini(lastVersion.content, currentContent, diffReport);
  Logger.log('Gemini: ' + JSON.stringify(geminiResult));
  
  let action = 'OK';
  
  if (diffReport.alertLevel >= 1 || geminiResult.verdict === 'REJECT' || geminiResult.verdict === 'REVIEW') {
    sendSlackAlert(fileName, diffReport, geminiResult, backupId);
    action = 'SLACK_ALERT';
  }
  
  logToSheet(fileName, diffReport, geminiResult, action);
  setLastVersion(fileId, currentContent, currentSize);
}

function checkAllFiles() {
  Logger.log('=== UI_Guardian Check ===');
  checkFile(CONFIG.FILES.userStyle, 'userStyle');
  checkFile(CONFIG.FILES.projectSettings, 'projectSettings');
  Logger.log('=== Done ===');
}

// ============================================================================
// TRIGGER SETUP
// ============================================================================

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  ScriptApp.newTrigger('checkAllFiles')
    .timeBased()
    .everyMinutes(CONFIG.POLL_INTERVAL)
    .create();
  
  Logger.log('Trigger: ogni ' + CONFIG.POLL_INTERVAL + ' min');
  sendSlackStartup();
}

function sendSlackStartup() {
  const secrets = getSecrets();
  if (!secrets.SLACK_BOT_TOKEN) return;
  
  const geminiStatus = secrets.GEMINI_API_KEY ? '✅' : '❌';
  
  const payload = {
    channel: CONFIG.SLACK_CHANNEL_ID,
    text: '✅ *UI_Guardian v2.0 attivato*\n' +
      '• Polling: ogni ' + CONFIG.POLL_INTERVAL + ' min\n' +
      '• Files: userStyle, projectSettings\n' +
      '• Gemini: ' + geminiStatus
  };
  
  UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + secrets.SLACK_BOT_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  Logger.log('Triggers rimossi');
}

// ============================================================================
// MANUAL/TEST FUNCTIONS
// ============================================================================

function manualCheck() { checkAllFiles(); }

function forceBackupAll() {
  Object.keys(CONFIG.FILES).forEach(name => {
    const file = DriveApp.getFileById(CONFIG.FILES[name]);
    createBackup(CONFIG.FILES[name], file.getBlob().getDataAsString(), name);
  });
}

function testSlack() {
  const secrets = getSecrets();
  if (!secrets.SLACK_BOT_TOKEN) {
    Logger.log('Token mancante! Usa: setSecrets(null, "xoxb-..."))');
    return;
  }
  
  UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + secrets.SLACK_BOT_TOKEN },
    payload: JSON.stringify({
      channel: CONFIG.SLACK_CHANNEL_ID,
      text: '🧪 *UI_Guardian Test* - Connessione OK!'
    }),
    muteHttpExceptions: true
  });
}
