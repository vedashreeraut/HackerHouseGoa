import { getTransformedCropRect } from "./imageUtils"

export const CARD_SIZE = 1200

function rr(ctx, x, y, w, h, r = 0) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r) }
function type(ctx, text, x, y, font, color, align = "left") { ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, y); ctx.restore() }
function clamp(text, length) { return (text || "").toUpperCase().slice(0, length) }
function initials(name) { return (name || "GO").split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() }
function splitTitle(text) { const words = text.replace(/^THE\s+/, "").split(" "); const pivot = Math.ceil(words.length / 2); return [`THE ${words.slice(0, pivot).join(" ")}`, words.slice(pivot).join(" ")] }

function texture(ctx, size, color, amount = 460) { ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = .08; for (let i = 0; i < amount; i++) ctx.fillRect((i * 83) % size, (i * 197) % size, 2, 2); ctx.restore() }
function base(ctx, size, theme) {
  const { colors, style } = theme
  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, colors.bg); grad.addColorStop(1, colors.bg2); ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size)
  if (style === "editorial") { ctx.fillStyle = colors.text; ctx.globalAlpha = .08; ctx.fillRect(80, 0, 1, size); ctx.fillRect(size - 100, 0, 1, size); ctx.globalAlpha = 1 }
  if (style === "poster") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .17; for (let x = 45; x < size; x += 52) for (let y = 44; y < size; y += 52) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill() } ctx.globalAlpha = 1 }
  if (style === "classic") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .15; ctx.beginPath(); ctx.arc(945, 180, 260, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1 }
  if (style === "sunset") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(875, 235, 165, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; for (let y = 80; y < 410; y += 24) { ctx.fillStyle = colors.accent2; ctx.globalAlpha = .16; ctx.fillRect(0, y, size, 5) } ctx.globalAlpha = 1 }
  if (style === "nightlife") { ctx.strokeStyle = colors.accent2; ctx.globalAlpha = .25; ctx.lineWidth = 3; for (let i = -500; i < size; i += 120) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 500, size); ctx.stroke() } ctx.globalAlpha = 1 }
  texture(ctx, size, colors.text)
}

function backdropTypography(ctx, size, data, theme) {
  const { colors, style } = theme
  ctx.save(); ctx.globalAlpha = style === "editorial" ? .12 : .1; ctx.fillStyle = colors.text
  ctx.font = "900 460px Arial Black, Arial"; ctx.textAlign = "center"
  ctx.fillText(style === "classic" ? "GOA" : initials(data.name), size / 2, 470)
  if (style === "nightlife") { ctx.font = "900 215px Arial Black, Arial"; ctx.fillText("NIGHT", size / 2, 1110) }
  if (style === "sunset") { ctx.font = "900 190px Arial Black, Arial"; ctx.fillText("2026", size / 2, 1100) }
  ctx.restore()
}

function photoShape(ctx, style, x, y, s) {
  ctx.beginPath()
  if (style === "editorial") ctx.rect(x, y, s, s)
  else if (style === "poster") { rr(ctx, x, y, s, s, 44) }
  else if (style === "classic") { ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2) }
  else if (style === "sunset") { rr(ctx, x, y, s, s, 18) }
  else { ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2) }
}

