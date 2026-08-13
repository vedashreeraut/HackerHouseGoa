import { downloadBuilderCard } from "./canvasGenerator"

const SHARE_TEXT = "Just got my HH Goa 2026 Builder ID \u{1F334}\u26A1 #FrameInGoa"

function canShareFiles(file) {
  return typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })
}

export async function shareToX(blob) {
  const file = new File([blob], "HH-Goa-2026-Builder-ID.png", { type: "image/png" })

  if (canShareFiles(file)) {
    try {
      await navigator.share({ files: [file], text: SHARE_TEXT })
      return { method: "webshare" }
    } catch (err) {
      if (err.name === "AbortError") return { method: "cancelled" }
    }
  }

  downloadBuilderCard(blob)
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`
  window.open(intentUrl, "_blank", "noopener,noreferrer")
  return { method: "fallback" }
}
