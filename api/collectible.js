import { list } from "@vercel/blob"

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]))
}

function siteUrl(request) {
  const configured = process.env.PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (configured) return configured.startsWith("http") ? configured.replace(/\/$/, "") : `https://${configured}`
  return new URL(request.url).origin
}

export default async function handler(request, response) {
  const id = typeof request.query.id === "string" ? request.query.id : ""
  if (!/^[0-9a-f-]{36}$/i.test(id)) return response.status(404).send("Collectible not found.")

  try {
    const { blobs } = await list({ prefix: `collectibles/${id}.json`, limit: 1 })
    const metadataBlob = blobs.find((blob) => blob.pathname === `collectibles/${id}.json`)
    if (!metadataBlob) return response.status(404).send("Collectible not found.")
    const metadata = await fetch(metadataBlob.url).then((result) => result.ok ? result.json() : null)
    if (!metadata?.imageUrl?.startsWith("https://")) return response.status(404).send("Collectible not found.")

    const canonical = `${siteUrl(request)}/share/${id}`
    const title = "HH Goa 2026 Builder ID"
    const description = "Just got my HH Goa 2026 Builder ID 🌴⚡ #FrameInGoa"
    const safeTitle = escapeHtml(title)
    const safeDescription = escapeHtml(description)
    const safeImage = escapeHtml(metadata.imageUrl)
    const safeCanonical = escapeHtml(canonical)
    const safeName = escapeHtml(metadata.name || "Builder")
    const safeEnergy = escapeHtml(metadata.energy || "GOA BUILDER")

    response.setHeader("Content-Type", "text/html; charset=utf-8")
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600")
    return response.status(200).send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title><meta name="description" content="${safeDescription}">
<meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}">
<meta property="og:image" content="${safeImage}"><meta property="og:url" content="${safeCanonical}"><meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDescription}"><meta name="twitter:image" content="${safeImage}">
</head><body><main><h1>${safeTitle}</h1><p>${safeName} · ${safeEnergy}</p><img src="${safeImage}" alt="${safeTitle}"></main></body></html>`)
  } catch (error) {
    console.error("Could not load collectible share", error)
    return response.status(500).send("Could not load collectible.")
  }
}
