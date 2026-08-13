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
  return `Just unlocked my Hacker House Goa collectible ⚡️\n\nBuilder: ${name}\nEnergy: ${energy}\n\nSee you in Goa 🌴🔥\n\n#HackerHouseGoa #HHGoa #FrameInGoa${publicLink}`
}

function getPublicAppUrl() {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.VITE_SHARE_API_ORIGIN
  if (configured) return configured.replace(/\/$/, "")
  // Local Vite does not host /api functions. Keep the post link public rather
  // than accidentally inserting localhost into a post.
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return "https://hh-goa-builder.vercel.app"
  return window.location.origin
}

function canUseLocalShareApi() {
  return window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
}

export async function shareToX(blob, cardData) {
  // Reserve a tab while the click is still a trusted gesture. Opening X after
  // an asynchronous upload is otherwise blocked by many mobile browsers.
  const popup = window.open("", "_blank")
  if (popup) popup.opener = null

  const id = crypto.randomUUID()
  const publicAppUrl = getPublicAppUrl()
  let shareUrl = `${publicAppUrl}/share/${id}`
  try {
    const apiOrigin = (import.meta.env.VITE_SHARE_API_ORIGIN || "").replace(/\/$/, "")
    const apiAvailable = apiOrigin || canUseLocalShareApi()
    if (!apiAvailable) throw new Error("Public share API is not configured for local Vite.")
    const payload = { id, image: await toDataUrl(blob), name: cardData.name, energy: cardData.tag?.text || cardData.builderType }
    // In Vercel this remains same-origin. For local Vite development, point
    // VITE_SHARE_API_ORIGIN at the deployed HTTPS app to test real share cards.
    const response = await fetch(`${apiOrigin}/api/share`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const result = await response.json().catch(() => ({}))
    if (response.ok && result.shareUrl) shareUrl = result.shareUrl
    else console.warn("Public collectible upload was unavailable; the post still includes its reserved app link.", result.error)
  } catch (error) {
    // A local Vite server does not host Vercel API functions. Sharing text to
    // X must still work even when a public image preview cannot be prepared.
    console.warn("Public collectible upload was unavailable; the post still includes its reserved app link.", error)
  }

  const tweetText = makeCaption(cardData, shareUrl)
  const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`
  console.log("SHARE URL:", shareUrl)
  console.log("TWEET TEXT:", tweetText)
  console.log("X SHARE URL:", intentUrl)
  if (!popup) return { method: "blocked", intentUrl, shareUrl }
  popup.location.replace(intentUrl)
  return { method: "x", intentUrl, shareUrl }
}
