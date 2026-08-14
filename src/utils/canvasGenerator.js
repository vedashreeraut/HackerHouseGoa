import { getTransformedCropRect } from "./imageUtils";
import QRCode from "qrcode";

export const CARD_SIZE = 1200;
export const CARD_WIDTH = 900;
export const CARD_HEIGHT = 1200;

const type = (
  ctx,
  text,
  x,
  y,
  font,
  color,
  align = "left"
) => {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);
  ctx.restore();
};

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

const cap = (text, max) =>
  (text || "").toUpperCase().slice(0, max);

function texture(ctx, color) {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = color;

  for (let i = 0; i < 850; i++) {
    ctx.fillRect(
      (i * 97) % CARD_SIZE,
      (i * 211) % CARD_SIZE,
      2,
      2
    );
  }

  ctx.restore();
}


/* ---------------------------------------------------------
   BACKDROP
--------------------------------------------------------- */

function backdrop(ctx, theme) {
  const { colors, style } = theme;

  const g = ctx.createLinearGradient(
    0,
    0,
    CARD_SIZE,
    CARD_SIZE
  );

  g.addColorStop(0, colors.bg);
  g.addColorStop(1, colors.bg2);

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  if (style === "classic") {
    ctx.save();

    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.75;

    ctx.beginPath();
    ctx.arc(970, 210, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    type(
      ctx,
      "GOA",
      62,
      1055,
      "900 250px Georgia",
      colors.accent
    );

    ctx.restore();
  }

  if (style === "editorial") {
    ctx.save();

    ctx.fillStyle = colors.text;
    ctx.globalAlpha = 0.1;

    type(
      ctx,
      "HH",
      80,
      1030,
      "900 700px Arial Black",
      colors.text
    );

    ctx.restore();
  }

  if (style === "poster") {
    ctx.save();

    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.2;

    for (let x = 35; x < CARD_SIZE; x += 44) {
      for (let y = 35; y < CARD_SIZE; y += 44) {
        ctx.fillRect(x, y, 3, 3);
      }
    }

    ctx.restore();
  }

  if (style === "sunset") {
    ctx.save();

    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.6;

    for (let y = 80; y < CARD_SIZE; y += 48) {
      ctx.fillRect(0, y, CARD_SIZE, 8);
    }

    ctx.restore();
  }

  if (style === "nightlife") {
    ctx.save();

    ctx.strokeStyle = colors.accent2;
    ctx.globalAlpha = 0.38;
    ctx.lineWidth = 3;

    for (let x = -700; x < 1200; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 500, 1200);
      ctx.stroke();
    }

    ctx.restore();
  }

  if (style === "kiwi") {
    ctx.save();

    // subtle kiwi-style organic circles
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = colors.accent;

    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        100 + i * 160,
        180 + (i % 2) * 650,
        70 + (i % 3) * 20,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  texture(ctx, colors.text);
}


/* ---------------------------------------------------------
   PASS BASE
--------------------------------------------------------- */

function passBase(ctx, theme) {
  const { colors, style } = theme;

  const x = 245;
  const y = 225;
  const w = 710;
  const h = 880;

  ctx.save();

  ctx.translate(600, 665);

  if (style === "poster") {
    ctx.rotate(-0.035);
  } else if (style === "nightlife") {
    ctx.rotate(0.024);
  } else if (style === "kiwi") {
    ctx.rotate(-0.012);
  }

  ctx.translate(-600, -665);

  /* ---------- OFFSET SHADOW ---------- */

  ctx.fillStyle = colors.accent2;
  rr(ctx, x + 18, y + 22, w, h, 32);
  ctx.fill();


  /* ---------- MAIN CARD ---------- */

  ctx.fillStyle = colors.card;
  rr(ctx, x, y, w, h, 32);
  ctx.fill();


  /* ---------- HEADER ---------- */

  ctx.save();

  rr(ctx, x, y, w, h, 32);
  ctx.clip();

  ctx.fillStyle = colors.cardHeader;
  ctx.fillRect(x, y, w, 215);

  /* Theme-specific header decoration */

  if (style === "poster") {
    ctx.fillStyle = colors.accent2;
    ctx.globalAlpha = 0.18;

    for (let q = 0; q < 15; q++) {
      ctx.beginPath();
      ctx.arc(
        x + 25 + q * 52,
        y + 35 + (q % 2) * 30,
        7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  if (style === "classic") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.12;

    type(
      ctx,
      "GOA",
      x + 40,
      y + 185,
      "900 110px Georgia",
      colors.accent
    );
  }

  if (style === "sunset") {
    ctx.fillStyle = colors.accent2;
    ctx.globalAlpha = 0.16;

    for (let q = y + 30; q < y + 215; q += 30) {
      ctx.fillRect(x, q, w, 5);
    }
  }

  if (style === "nightlife") {
    ctx.strokeStyle = colors.accent2;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 4;

    for (let q = -100; q < w; q += 70) {
      ctx.beginPath();
      ctx.moveTo(x + q, y);
      ctx.lineTo(x + q + 150, y + 215);
      ctx.stroke();
    }
  }

  if (style === "kiwi") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.1;

    for (let q = 0; q < 8; q++) {
      ctx.beginPath();
      ctx.arc(
        x + 50 + q * 95,
        y + 55 + (q % 2) * 65,
        18,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  ctx.restore();


  /* ---------- BODY DECORATION ---------- */

  ctx.save();

  rr(ctx, x, y, w, h, 32);
  ctx.clip();

  if (style === "poster") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.08;

    for (let q = 0; q < 18; q++) {
      ctx.beginPath();
      ctx.arc(
        x + 30 + q * 40,
        y + 610 + (q % 3) * 14,
        10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  if (style === "classic") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.12;

    type(
      ctx,
      "GOA",
      x + 42,
      y + 788,
      "900 170px Georgia",
      colors.accent
    );
  }

  if (style === "sunset") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.13;

    for (
      let q = y + 250;
      q < y + h;
      q += 28
    ) {
      ctx.fillRect(x, q, w, 4);
    }
  }

  if (style === "nightlife") {
    ctx.fillStyle = colors.accent2;
    ctx.globalAlpha = 0.1;

    type(
      ctx,
      "NIGHT",
      x + 40,
      y + 825,
      "900 140px Arial",
      colors.accent2
    );
  }

  if (style === "kiwi") {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.08;

    for (let q = 0; q < 7; q++) {
      ctx.beginPath();
      ctx.arc(
        x + 50 + q * 120,
        y + 760,
        40,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  ctx.restore();


  /* ---------- FRAME ---------- */

  ctx.strokeStyle = colors.frame;
  ctx.lineWidth = 8;

  rr(ctx, x, y, w, h, 32);
  ctx.stroke();


  /* ---------- LANYARD SLOT ---------- */

  ctx.fillStyle = colors.cardHeader;

  rr(
    ctx,
    x + w / 2 - 58,
    y - 12,
    116,
    32,
    12
  );

  ctx.fill();

  ctx.strokeStyle = colors.frame;
  ctx.lineWidth = 6;

  rr(
    ctx,
    x + w / 2 - 58,
    y - 12,
    116,
    32,
    12
  );

  ctx.stroke();

  ctx.restore();

  return { x, y, w, h };
}


/* ---------------------------------------------------------
   PHOTO
--------------------------------------------------------- */

function drawPhoto(
  ctx,
  img,
  transform,
  theme,
  x,
  y,
  s
) {
  const { colors, style } = theme;

  ctx.save();

  /* photo shadow/frame */

  ctx.fillStyle = colors.photoFrame;

  rr(
    ctx,
    x + 13,
    y + 16,
    s,
    s,
    style === "poster" || style === "kiwi"
      ? 28
      : 4
  );

  ctx.fill();


  /* photo clipping */

  ctx.save();

  ctx.beginPath();

  if (
    style === "classic" ||
    style === "nightlife"
  ) {
    ctx.arc(
      x + s / 2,
      y + s / 2,
      s / 2,
      0,
      Math.PI * 2
    );
  } else if (
    style === "poster" ||
    style === "kiwi"
  ) {
    rr(ctx, x, y, s, s, 24);
  } else {
    rr(ctx, x, y, s, s, 4);
  }

  ctx.clip();


  /* actual image */

  if (img) {
    const c = getTransformedCropRect(
      img,
      CARD_SIZE,
      CARD_SIZE,
      transform
    );

    ctx.drawImage(
      img,
      c.sx,
      c.sy,
      c.sWidth,
      c.sHeight,
      x,
      y,
      s,
      s
    );
  } else {
    const g = ctx.createLinearGradient(
      x,
      y,
      x + s,
      y + s
    );

    g.addColorStop(
      0,
      colors.accent
    );

    g.addColorStop(
      1,
      colors.accent2
    );

    ctx.fillStyle = g;
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = colors.bg;
    ctx.globalAlpha = 0.3;

    ctx.beginPath();
    ctx.arc(
      x + s / 2,
      y + s * 0.37,
      s * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      x + s / 2,
      y + s * 1.05,
      s * 0.38,
      Math.PI,
      0
    );
    ctx.fill();
  }

  ctx.restore();


  /* photo border */

  ctx.strokeStyle = colors.photoFrame;
  ctx.lineWidth = 8;

  ctx.beginPath();

  if (
    style === "classic" ||
    style === "nightlife"
  ) {
    ctx.arc(
      x + s / 2,
      y + s / 2,
      s / 2,
      0,
      Math.PI * 2
    );
  } else {
    rr(
      ctx,
      x,
      y,
      s,
      s,
      style === "poster" ||
      style === "kiwi"
        ? 24
        : 4
    );
  }

  ctx.stroke();

  ctx.restore();
}


/* ---------------------------------------------------------
   QR
--------------------------------------------------------- */

function drawQr(
  ctx,
  x,
  y,
  size,
  color
) {
  const url =
    typeof window === "undefined"
      ? "https://hh-goa-builder.vercel.app"
      : new URL(
          "./",
          window.location.href
        ).href;

  const qr = QRCode.create(
    url,
    {
      errorCorrectionLevel: "M",
    }
  );

  const n = qr.modules.size;
  const quiet = 4;
  const cell =
    size / (n + quiet * 2);

  ctx.save();

  ctx.fillStyle = "#fff";
  ctx.fillRect(
    x,
    y,
    size,
    size
  );

  ctx.fillStyle = color;

  for (
    let row = 0;
    row < n;
    row++
  ) {
    for (
      let col = 0;
      col < n;
      col++
    ) {
      if (
        qr.modules.get(
          row,
          col
        )
      ) {
        ctx.fillRect(
          x +
            (col + quiet) *
              cell,
          y +
            (row + quiet) *
              cell,
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }

  ctx.restore();
}


/* ---------------------------------------------------------
   TOOLBOX WRAPPING
--------------------------------------------------------- */

function drawToolbox(
  ctx,
  text,
  x,
  y,
  maxWidth,
  font,
  color
) {
  const parts = text
    .split(" · ")
    .filter(Boolean);

  let line1 = "";
  let line2 = "";

  for (const part of parts) {
    const candidate =
      line1
        ? `${line1} · ${part}`
        : part;

    ctx.save();
    ctx.font = font;

    const fits =
      ctx.measureText(candidate)
        .width <= maxWidth;

    ctx.restore();

    if (fits) {
      line1 = candidate;
    } else {
      line2 +=
        (line2 ? " · " : "") +
        part;
    }
  }

  type(
    ctx,
    line1,
    x,
    y,
    font,
    color
  );

  if (line2) {
    type(
      ctx,
      line2,
      x,
      y + 27,
      font,
      color
    );
  }
}


/* ---------------------------------------------------------
   PASS CONTENT
--------------------------------------------------------- */

function passContent(
  ctx,
  data,
  theme,
  pass,
  img,
  transform
) {
  const {
    colors,
    style,
  } = theme;

  const {
    x,
    y,
    w,
    h,
  } = pass;


  /* ---------- HEADER COLORS ---------- */

  const headerText =
    colors.cardHeader ===
    colors.bg
      ? colors.text
      : colors.cardText;

  const headerSmall =
    style === "kiwi"
      ? colors.accent
      : colors.accent;


  /* ---------- HEADER ---------- */

  type(
    ctx,
    "HACKER HOUSE",
    x + 40,
    y + 62,
    "900 28px Arial",
    headerText
  );

  type(
    ctx,
    "GOA, INDIA · 28—31 OCT 2026",
    x + 40,
    y + 92,
    "800 13px monospace",
    headerSmall
  );

  type(
    ctx,
    style === "sunset"
      ? "BOARDING PASS / HH-26"
      : style === "nightlife"
        ? "AFTER HOURS PASS"
        : "BUILDER FESTIVAL PASS",
    x + w - 40,
    y + 62,
    "900 13px Arial",
    headerText,
    "right"
  );


  /* ---------- DASHED LINE ---------- */

  ctx.save();

  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = colors.accent;
  ctx.globalAlpha = 0.55;

  ctx.beginPath();

  ctx.moveTo(
    x + 28,
    y + 215
  );

  ctx.lineTo(
    x + w - 28,
    y + 215
  );

  ctx.stroke();

  ctx.restore();


  /* ---------- PHOTO ---------- */

  drawPhoto(
    ctx,
    img,
    transform,
    theme,
    x + 48,
    y + 260,
    250
  );


  /* ---------- PASSENGER ---------- */

  type(
    ctx,
    "PASSENGER",
    x + 335,
    y + 291,
    "900 12px Arial",
    colors.label
  );

  type(
    ctx,
    cap(data.name, 22),
    x + 335,
    y + 337,
    "900 35px Arial Black",
    colors.cardText
  );


  /* ---------- ROLE ---------- */

  type(
    ctx,
    "WHAT I BUILD",
    x + 335,
    y + 374,
    "900 12px Arial",
    colors.label
  );

  type(
    ctx,
    cap(data.role, 30),
    x + 335,
    y + 405,
    "800 20px Arial",
    colors.cardText
  );


  /* ---------- TOOLBOX ---------- */

  type(
    ctx,
    "TOOLBOX",
    x + 335,
    y + 445,
    "900 12px Arial",
    colors.label
  );

  drawToolbox(
    ctx,
    cap(
      data.stack.join(" · "),
      55
    ),
    x + 335,
    y + 472,
    w - 380,
    "700 16px Arial",
    colors.cardText
  );


  /* ---------- BUILDER ENERGY ---------- */

  ctx.fillStyle =
    colors.energyBg;

  rr(
    ctx,
    x + 45,
    y + 555,
    w - 90,
    126,
    style === "poster" ||
    style === "kiwi"
      ? 28
      : 5
  );

  ctx.fill();


  type(
    ctx,
    "BUILDER ENERGY",
    x + 66,
    y + 582,
    "900 12px Arial",
    colors.energyText
  );


  const energyText =
    data.tag?.text ||
    "THE YOUR BUILDER ENERGY IS HIDING...";

  const words =
    energyText
      .replace(/^THE\s/i, "")
      .split(" ");

  const split =
    Math.ceil(
      words.length / 2
    );


  type(
    ctx,
    `THE ${words
      .slice(0, split)
      .join(" ")}`,
    x + 66,
    y + 624,
    "900 29px Arial Black",
    colors.energyText
  );

  if (
    words.length > split
  ) {
    type(
      ctx,
      words
        .slice(split)
        .join(" "),
      x + 66,
      y + 656,
      "900 29px Arial Black",
      colors.energyText
    );
  }


  /* ---------- BOTTOM LABELS ---------- */

  type(
    ctx,
    "FLIGHT HH-2026",
    x + 48,
    y + 738,
    "900 14px monospace",
    colors.label
  );

  type(
    ctx,
    "GATE BUILDER",
    x + 295,
    y + 738,
    "900 14px monospace",
    colors.label
  );

  type(
    ctx,
    "SEAT GOA",
    x + 510,
    y + 738,
    "900 14px monospace",
    colors.label
  );


  /* ---------- QR ---------- */

  drawQr(
    ctx,
    x + 48,
    y + 750,
    125,
    colors.qr
  );


  /* ---------- FOOTER ---------- */

  type(
    ctx,
    "SCAN TO BUILD YOUR OWN",
    x + 48,
    y + 892,
    "800 10px monospace",
    colors.qr
  );

  type(
    ctx,
    data.handle ||
      "@FRAMEINGOA",
    x + w - 45,
    y + 805,
    "900 18px Arial",
    colors.accent2,
    "right"
  );

  type(
    ctx,
    "#FRAMEINGOA",
    x + w - 45,
    y + 837,
    "900 13px Arial",
    colors.cardText,
    "right"
  );

  type(
    ctx,
    "ADMIT ONE BUILDER · THEKIWICREW",
    x + 48,
    y + 850,
    "800 11px monospace",
    colors.cardText
  );
}


/* ---------------------------------------------------------
   DRAW CARD
--------------------------------------------------------- */

export function drawBuilderCard(
  ctx,
  img,
  data,
  theme,
  transform
) {
  const stage =
    document.createElement(
      "canvas"
    );

  stage.width = CARD_SIZE;
  stage.height = CARD_SIZE;

  const stageCtx =
    stage.getContext("2d");

  backdrop(
    stageCtx,
    theme
  );

  const pass =
    passBase(
      stageCtx,
      theme
    );

  passContent(
    stageCtx,
    data,
    theme,
    pass,
    img,
    transform
  );


  /*
   * Crop only the physical pass.
   * Background scenery is never exported.
   */

  const crop = {
    x: 230,
    y: 195,
    w: 750,
    h: 930,
  };

  ctx.clearRect(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );

  ctx.drawImage(
    stage,
    crop.x,
    crop.y,
    crop.w,
    crop.h,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
}


/* ---------------------------------------------------------
   EXPORT
--------------------------------------------------------- */

export function exportBuilderCard(
  img,
  data,
  theme,
  transform
) {
  return new Promise(
    (resolve, reject) => {
      const c =
        document.createElement(
          "canvas"
        );

      c.width =
        CARD_WIDTH;

      c.height =
        CARD_HEIGHT;

      drawBuilderCard(
        c.getContext("2d"),
        img,
        data,
        theme,
        transform
      );

      c.toBlob(
        (b) =>
          b
            ? resolve(b)
            : reject(
                new Error(
                  "Could not generate the image."
                )
              ),
        "image/png"
      );
    }
  );
}


/* ---------------------------------------------------------
   DOWNLOAD
--------------------------------------------------------- */

export function downloadBuilderCard(
  blob
) {
  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement(
      "a"
    );

  a.href = url;

  a.download =
    "HH-Goa-2026-Builder-Pass.png";

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);
}