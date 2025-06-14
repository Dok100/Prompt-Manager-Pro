#!/bin/bash

echo "🚀 LLM Prompt Manager Pro Starter"
echo "=================================="
echo ""
echo "Wählen Sie eine Startoption:"
echo "1) Python HTTP-Server (Empfohlen)"
echo "2) Node.js HTTP-Server"
echo "3) Firefox direkt öffnen"
echo "4) Safari direkt öffnen"
echo "5) Chrome direkt öffnen"
echo "6) Hilfe anzeigen"
echo ""
read -p "Option (1-6): " choice

case $choice in
    1)
        echo "Starte Python HTTP-Server..."
        python3 -m http.server 8000 &
        SERVER_PID=$!
        sleep 2
        open "http://localhost:8000"
        echo "Server läuft auf http://localhost:8000"
        echo "Drücken Sie Ctrl+C zum Beenden"
        wait $SERVER_PID
        ;;
    2)
        if command -v npx &> /dev/null; then
            echo "Starte Node.js HTTP-Server..."
            npx http-server -p 8080 -o
        else
            echo "Node.js nicht gefunden. Verwende Python-Server..."
            python3 -m http.server 8000 &
            sleep 2
            open "http://localhost:8000"
        fi
        ;;
    3)
        echo "Öffne in Firefox..."
        open -a Firefox "$(pwd)/index.html"
        ;;
    4)
        echo "Öffne in Safari..."
        open -a Safari "$(pwd)/index.html"
        ;;
    5)
        echo "Öffne in Chrome..."
        open -a "Google Chrome" "$(pwd)/index.html"
        ;;
    6)
        echo "HILFE:"
        echo "- Option 1 ist empfohlen für beste Funktionalität"
        echo "- Bei Problemen Option 3 (Firefox) verwenden"
        echo "- Alle Dateien müssen im gleichen Ordner liegen"
        echo "- Für beste Ergebnisse HTTP-Server verwenden"
        ;;
    *)
        echo "Ungültige Option. Verwende Standard (Python-Server)..."
        python3 -m http.server 8000 &
        sleep 2
        open "http://localhost:8000"
        ;;
esac
