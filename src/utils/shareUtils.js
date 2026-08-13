function toDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read the collectible image."))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

function makeCaption(cardData, shareUrl = "") {
  const name = cardData.name || "a builder"
  const energy = cardData.tag?.text || cardData.builderType || "GOA BUILDER"
  const publicLink = shareUrl ? `\n\n${shareUrl}` : ""
  return `Just unlocked my Hacker House Goa collectible ⚡️\n\nBuilder: ${name}\nEnergy: ${energy}\n\nSee you in Goa 🌴🔥${publicLink}\n\n#HackerHouseGoa #HHGoa #FrameInGoa`
}

export async function shareToX(blob, cardData) {
  // Reserve a tab while the click is still a trusted gesture. Opening X after
  // an asynchronous upload is otherwise blocked by many mobile browsers.
  const popup = window.open("", "_blank")
  if (popup) popup.opener = null

  let shareUrl = ""
  try {
    const payload = { image: await toDataUrl(blob), name: cardData.name, energy: cardData.tag?.text || cardData.builderType }
    const response = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const result = await response.json().catch(() => ({}))
    if (response.ok && result.shareUrl) shareUrl = result.shareUrl
    else console.warn("Public collectible share was unavailable; opening X without the card preview.", result.error)
  } catch (error) {
    // A local Vite server does not host Vercel API functions. Sharing text to
    // X must still work even when a public image preview cannot be prepared.
    console.warn("Public collectible share was unavailable; opening X without the card preview.", error)
  }

  const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(makeCaption(cardData, shareUrl))}`
  if (!popup) return { method: "blocked", intentUrl, shareUrl }
  popup.location.replace(intentUrl)
  return { method: "x", intentUrl, shareUrl }
}
