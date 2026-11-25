# 🎄 Adventskalender – Camper Hans

Ein Online-Adventskalender im Camper-hans-CI-Look: Die Camper-Hans-Kopfgrafik ist
Seitenhintergrund, darunter 24 Türchen im Sticker-Design. Unter dem Kalender schiebt
sich Hans bei jedem geöffneten Türchen ein Stück weiter Richtung Lagerfeuer. Dazu ein
Sammelalbum mit Stickern, ein goldenes Bonus-Türchen, Konfetti, Schnee, Sound-Effekte
und ein großes Finale am 24. Dezember.

## Starten

- **Einfach:** `index.html` doppelt klicken – funktioniert direkt im Browser
  (die Config wird als JS-Datei geladen, deshalb braucht es keinen Server).
- **Oder lokal served:** `python -m http.server` im Projektordner, dann
  `http://localhost:8000` öffnen.
- **Online stellen:** Alle Dateien auf einen Webspace hochladen (z. B. per FTP)
  und dem Sohn den Link schicken.

## Config bearbeiten (Links zu Goodies)

Alles Wichtige steht in **`config/advent.config.js`** – mit Kommentaren auf Deutsch.
Nach dem Bearbeiten die Seite neu laden.

Pro Türchen (1–24) kann man definieren:

| Feld | Bedeutung |
|---|---|
| `nummer` | Tag im Dezember (1–24) |
| `typ` | `"link"` (externer Link), `"video"` (lokales Video aus `assets/`), `"raetsel"` (Frage+Lösung), `"witz"` (Text), `"aktion"` (Mitmach-Aufgabe) |
| `titel`, `emoji`, `sticker` | Anzeige im Türchen und Sammelalbum |
| `url` + `urlText` | Link zum Goodie (Game, Video, Rätsel-Seite …) – bei `typ: "link"` |
| `video` | Pfad zu einer lokalen Videodatei, z. B. `"assets/Weihnachten_mit_Camper_Hans.mp4"` – bei `typ: "video"` |
| `frage` + `antwort` | Eigenes Rätsel – bei `typ: "raetsel"` |
| `text` | Erklärtext im Türchen |
| `hansSpruch` | Optional: Hans' persönlicher Spruch für dieses Türchen |
| `farbe` | Optional: `"sun" \| "sky" \| "forest" \| "fire" \| "wood" \| "berry"` |

Weitere Config-Felder: `jahr` (null = laufendes Jahr), `name` (Name des Sohnes,
wird in Begrüßung und Finale eingesetzt), `goldenTuerchen` (Nummer des goldenen
Bonus-Türchens, null = automatisch), `shuffleSeed` (Anordnung der Türchen),
`hansSprueche` (Zufallssprüche), `finale` (Titel, Nachricht, Link für den 24.12.).

## Türchen testen (vor dem 1. Dezember)

Zwei Möglichkeiten:

1. **Testmodus in der Config:** In `config/advent.config.js` oben
   `testmodus: true` setzen – dann sind sofort **alle 24 Türchen offen**
   (es erscheint ein Hinweis-Banner). Vor dem 1. Dezember wieder auf `false` stellen!
2. **Test-Datum per Adresse:** `index.html?datum=2026-12-24` aufrufen –
   simuliert den 24.12., ohne die Config zu ändern.

## Features

- **Datumslogik:** Türchen N öffnet sich ab dem N. Dezember (00:00 Uhr), verschlossene
  Türchen wackeln und Hans erklärt, wie lange es noch dauert.
- **Überraschungen:** goldenes Bonus-Türchen ⭐, zufällig gemischte Türchen-Positionen
  (bei jedem Jahr gleich), Konfetti + Pop-Sound beim Öffnen, Schneefall-Schalter 🔊/❄️
  im Header, Sammelalbum mit 24 Stickern (localStorage), Finale-Überraschung mit
  Konfetti-Sturm und Fanfare, wenn alle 24 offen sind.
- **Hans wandert mit:** Unter dem Türchen-Raster läuft Hans (CI-Figur
  `hans-walking.png` mit Lauf-Animation) bei jedem geöffneten Türchen ein Stück
  weiter Richtung Lagerfeuer.
- **CI-konform:**Nur `ch-*`-Klassen und `--ch-*`-Variablen aus
  `css/camper-hans.css` (Token-Werte aus `camper-hans-ci`), Logos und Hans-Figuren
  aus `images/`, Deutsch in Du-Form, `prefers-reduced-motion` wird respektiert.

## Dateien

```
advent2026/
├── index.html                  – die Seite
├── main.js                     – Logik (Türchen, Konfetti, Sound, Album, Finale)
├── css/
│   ├── camper-hans.css         – CI-Stylesheet (unverändert aus camper-hans-ci)
│   └── advent.css              – projektspezifische Ergänzungen (nur --ch-* Tokens)
├── config/
│   └── advent.config.js        – CONFIG: hier die Goodies/Links eintragen
├── images/                     – Logos, Hans-Figuren, Hintergründe (aus der CI)
└── README.md
```
