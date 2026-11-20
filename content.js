/* ==========================================================================
   ALLE TEKSTEN VAN DE APP STAAN IN DIT BESTAND.

   Zo pas je iets aan:
   - Verander alleen wat tussen de "aanhalingstekens" staat.
   - Laat de aanhalingstekens, dubbele punten en komma's aan het eind staan.
   - Gebruik in een tekst geen " (dubbel aanhalingsteken). Een ' mag wel.
   - Woorden links van de dubbele punt (titel:, tekst:, naam:) niet veranderen.

   Volgorde: eerst de algemene pagina's (felicitatie, cadeaus, welterusten),
   dan de knoppen, dan de stops van onder naar boven in de boom.
   De laatste stop is de ster (Bar Brio), met daarin het toetje en de kamer.
   Foto's: "naam.jpg" verwijst naar een fotobestand dat los naast dit bestand staat.
   ========================================================================== */

window.CONTENT = {
  naam: "Jill",
  leeftijd: 22,
  datum: "2026-12-01",

  knop: "Zet de kerstlampjes aan",

  felicitatie: {
    titel: "Gefeliciteerd!",
    liefde: "Ik hou van jou.",
    tekst: "Vandaag is helemaal van jou. Keulen, kerstmarkten, eten, drinken en vast nog een verrassing. De lampjes staan aan, dus we gaan.",
    knop: "Naar je boom",
  },

  uitleg: {
    titel: "Dit is je dag",
    tekst: "Elke bal is een stop, de slinger is ons pad. Een bal gaat pas open als het zover is, en zodra we verder gaan, gaat er een stukje van de slinger branden. De ster bovenin is voor vanavond.",
  },

  // ---------- Knoppen en kopjes ----------
  // Alle vaste teksten op knoppen en boven blokken. Pas gerust aan.
  knoppen: {
    laatZien: "Laat zien",
    weZijnEr: "We zijn er",
    tikPakje: "Tik op het pakje.",
    eetsmakelijk: "Eetsmakelijk!",
    verder: "Verder",
    slaapLekker: "Slaap lekker",
    opPad: "Op pad!",
    looproute: "Looproute",
    terugHotel: "Terug naar het hotel",
    routeHotel: "Route naar het hotel",
    binnen: "We zijn binnen",
    kiesMuziek: "Kies de muziek",
    opReis: "Op reis!",
    proost: "Proost!",
    klaarDoor: "Klaar, door!",
    opKamer: "We zijn op de kamer",
    proeflijst: "Proeflijst",
    informatie: "Informatie",
    eten: "Eten",
    drinken: "Drinken",
    fotoideeen: "Fotoideeën",
    cadeautje: "Cadeautje!",
    ingepakt: "Nog ingepakt",
    nog: "Nog",
    dePiek: "DE PIEK",
    lampje: "LAMPJE",
    van: "VAN",
  },

  playlists: [
    { titel: "Kersthits", url: "https://open.spotify.com/search/kerst%20hits" },
    { titel: "Country", url: "https://open.spotify.com/playlist/3zzDqVygZh3mTEkdnhvVJy" },
    { titel: "*", url: "https://open.spotify.com/playlist/2fgH31iVwNiKac8Cjbo7ZU" },
  ],
  spotifyZelf: { titel: "Zelf kiezen in Spotify", url: "https://open.spotify.com/" },

  // Eerste cadeau: in de auto, direct na de felicitatie
  startCadeau: { titel: "Eerst dit nog.", foto: "charmera.png", tekst: "Voor alle leuke foto's vandaag, en alle andere dagen <3" },


  opReis: {
    titel: "Riemen vast.",
    tekst: "Drie uur rijden. Keulen, we komen eraan.",
    route: { naam: "Rijroute naar de parkeergarage", adres: "Tiefgarage Schildergasse, Cäcilienstraße 32, 50667 Köln" },
  },

  plagen: [
    "Niet spieken.",
    "Nope, nog dicht.",
    "Eerst de vorige, ongeduldig mens.",
    "Schudden mag. Openen nog niet.",
    "Goed geprobeerd.",
    "Die is voor straks.",
  ],

  welterusten: {
    titel: "Welterusten liefie,",
    tekst: "Ik hoop dat je net zo hebt genoten als ik vandaag. <3",
  },

  stops: [
    {
      id: "thuis",
      soort: "start",
      titel: "Op pad!",
      tekst: "Muziek aan, riemen vast. Keulen wacht.",
      kleur: "#e8b100",
    },
    {
      id: "engel",
      titel: "Markt der Engel",
      teaser: "Eerste stop. Auto staat, we lopen.",
      plaag: "Iets met vleugels.",
      tekst: "De auto staat in de Tiefgarage Schildergasse, de eerste markt ligt om de hoek. Duizenden sterretjes in de bomen en engelen die rondlopen.",
      adres: "Neumarkt, 50667 Köln",
      lat: 50.9361, lng: 6.9473,
      foto: "kb-engel.jpg",
      fokus: "50% 55%",
      kleur: "#2c6be0",
      info: [
        "De oudste kerstmarkt van Keulen.",
        "Honderden sterretjes hangen in de bomen boven de kraampjes.",
        "Engelen in witte gewaden lopen rond en delen kleine cadeautjes uit.",
        "Er is een cocktailbar met warme cocktails.",
        "Dinsdag open van 11:00 tot 21:00.",
      ],
      eten: [
        { naam: "Zimtschnecken met dulce de leche", foto: "zimtschnecke.jpg" },
        { naam: "Schneebälle met poedersuiker", foto: "schneeballen.jpg" },
      ],
      drinken: [
        { naam: "Heiße Schokolade met slagroom", foto: "kb-kakao.jpg" },
      ],
      fotoideeen: [
        "Samen onder de sterrenhemel, allebei omhoog kijken alsof je net een vallende ster ziet.",
        "Een selfie met een echte engel op de achtergrond.",
        "Proosten met de allereerste mokken van de dag.",
      ],
    },
    {
      id: "dom",
      titel: "Weihnachtsmarkt am Dom",
      teaser: "Lunchtijd onder de Dom.",
      plaag: "Groot. Heel groot. Gotisch groot.",
      tekst: "De beroemdste van allemaal, pal onder de Dom. Hier wordt geluncht, en er is genoeg om uit te kiezen.",
      adres: "Roncalliplatz, 50667 Köln",
      lat: 50.9406, lng: 6.9578,
      foto: "kb-dom.jpg",
      fokus: "45% 62%",
      kleur: "#d7263d",
      info: [
        "Ligt op de Roncalliplatz, direct voor de Dom, met meer dan 140 kraampjes.",
        "In het midden staat een kerstboom van 25 meter.",
        "Onder de boom staat een lichtertent met meer dan 70.000 lampjes.",
        "Op het podium zijn elke dag gratis optredens.",
        "De Dom zelf in: 12 euro, studenten 6 euro.",
        "Dinsdag open van 11:00 tot 21:00.",
      ],
      eten: [
        { naam: "Broodje Schweinshaxe met zuurkool", foto: "haxe.jpg" },
        { naam: "Dampfnudel met boter en maanzaad", foto: "dampfnudel.jpg" },
        { naam: "Flammlachs van het houtvuur", foto: "flammlachs.jpg" },
        { naam: "Bio Kaiserschmarrn", foto: "kb-kaiserschmarrn.jpg" },
        { naam: "Currywurst met broodje", foto: "currywurst.jpg" },
      ],
      drinken: [
        { naam: "De eerste glühwein, in de Dommok", foto: "kb-gluehwein.jpg" },
      ],
      fotoideeen: [
        "De hele Dom op één selfie, torens incluis. Lukt alleen als je allebei bijna plat ligt.",
        "Een kus onder de grote maretak.",
        "Samen onder de grote kerstboom, van onderaf gefotografeerd.",
      ],
    },
    {
      id: "heinzels",
      titel: "Heinzels Wintermärchen",
      teaser: "Kaboutertijd.",
      plaag: "Kleine mannetjes en glad ijs.",
      tekst: "De grootste markt van de stad, vol Heinzelmännchen. Hier eten we ons rond.",
      adres: "Alter Markt, 50667 Köln",
      lat: 50.9384, lng: 6.9594,
      foto: "kb-heinzels.jpg",
      fokus: "50% 48%",
      kleur: "#14894b",
      info: [
        "De grootste kerstmarkt van Keulen, verspreid over de Alter Markt en de Heumarkt.",
        "Het thema zijn de Heinzelmännchen, de kabouters uit de Keulse sage.",
        "Op de Heumarkt ligt een ijsbaan van meer dan 100 meter, met Eisstockschießen.",
        "Blauwe Heinzelhutjes en een straatje vol ambachtslieden.",
        "Dinsdag open van 11:00 tot 22:00.",
      ],
      eten: [
        { naam: "Caciocavallo: gesmolten kaas op brood", foto: "caciocavallo.jpg" },
        { naam: "Handbrot met ham en kaas", foto: "handbrot.jpg" },
        { naam: "Reibekuchen met appelmoes", foto: "reibekuchen.jpg" },
        { naam: "Vleesspies van een halve meter", foto: "spies.jpg" },
        { naam: "Truffeldumplings met parmezaan", foto: "truffeldumplings.jpg" },
        { naam: "Zillertaler Kässpatzen", foto: "kb-kaesspatzen.jpg" },
      ],
      drinken: [
        { naam: "Glühwein met een shot rum", foto: "gluehwein-rum.jpg" },
        { naam: "Warme chocolademelk, de dikke", foto: "chocolademelk.jpg" },
        { naam: "Hazelnootschnaps met slagroom", foto: "hazelnoot.jpg" },
      ],
      fotoideeen: [
        "Op de ijsbaan, midden in een glijpartij.",
        "Voor een blauw Heinzelhutje, allebei met je beste kaboutergezicht.",
        "Close up van de kaas die van je Caciocavallo broodje afdruipt.",
      ],
    },
    {
      id: "hafen",
      titel: "Hafen Weihnachtsmarkt",
      teaser: "Langs de Rijn, de lucht in.",
      plaag: "We gaan omhoog.",
      tekst: "Witte zeiltenten aan het water, naast het chocolademuseum, en een reuzenrad.",
      adres: "Am Schokoladenmuseum 1a, 50678 Köln",
      lat: 50.9322, lng: 6.9644,
      foto: "kb-hafen.jpg",
      fokus: "80% 55%",
      kleur: "#ff6a13",
      info: [
        "Ligt aan de Rijn, direct naast het Chocolademuseum.",
        "Ongeveer 70 kraampjes onder witte zeiltenten.",
        "Het reuzenrad is bijna 50 meter hoog, met uitzicht op de Dom en de Rijn.",
        "Maritiem thema, met 'zeelieden' achter de kraampjes.",
        "Dinsdag open van 11:00 tot 21:00.",
      ],
      eten: [
        { naam: "Truffelchips met parmezaan", foto: "truffelchips.jpg" },
      ],
      drinken: [
        { naam: "Feuerzangenbowle", foto: "kb-feuerzangenbowle.jpg" },
        { naam: "Glühbier", foto: "kb-gluehbier.jpg" },
      ],
      fotoideeen: [
        "Bovenin het reuzenrad, met de Dom erachter.",
        "Voor de witte zeiltenten met de Rijn op de achtergrond.",
        "Samen voor het Chocolademuseum, alsof je er ingesloten bent geweest.",
      ],
    },
    {
      id: "opfrissen",
      titel: "Even naar het hotel",
      teaser: "Even pauze.",
      plaag: "Schoenen uit, straks weer aan.",
      tekst: "Tassen uit de auto, inchecken, schoenen uit, opfrissen. Vanavond wordt het mooi.",
      adres: "Motel One Köln-Neumarkt, Cäcilienstraße 32, 50667 Köln",
      lat: 50.936, lng: 6.951,
      foto: "kb-hotel.jpg",
      fokus: "45% 55%",
      kleur: "#0fa3a3",
      // Cadeau zodra jullie op de kamer zijn (knop "We zijn op de kamer")
      cadeau: {
        moment: "aankomst",
        titel: "Nog eentje.",
        tekst: "Voor vanavond.",
        fotos: ["oorbel-l.png", "oorbel-r.png"],
      },
    },
    {
      id: "diner",
      soort: "piek",
      titel: "Bar Brio",
      teaser: "De piek.",
      plaag: "Helemaal bovenin...",
      tekst: "Diner in het Belgisch Viertel, half zeven. Vanavond proosten we op jou.",
      adres: "Bar Brio, Brüsseler Straße 68, 50674 Köln",
      lat: 50.9369, lng: 6.9341,
      foto: "kb-brio.jpg",
      fokus: "50% 40%",
      kleur: "#f2b705",
      info: [
        "Restaurant aan de Brüsseler Platz in het Belgisch Viertel.",
        "Opgenomen in de Michelingids, met een levendige sfeer.",
        "Gereserveerd om 18:30.",
      ],
      fotoideeen: [
        "Proostfoto met het eerste glas.",
      ],
      proost: { titel: "Proost op 22.", tekst: "Alle lampjes branden. De ster ook." },
      // Na het diner: toetje op Heavenue, of meteen naar de kamer
      toetje: {
        knopToetje: "Nog zin in een toetje?",
        knopKamer: "Verzadigd terug naar de kamer :)",
        markt: {
          id: "heavenue",
          titel: "Heavenue",
          tekst: "De queere kerstmarkt van Keulen, roze verlicht en bomvol. Hier halen we het toetje.",
          adres: "Friesenplatz, 50672 Köln",
          lat: 50.9405, lng: 6.9393,
          foto: "kb-heavenue.jpg",
      fokus: "40% 50%",
          kleur: "#ff3d9a",
          info: [
            "Kleurrijke kerstmarkt op de Friesenplatz.",
            "Een XXL glühweinpaleis waar je binnen en buiten kunt zitten.",
            "Een fontein van 10 meter met waterstralen en een draaiende kerstboom.",
            "Podium met optredens.",
            "Dinsdag open van 14:00 tot 22:00.",
          ],
          eten: [
            { naam: "Croffle met pistache", foto: "kb-croffle.jpg" },
          ],
          drinken: [
            { naam: "Hot Pornstar Martini", foto: "kb-pornstar.jpg" },
          ],
          fotoideeen: [
            "Bij de fontein, in je beste kerstpose. Hoe fouter, hoe beter.",
            "Onder de draaiende kerstboom, net op het juiste moment.",
          ],
        },
      },
      kamer: {
        titel: "Op naar de kamer.",
        tekst: "Wat een dag. Nog even lopen.",
        adres: "Motel One Köln-Neumarkt, Cäcilienstraße 32, 50667 Köln",
        lat: 50.936, lng: 6.951,
        straal: 120,
      },
    },
  ],

  credits: [
    ["web", "Markt der Engel, Weihnachtsmarkt am Dom, Heimat der Heinzel", "KölnTourismus GmbH / Dieter Jacobi"],
    ["commons", "Cologne Christmas Market at the Chocolate Museum (53442390916).jpg", "Wikimedia Commons"],
    ["commons", "Kölner Dom und Hohenzollernbrücke Abenddämmerung (9706 7 8).jpg", "Raimond Spekking"],
    ["commons", "Kaiserschmarrn groß.jpg", "Kobako"],
    ["commons", "Glühwein Weinnachtsmarkt OS.JPG", "Basotxerri"],
    ["commons", "Käsespätzle.jpg", "Wiki der Wikinger"],
    ["commons", "Göttingen Weihnachtsmarkt 2015 - Feuerzangenbowle (1).jpg", "Wikimedia Commons"],
    ["commons", "Glühbier (25117436738).jpg", "Wikimedia Commons"],
    ["commons", "Croffle.jpg", "Pkccccj"],
    ["commons", "Motel One Köln-Neumarkt-5520.jpg", "Raimond Spekking"],
    ["commons", "Weihnachtsmarkt Rudolfplatz 2014.jpg", "Wikimedia Commons"],
    ["commons", "Belgisches Viertel Kreuzung Bruesseler- und Luetticher Strasse.jpg", "Wikimedia Commons"],
    ["commons", "Tasse heiße Schokolade mit Sahne, Kaan-Marienborn Café, Siegen.jpg", "Wikimedia Commons"],
    ["commons", "Porn star martini cocktail.jpg", "Ben Sutherland"],
    ["web", "Overige foto's: eigen stills", ""],
  ],
};
