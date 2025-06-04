# 📘 Lernkarten PWA – Projekt-Dokumentation (Lern.IO)

## 🧠 Projektbeschreibung

In diesem Projekt wurde eine Lern-website als auch PWA für folgende Lernmöglichkeiten erstellt:
 - Mathe
 - Geschichte (REST-API)
 - Noten lernen (inkl. Akkorde)
 - Internettechnologie

Dabei wurden die Programmiersprachen HTML, CSS, JavaScript als auch JSON als Dateiformat genutzt.
Um die REST-API dynamisch via Ajax abzufragen, wurde fetch() verwendet, eine in JavaScript benutzte Serverabfrage, welche es ermöglicht ohne Seiten-neuladen, neue Fragen zu laden.
JSON wurde verwendet um eigens erstellte Fragen aus IT, Mathe und Noten zu speichern. 
Damit die Website als auch die PWA Offline funktioniert, war es nötig einen ServiceWorker (sw.js) zu implementieren. Durch CSS wurden Designelemente hinzugefügt. Die Logik für die Fragenabfrage ist Bestandteil von questionloader.js. 
Um die Mathe- als auch Noten-Fragen ordentlich darzustellen, wurde KaTex und VexFlow als Plugin benutzt.

## 📁 Verzeichnisstruktur

LERNPROGRAMM/
├── images/                      # Icons und Grafiken
├── mvp-demo/                   # Ihr eigenes Beispiel
├── scripts/                    # Hauptverzeichnis für Anwendungscode
│   ├── css/
│   │   └── style.css           # Zentrales Stylesheet
│   ├── html/
│   │   └── index.html          # Hauptseite der Web-App
│   ├── js/
│   │   ├── navigation.js       # View-Logik & Navigation-Logik
│   │   ├── questionloader.js   # Fragenlogik für alle Kategorien
│   │   └── rest.js             # REST-Kommunikation (Geschichte)
│   └── json/
│       ├── fragen.json         # Lokale Fragen (Mathe, IT, Noten)
│       └── manifest.json       # Manifest für PWA-Funktionalität
├── sw.js                       # Service Worker für Offline-Caching
├── README.md                   # Projektdokumentation
├── Beleg-Aufgabenstellung.md   # Originale Aufgabenstellung
├── Beleg-Abgabeformat.md       # Abgabeformat
├── mathe-demo.html             # (Test-Version von Ihnen)

---

## 🚀 Startanleitung

Durch das Plugin Live-Server via VSCode kann man die Website starten indem man auf die HTML klickt und "Open with Live-Server" wählt.
Sollte man die Website via Konsole starten wollen, so muss man folgendes im Terminal ausführen:

Pfad zum Hauptverzeichnis:
cd pfad/zum/LERNPROGRAMM

Server starten:
python -m http.server 5500

Link zur Hauptseite:
http://127.0.0.1:5500/scripts/html/index.html

---

## 🔄 Offline-Unterstützung

Im Webbrowser wird eine Offline-Funktionalität gewährleistet. Jedoch kann der ServiceWorker die Fragen.json für die PWA nicht cashen, womit dann die PWA in der Offline-Nutzung keine Fragen anzeigt. Außerdem funktioniert die Online/Offline Anzeige in der PWA aus unerklärlichen Gründen nicht.

---
# REST-Nutzung

Fragen der Kategorie Geschichte werden über folgende REST-Schnittstelle geladen:

GET https://idefix.informatik.htw-dresden.de/webquiz/api/quizzes
POST `https://idefix.informatik.htw-dresden.de/webquiz/api/quizzes/{id}/solve
Authentifizierung via Basic Auth (Benutzername: s86480). Die Antworten werden serverseitig überprüft.

---

## 🧪 Testhinweise

- Wie man Offline testet: DevTools → Application → Service Worker → „Offline“ aktivieren
- Wie man PWA installiert: Im Browser Menü gibt es ein Button (meistens neben der Addresszeile), dort kann man sich die PWA installieren.

# 👨Entwickler
Name: Benjamin Banse
Matrikelnummer: s86480
Studiengang: IA23

# Nutzung von ChatGPT als KI-Unterstützung

Für die Planung, Strukturierung und Codierung wurde ChatGPT (GPT-4, Mai 2025) unterstützend eingesetzt, insbesondere für:

- Hilfe bei Basic Auth
- Fehlerbehebung/Debugging im Offline-Modus
- Implementierung von VexFlow und KaTeX
- Erstellung von Fragen für Quizzes
- Debugging von REST-API / Fehlerbehebung
- Erstellung von Icons -> Bildgenerierung

Alle Inhalte wurden verstanden und im Kontext der Aufgabenstellung angepasst.
