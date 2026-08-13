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
  // Local Vite does not host server functions. Use the deployed app rather
  // than ever putting localhost in a public X post.
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return "https://hacker-house-goa-chi.vercel.app"
  return window.location.origin
}

export async function shareToX(blob, cardData) {
  // Reserve a tab while the click is still a trusted gesture.
  const popup = window.open("", "_blank")
  if (popup) popup.opener = null

  const shareUrl = "https://hacker-house-goa-chi.vercel.app/"

  const tweetText = makeCaption(cardData, shareUrl)

  const intentUrl =
    `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`

  console.log("SHARE URL:", shareUrl)
  console.log("TWEET TEXT:", tweetText)
  console.log("X SHARE URL:", intentUrl)

  if (!popup) {
    return {
      method: "blocked",
      intentUrl,
      shareUrl,
    }
  }

  popup.location.replace(intentUrl)

  return {
    method: "x",
    intentUrl,
    shareUrl,
  }
}