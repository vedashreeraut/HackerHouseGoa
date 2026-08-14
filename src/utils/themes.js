export const THEMES = [
  {
  id: "blackWhite",
  name: "MONOCHROME RIOT",
  style: "editorial",

  swatch: ["#111010", "#f5f0e6", "#ffd23f"],

  colors: {
    bg: "#111010",
    bg2: "#111010",

    text: "#111010",

    accent: "#ffd23f",
    accent2: "#ffd23f",
    frame: "#111010",

    // Actual exported pass
    card: "#f5f0e6",
    cardHeader: "#111010",
    cardText: "#111010",

    label: "#111010",

    energyBg: "#ffd23f",
    energyText: "#111010",

    photoFrame: "#ffd23f",
    qr: "#111010",
  },

  uiClass: "theme-black-white",
},

  {
    id: "pinkWhite",
    name: "SAKURA SIGNAL",
    style: "poster",

    swatch: ["#ff5da2", "#fff6ef", "#ffd23f"],

    colors: {
      bg: "#ff5da2",
      bg2: "#ff8fc0",

      text: "#2a0a1a",

      accent: "#fff6ef",
      accent2: "#ffd23f",
      frame: "#2a0a1a",

      // Sakura reference:
      // pink header + dark burgundy body + cream content
      card: "#fff6ef",
      cardHeader: "#ff5da2",
      cardText: "#2a0a1a",

      label: "#ff5da2",

      energyBg: "#ffd23f",
      energyText: "#2a0a1a",

      photoFrame: "#ffd23f",
      qr: "#ff5da2",
    },

    uiClass: "theme-pink-white",
  },

  {
    id: "greenYellow",
    name: "TROPIC VOLTAGE",
    style: "classic",

    swatch: ["#0b2d20", "#ffd34e", "#ff5da2"],

    colors: {
      bg: "#0b2d20",
      bg2: "#123322",

      text: "#fdf6e9",

      accent: "#ffd34e",
      accent2: "#ff5da2",
      frame: "#ffd34e",

      card: "#fdf6e9",
      cardHeader: "#0b2d20",
      cardText: "#0b2d20",

      label: "#ff5da2",

      energyBg: "#ffd34e",
      energyText: "#0b2d20",

      photoFrame: "#ffd34e",
      qr: "#0b2d20",
    },

    uiClass: "theme-green-yellow",
  },

  {
    id: "orangeCream",
    name: "SUNSET CIRCUIT",
    style: "sunset",

    swatch: ["#ff7a45", "#fdf3e2", "#123322"],

    colors: {
      bg: "#ff7a45",
      bg2: "#ffb26b",

      text: "#123322",

      accent: "#fdf3e2",
      accent2: "#fdf3e2",
      frame: "#123322",

      card: "#fdf3e2",
      cardHeader: "#ff7a45",
      cardText: "#123322",

      label: "#123322",

      energyBg: "#123322",
      energyText: "#fdf3e2",

      photoFrame: "#ff7a45",
      qr: "#123322",
    },

    uiClass: "theme-orange-cream",
  },

  {
    id: "purplePink",
    name: "NIGHT MARKET",
    style: "nightlife",

    swatch: ["#2b0f4a", "#ff5da2", "#ffd23f"],

    colors: {
      bg: "#2b0f4a",
      bg2: "#4a1a6e",

      text: "#fdf3ff",

      accent: "#ff5da2",
      accent2: "#ffd23f",
      frame: "#ff5da2",

      card: "#2b0f4a",
      cardHeader: "#4a1a6e",
      cardText: "#fdf3ff",

      label: "#ff5da2",

      energyBg: "#ffd23f",
      energyText: "#2b0f4a",

      photoFrame: "#ff5da2",
      qr: "#2b0f4a",
    },

    uiClass: "theme-purple-pink",
  },

  {
    id: "kiwiCrew",
    name: "KIWI CREW",
    style: "kiwi",

    swatch: ["#264f2b", "#e6f08a", "#fff5d8", "#ff5da2"],

    colors: {
      bg: "#264f2b",
      bg2: "#6cba42",

      text: "#fff5d8",

      accent: "#e6f08a",
      accent2: "#ff5da2",
      frame: "#e6f08a",

      // Kiwi reference:
      // deep green header/card + pale cream body + pink accents
      card: "#fff5d8",
      cardHeader: "#264f2b",
      cardText: "#264f2b",

      label: "#ff5da2",

      energyBg: "#ff5da2",
      energyText: "#fff5d8",

      photoFrame: "#e6f08a",
      qr: "#264f2b",
    },

    uiClass: "theme-kiwi-crew",
  },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}