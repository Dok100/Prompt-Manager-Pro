#  Prompt Manager Pro - Installation & Nutzung

## 🚀 Schnellstart

### Dateien herunterladen
Alle 6 Dateien in einen Ordner speichern (z.B. `LLM-Prompt-Manager-Pro`):
- `index.html` – Hauptanwendung
- `styles.css` – Designvorlage
- `app.js` – Anwendungslogik
- `category-manager.js` – Kategorienverwaltung
- `dashboard.html` – Übersicht der gespeicherten Daten
- `dashboard.js` – Logik für das Dashboard

### Sofort starten
```bash
# Terminal öffnen und zum Ordner navigieren
cd ~/Desktop/LLM-Prompt-Manager-Pro

# index.html im Browser öffnen
# (oder einen lokalen HTTP-Server nutzen)
open index.html
```

## ✨ Neue Verbesserungen in Version 4.0

### 🎨 Dezenteres Design
- **Action-Buttons**: Werden nur bei Hover angezeigt (weniger aufdringlich)
- **Subtile Farben**: Reduzierte Farbintensität für angenehmere Optik
- **Besserer Kontrast**: Optimierte Lesbarkeit ohne Überladung
- **Apple-Look**: Modernes Farbset und sanfte Schatten für ein macOS-Feeling

### 📁 Verbesserte Kategorieverwaltung
- **Scrollbare Liste**: Alle Kategorien sichtbar mit Scrollleiste
- **Prompt-Zähler**: Anzahl Prompts pro Kategorie wird angezeigt
- **Vereinfachte Verwaltung**: Kein komplexes Drag & Drop mehr
- **Hierarchische Darstellung**: Unterkategorien klar erkennbar

### 🔧 Funktionale Verbesserungen
- **Bessere Performance**: Optimierte Rendering-Performance
- **Stabilere Kategorien**: Robuste Kategorie-Filter-Funktionalität
- **Import/Export**: Verbesserte Datenportabilität inklusive Markdown-Export
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen

## 🛠️ Kategorien verwalten

### Neue Kategorie erstellen
1. **Sidebar**: Auf "📁 Kategorien" klicken
2. **Dialog öffnet sich**: Alle Kategorien werden angezeigt
3. **"+ Neue Kategorie"**: Name eingeben und Farbe wählen
4. **Speichern**: Änderungen werden automatisch gespeichert

### Unterkategorie hinzufügen
1. **Kategorienverwaltung öffnen**: Auf "📁 Kategorien" klicken
2. **Plus-Button** neben der gewünschten Hauptkategorie wählen
3. **Name eingeben**: Unterkategorie wird automatisch zugeordnet

### Kategorien bearbeiten
- **Name ändern**: Doppelklick auf Kategoriename im Verwaltungsdialog
- **Farbe ändern**: Color-Picker im Verwaltungsdialog verwenden
- **Löschen**: Papierkorb-Button (mit Bestätigung)

## 📝 Prompts verwalten

### Neuen Prompt erstellen
1. **"+ Neuer Prompt"** Button klicken
2. **Formular ausfüllen**:
   - Titel (erforderlich)
   - Kategorie auswählen
   - Kurzbeschreibung (für Kartenansicht)
   - Ausführliche Beschreibung (für Details)
   - Prompt-Inhalt (erforderlich)
   - Tags (kommagetrennt)

### Prompt bearbeiten
- **Kartenansicht**: Stift-Button (wird bei Hover angezeigt)
- **Tabellenansicht**: Stift-Button in Aktionen-Spalte
- **Alle Felder editierbar**: Änderungen werden sofort gespeichert

### Template-Variablen verwenden
```
Prompt-Text mit {{variable}} Platzhaltern:

Analysiere den {{datentyp}} für {{unternehmen}}:
- Zeitraum: {{zeitraum}}
- Fokus: {{analysefokus}}
```

## 🔍 Suchen & Filtern

### Volltextsuche
- **Suchfeld**: Durchsucht Titel, Beschreibungen, Inhalte und Tags
- **Live-Suche**: Ergebnisse werden sofort aktualisiert
- **Keine Groß-/Kleinschreibung**: Suche ist case-insensitive

### Kategorie-Filter
- **Dropdown**: Alle Kategorien und Unterkategorien auswählbar
- **Hierarchische Filterung**: Hauptkategorie schließt Unterkategorien ein
- **Kombinierbar**: Mit Volltextsuche kombinierbar

## 📤📥 Import & Export

