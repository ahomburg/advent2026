/* ============================================================
   Adventskalender – CONFIG-DATEI
   ------------------------------------------------------------
   Hier trägst du alle Türchen und Goodies ein. Einfach die
   Felder unten anpassen: Links, Rätsel, Witze, Aktionen …
   Kommentare (// ...) sind erlaubt.

   WICHTIG: Diese Datei nicht löschen und die Klammern am Ende
   nicht verändern. Nach dem Bearbeiten: Seite neu laden.
   ============================================================ */

window.ADVENT_CONFIG = {

  /* Jahr des Advents. null = automatisch das laufende Jahr. */
  jahr: null,

  /* TESTMODUS: true = alle 24 Türchen sofort offen (zum Vorab-Testen).
     Vor dem 1. Dezember wieder auf false stellen! */
  testmodus: true,

  /* Titel, der im Kopf der Seite angezeigt wird */
  titel: "Advents-Camping mit Hans",
  untertitel: "24 Türchen, ein goldenes Extra und eine große Überraschung am Ende!",

  /* Name deines Sohnes – wird in der Begrüßung und im Finale verwendet */
  name: "",

  /* Welches Türchen ist das goldene Bonus-Türchen?
     null = wird automatisch ausgewürfelt (aber immer gleich). */
  goldenTuerchen: 17,

  /* Fester Startmonat des Advents (12 = Dezember) */
  monat: 12,

  /* Zufalls-Seed fürs Mischen der Türchen – ändern für neue Anordnung */
  shuffleSeed: 2026,

  /* Sprüche, die Hans zufällig in den Türchen sagt */
  hansSprueche: [
    "Zelt auf, Lächeln an!",
    "Draußen ist der beste Ort.",
    "Kaffee ans Lagerfeuer, wir starten!",
    "Heute wird ein guter Tag – versprochen!",
    "Der beste URLAUB ist der, den man zuhause hat. Fast.",
    "Marshmallows schmecken am Feuer am besten!",
    "Immer der Nase nach – äh, dem Stern nach!"
  ],

  /* Die 24 Türchen. "nummer" = Tag im Dezember (1–24).
     typ: "link" (externer Link) | "raetsel" (Frage + Antwort)
          | "witz" (Text) | "aktion" (Mitmach-Aktion ohne Link)
     Pflicht: nummer, titel, typ, emoji, sticker
     Optional: url + urlText, text, frage + antwort, hansSpruch, farbe
     farbe: "sun" | "sky" | "forest" | "fire" | "wood" | "berry" */
  tuerchen: [
    { nummer: 1,  typ: "link",   titel: "Spiele-Paradies",        emoji: "🎮", sticker: "🚐", farbe: "forest",
      url: "https://poki.com", urlText: "Zu Poki spielen",
      text: "Über 100 kostenlose Browsergames – such dir eins aus!" },

    { nummer: 2,  typ: "raetsel", titel: "Hans' kniffliges Rätsel", emoji: "🧩", sticker: "🧭",
      frage: "Was wird nasser, je mehr es trocknet?",
      antwort: "Das Handtuch!" },

    { nummer: 3,  typ: "witz",   titel: "Der sprechende Muffin",  emoji: "😂", sticker: "🍪", farbe: "sun",
      text: "Treffen sich zwei Muffins im Ofen. Sagt das eine: „Puh, ist das heiß hier!“ Sagt das andere: „Hilfe, ein sprechendes Muffin!“" },

    { nummer: 4,  typ: "link",   titel: "Welt-Entdecker",         emoji: "🌍", sticker: "🏔️",
      url: "https://www.geoguessr.com", urlText: "GeoGuessr spielen",
      text: "Du wirst irgendwo auf der Welt ausgesetzt – errate, wo!" },

    { nummer: 5,  typ: "link",   titel: "KI zeichnen lassen",     emoji: "🎨", sticker: "🎨", farbe: "sky",
      url: "https://quickdraw.withgoogle.com", urlText: "Quick Draw starten",
      text: "Zeichne z. B. „Camper“ – erkennt die KI deinen Strich?" },

    { nummer: 6,  typ: "raetsel", titel: "Karten-Rätsel",          emoji: "🗺️", sticker: "🗺️",
      frage: "Ich habe Städte, aber keine Häuser. Wälder, aber keine Bäume. Wasser, aber keine Fische. Was bin ich?",
      antwort: "Eine Landkarte!" },

    { nummer: 7,  typ: "link",   titel: "Malen mit Freunden",     emoji: "🖌️", sticker: "🖌️", farbe: "berry",
      url: "https://skribbl.io", urlText: "skribbl.io öffnen",
      text: "Kostenlos im Browser: Einer malt, die anderen raten. Chaos garantiert!" },

    { nummer: 8,  typ: "link",   titel: "Gaming-Musik",           emoji: "🎵", sticker: "🎧",
      url: "https://www.youtube.com/results?search_query=gaming+music+mix+2026", urlText: "Playlist anhören",
      text: "Lofi oder epische Gaming-Musik – such dir was aus!" },

    { nummer: 9,  typ: "link",   titel: "Die verrückte Welt von neal.fun", emoji: "🔬", sticker: "🪐", farbe: "sky",
      url: "https://neal.fun", urlText: "neal.fun entdecken",
      text: "Wikipedia-Rankings, Sternenhimmel-Simulator und mehr – alles interaktiv!" },

    { nummer: 10, typ: "raetsel", titel: "Loch-Rätsel",            emoji: "🕳️", sticker: "🕳️",
      frage: "Je mehr du davon nimmst, desto größer wird es. Was ist das?",
      antwort: "Ein Loch!" },

    { nummer: 11, typ: "link",   titel: "Tier-Videos",            emoji: "🐶", sticker: "🦊",
      url: "https://www.youtube.com/results?search_query=lustige+tiere+2026", urlText: "Videos anschauen",
      text: "Lustige Tiere – garantiert gute Laune!" },

    { nummer: 12, typ: "witz",   titel: "Geist im Klassenzimmer", emoji: "👻", sticker: "👻", farbe: "sun",
      text: "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsieht!" },

    { nummer: 13, typ: "link",   titel: "Telefon zeichnen",       emoji: "📞", sticker: "📞", farbe: "berry",
      url: "https://garticphone.com", urlText: "Gartic Phone spielen",
      text: "Wie „Stille Post“ mit Zeichnen: Was kommt am Ende raus?" },

    { nummer: 14, typ: "link",   titel: "Programmieren lernen",   emoji: "💻", sticker: "💻",
      url: "https://code.org/games", urlText: "Zu den Code-Games",
      text: "Spiele dich durch Minecraft, Star Wars & Co. und lerne dabei programmieren!" },

    { nummer: 15, typ: "raetsel", titel: "Münz-Rätsel",            emoji: "🪙", sticker: "🪙",
      frage: "Was hat einen Kopf und einen Schwanz, aber keine Beine?",
      antwort: "Eine Münze!" },

    { nummer: 16, typ: "link",   titel: "Mathe-Games",            emoji: "🧮", sticker: "🧮", farbe: "forest",
      url: "https://www.coolmathgames.com", urlText: "Coolmath Games öffnen",
      text: "Knobelspiele, die heimlich schlau machen." },

    { nummer: 17, typ: "link",   titel: "GOLDENES TÜRCchen ⭐",    emoji: "⭐", sticker: "⭐", farbe: "sun",
      url: "https://neal.fun/earth-reviews/", urlText: "Die strengste Bewertung der Welt",
      text: "Das goldene Bonus-Türchen! Heute gibt es ein ganz besonderes Extra – schau genau hin!",
      hansSpruch: "Gold wertvoll ist nur das, was Freude macht!" },

    { nummer: 18, typ: "aktion", titel: "Hampelmann-Challenge",   emoji: "🤸", sticker: "🤸",
      text: "Mach heute 20 Hampelmänner – und wer mag, filmt es für die Familie!" },

    { nummer: 19, typ: "raetsel", titel: "Uhren-Rätsel",           emoji: "⏰", sticker: "⏰",
      frage: "Was läuft und läuft, hat aber keine Beine?",
      antwort: "Eine Uhr (oder das Wasser im Bach)!" },

    { nummer: 20, typ: "link",   titel: "Fails & Wins",           emoji: "🛹", sticker: "🛹", farbe: "sky",
      url: "https://www.youtube.com/results?search_query=beste+fails+2026", urlText: "Videos anschauen",
      text: "Die lustigsten Fails und krassesten Tricks aus dem Netz." },

    { nummer: 21, typ: "witz",   titel: "Die wanderende Gurke",   emoji: "🥒", sticker: "🥒", farbe: "forest",
      text: "Was ist grün und rennt durch den Wald? Ein Rudel Gurken!" },

    { nummer: 22, typ: "link",   titel: "Scratch-Projekte",       emoji: "🐱", sticker: "🐱",
      url: "https://scratch.mit.edu/explore/projects/all", urlText: "Projekte entdecken",
      text: "Von anderen Kids programmierte Spiele – spiel eins oder schau, wie es gebaut ist!" },

    { nummer: 23, typ: "aktion", titel: "Kakao am Fenster",       emoji: "☕", sticker: "☕",
      text: "Heute 5 Minuten mit warmem Kakao am Fenster sitzen und die Welt draußen beobachten.",
      hansSpruch: "Die besten Pausen sind die draußen!" },

    { nummer: 24, typ: "link",   titel: "DAS FINALE!",            emoji: "🎄", sticker: "🎄", farbe: "fire",
      url: "https://www.youtube.com/results?search_query=weihnachtsfilme+kurz+2026", urlText: "Finale-Video",
      text: "Heiligabend! Hans lädt dich zu einem besonderen Film ein – und danach wartet noch eine Überraschung auf dich …" }
  ],

  /* Die große Überraschung, wenn alle 24 Türchen offen sind */
  finale: {
    titel: "Geschafft – alle 24 Türchen!",
    emoji: "🔥",
    nachricht: "Du hast den ganzen Advent durchgehalten – Hans ist mächtig stolz auf dich! Hier ist dein Lagerfeuer-Moment:",
    url: "https://www.youtube.com/results?search_query=lagerfeuer+weihnachtslieder+2026",
    urlText: "Lagerfeuer-Playlist starten"
  }
};