function photoPlacement(style) {
  if (style === "editorial") return { x: 125, y: 182, s: 570 }
  if (style === "poster") return { x: 390, y: 165, s: 520 }
  if (style === "classic") return { x: 392, y: 190, s: 490 }
  if (style === "sunset") return { x: 105, y: 275, s: 505 }
  return { x: 505, y: 220, s: 490 }
}
function drawPhoto(ctx, img, data, theme, transform) {
  const { colors, style } = theme; const { x, y, s } = photoPlacement(style)
  ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.rotate(style === "poster" ? -.075 : style === "sunset" ? .045 : 0); ctx.translate(-x - s / 2, -y - s / 2)
  ctx.fillStyle = colors.accent2; ctx.fillRect(x + 16, y + 20, s, s)
  ctx.save(); photoShape(ctx, style, x, y, s); ctx.clip()
  if (img) { const crop = getTransformedCropRect(img, CARD_SIZE, CARD_SIZE, transform); ctx.drawImage(img, crop.sx, crop.sy, crop.sWidth, crop.sHeight, x, y, s, s) }
  else { const grad = ctx.createLinearGradient(x, y, x + s, y + s); grad.addColorStop(0, colors.accent); grad.addColorStop(1, colors.accent2); ctx.fillStyle = grad; ctx.fillRect(x, y, s, s); ctx.fillStyle = colors.bg; ctx.globalAlpha = .3; ctx.beginPath(); ctx.arc(x+s/2, y+s*.38, s*.15, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(x+s/2, y+s*.94, s*.36, Math.PI, 0); ctx.fill() }
  ctx.restore(); ctx.lineWidth = style === "editorial" ? 14 : 10; ctx.strokeStyle = colors.accent; photoShape(ctx, style, x, y, s); ctx.stroke(); ctx.restore()
  return { x, y, s }
}

function header(ctx, size, theme) {
  const { colors, style } = theme
  type(ctx, "HACKER HOUSE", 70, 78, "900 28px Arial", colors.text)
  type(ctx, "GOA 2026", 70, 110, "800 17px Arial", colors.accent)
  type(ctx, style === "nightlife" ? "AFTER HOURS ID" : "BUILDER PASSPORT", size - 70, 78, "800 16px Arial", colors.text, "right")
  ctx.save(); ctx.translate(size - 132, 122); ctx.rotate(-.1); ctx.fillStyle = colors.accent; rr(ctx, -88, -27, 176, 50, 7); ctx.fill(); type(ctx, "#FRAMEINGOA", 0, 7, "900 16px Arial", colors.bg, "center"); ctx.restore()
}
function energyStamp(ctx, data, theme) {
  const { colors, style } = theme; const [one, two] = splitTitle(data.tag.text); const pos = style === "editorial" ? { x: 730, y: 595, w: 410 } : style === "sunset" ? { x: 620, y: 570, w: 510 } : { x: 86, y: 720, w: 1028 }
  ctx.save(); ctx.translate(pos.x + pos.w / 2, pos.y + 64); ctx.rotate(style === "nightlife" ? -.025 : .02); ctx.translate(-pos.x - pos.w / 2, -pos.y - 64)
  ctx.fillStyle = colors.accent; rr(ctx, pos.x, pos.y, pos.w, 130, style === "poster" ? 34 : 6); ctx.fill()
  type(ctx, "BUILDER ENERGY", pos.x + 22, pos.y + 29, "900 13px Arial", colors.bg)
  type(ctx, one, pos.x + 22, pos.y + 76, "900 32px Arial Black, Arial", colors.bg)
  if (two) type(ctx, two, pos.x + 22, pos.y + 111, "900 32px Arial Black, Arial", colors.bg)
  ctx.restore()
}
function metadata(ctx, size, data, theme) {
  const { colors, style } = theme; const right = style === "editorial" ? 730 : 70; const y = style === "editorial" ? 790 : 900
  type(ctx, `// ${clamp(data.name, 26)}`, right, y, "900 43px Arial Black, Arial", colors.text)
  type(ctx, "WHAT I BUILD", right, y + 37, "900 13px Arial", colors.accent)
  type(ctx, clamp(data.role, 34), right, y + 67, "800 23px Arial", colors.text)
  type(ctx, "TOOLBOX", right, y + 108, "900 13px Arial", colors.accent)
  type(ctx, clamp(data.stack.join("  ·  "), 58), right, y + 138, "700 18px Arial", colors.text)
  ctx.save(); ctx.globalAlpha = .72; type(ctx, data.personalityDisplay ? clamp(data.personalityDisplay, 48) : "BUILDING IN PUBLIC", right, y + 180, "italic 600 17px Arial", colors.text); ctx.restore()
  type(ctx, data.handle || "@FRAMEINGOA", right, y + 222, "900 19px Arial", colors.accent2)
}
function motif(ctx, size, theme) {
  const { colors, style } = theme; ctx.save()
  if (style === "classic") { ctx.strokeStyle = colors.accent; ctx.lineWidth = 12; ctx.globalAlpha = .55; for (const x of [95, 1100]) { ctx.beginPath(); ctx.moveTo(x, 1115); ctx.lineTo(x + (x < 500 ? 45 : -45), 900); ctx.stroke(); for (let j=0;j<3;j++){ctx.beginPath();ctx.arc(x+(x<500?48:-48), 900+j*36, 55-j*10, .2, 2.3);ctx.stroke()} } }
  if (style === "poster") { ctx.fillStyle = colors.text; ctx.globalAlpha=.52; for (let i=0;i<5;i++){ctx.beginPath();ctx.arc(110+i*48, 1080-(i%2)*20, 18,0,Math.PI*2);ctx.fill()} }
  if (style === "nightlife") { ctx.strokeStyle = colors.accent2; ctx.lineWidth=8; ctx.globalAlpha=.7; ctx.beginPath();ctx.arc(190, 220, 74,0,Math.PI*2);ctx.stroke(); type(ctx,"GOA AFTER DARK",88,335,"900 15px Arial",colors.accent) }
  ctx.restore()
}

export function drawBuilderCard(ctx, img, data, theme, transform) {
  const size = CARD_SIZE; ctx.clearRect(0, 0, size, size); base(ctx, size, theme); backdropTypography(ctx, size, data, theme); header(ctx, size, theme); drawPhoto(ctx, img, data, theme, transform); energyStamp(ctx, data, theme); metadata(ctx, size, data, theme); motif(ctx, size, theme)
  ctx.save(); ctx.strokeStyle = theme.colors.frame; ctx.globalAlpha = .65; ctx.lineWidth = 5; ctx.strokeRect(23, 23, size - 46, size - 46); ctx.restore()
}
export function exportBuilderCard(img, data, theme, transform) { return new Promise((resolve, reject) => { const canvas = document.createElement("canvas"); canvas.width = CARD_SIZE; canvas.height = CARD_SIZE; drawBuilderCard(canvas.getContext("2d"), img, data, theme, transform); canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not generate the image.")), "image/png") }) }
export function downloadBuilderCard(blob) { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "HH-Goa-2026-Builder-ID.png"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }
