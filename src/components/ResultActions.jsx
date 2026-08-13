import { useState } from "react"

export default function ResultActions({ canGenerate, onGenerate, onShare, onDownload, onReset, hasExport }) {
  const [status, setStatus] = useState("")

  async function handleShare() {
    setStatus("")
    const result = await onShare()
    if (result?.method === "fallback") {
      setStatus("Image downloaded — attach it to your post before sending ✨")
    }
  }

  return (
    <div className="result-actions">
      {!hasExport ? (
        <button className="btn btn--primary btn--full" disabled={!canGenerate} onClick={onGenerate}>
          LOCK IN MY BUILDER ID → 🥝
        </button>
      ) : (
        <>
          <button className="btn btn--primary btn--full" disabled={!canGenerate} onClick={onGenerate}>UPDATE MY BUILDER PASS →</button>
          <button className="btn btn--primary btn--full" onClick={handleShare}>POST THIS ENERGY TO X →</button>
          <button className="btn btn--secondary btn--full" onClick={onDownload}>SAVE MY COLLECTIBLE PNG</button>
          <button className="btn btn--ghost btn--full" onClick={onReset}>Make Another</button>
        </>
      )}
      {status && <p className="result-actions__status">{status}</p>}
    </div>
  )
}