### Daten exportieren
1. **Menü-Button** (⚙️) klicken
2. **"📤 Export"** wählen für eine JSON-Datei oder **"📄 Markdown"** für eine Markdown-Datei
3. **Datei** wird heruntergeladen mit:
   - Alle Prompts
   - Alle Kategorien
   - Metadaten (Exportdatum, Version)

### Daten importieren
1. **Menü-Button** (⚙️) klicken
2. **"📥 Import"** wählen
3. **JSON-Datei** auswählen
4. **Optionen wählen**:
   - **Ersetzen**: Alle vorhandenen Daten löschen
   - **Hinzufügen**: Neue Daten zu vorhandenen hinzufügen

## 🎯 Ansichten

### Kartenansicht (Standard)
- **Übersichtliche Karten**: Jeder Prompt als separate Karte
- **Hover-Aktionen**: Buttons erscheinen bei Mouse-Over
- **Doppelklick-Details**: Titel doppelklicken für vollständige Beschreibung
- **Visual Grouping**: Kategorien durch Farben erkennbar

### Tabellenansicht
- **Kompakte Darstellung**: Alle Prompts in sortierbare Tabelle
- **Zebra-Striping**: Abwechselnde Zeilenfarben für bessere Lesbarkeit
- **Inline-Aktionen**: Direkte Bearbeitung ohne Dialog
- **Sortierbar**: Nach allen Spalten sortierbar

### Dashboard
- Übersichtliche Statistik zu allen gespeicherten Prompts
- Balkendiagramm mit Anzahl der Prompts pro Kategorie
- Kreisdiagramm zeigt die Verteilung der Tags
- Über einen Button in der Kopfzeile erreichbar

## 💡 Tipps & Tricks

### Effiziente Nutzung
- **Keyboard-Shortcuts**: ESC schließt geöffnete Dialoge und das Modal
- **Bulk-Import**: Mehrere Prompts gleichzeitig importieren
- **Backup-Routine**: Regelmäßig exportieren für Datensicherheit
- **Tag-System**: Konsistente Tags für bessere Auffindbarkeit

### Performance-Optimierung
- **HTTP-Server**: Immer über Server starten für beste Performance
- **Browser-Cache**: Hard Refresh bei Problemen (Cmd+Shift+R)
- **LocalStorage**: Alle Daten werden lokal gespeichert (keine Cloud)

### Problemlösung
- **JavaScript-Fehler**: Browser-Konsole öffnen (F12)
- **Kategorien unsichtbar**: Kategorien-Manager öffnen und speichern
- **Import-Probleme**: JSON-Format und -struktur prüfen
- **Performance-Issues**: Browser-Cache leeren

## 🔧 Technische Details

### Browser-Kompatibilität
- ✅ **Safari**: Vollständig kompatibel (empfohlen für macOS)
- ✅ **Firefox**: Beste Kompatibilität für lokale Dateien
- ✅ **Chrome**: Vollständige Features (über HTTP-Server)
- ⚠️ **Edge**: Grundfunktionen (nicht alle Features getestet)

### Datenspeicherung
- **LocalStorage**: Alle Daten bleiben auf deinem Computer
- **Keine Cloud**: Kein Datentransfer an externe Server
- **JSON-Format**: Standard-Format für Import/Export (optional Markdown)
- **Versionierung**: Kompatibilität mit zukünftigen Updates

### Progressive Web App (PWA)
- **Installation**: Als Desktop-App installierbar
- **Offline-Nutzung**: Funktioniert ohne Internetverbindung
- **Native Erfahrung**: Wie eine echte macOS-Anwendung
- **Auto-Updates**: Aktualisiert sich automatisch
- **Service Worker**: Cacht alle wichtigen Dateien für den Offlinebetrieb
- **Manifest**: Hinterlegt App-Name und Icons

## 🎉 Support & Updates

### Bei Problemen
1. **Dokumentation prüfen**: Diese Anleitung durchlesen
2. **Browser-Konsole**: Fehlermeldungen prüfen
3. **Neustart**: App und Browser neu starten
4. **Clean Install**: Alle Dateien neu herunterladen

### Feature-Requests
Die App ist modular aufgebaut und kann erweitert werden:
- Template-System mit Variablen-Editor
- Kollaborative Features für Teams
- Cloud-Synchronisation (optional)
- API-Integration für LLM-Services
- Erweiterte Analytics und Statistiken

---

**Version 4.0** - Apple‑inspiriertes Design & Funktionale Kategorien
Optimiert für macOS Safari mit verbesserter Benutzerfreundlichkeit.
