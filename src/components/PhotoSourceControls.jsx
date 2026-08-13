import { useRef, useState } from "react"
import CameraCapture from "./CameraCapture"
import { validateImageFile, normalizeToDisplayableImage, loadImageFromFile } from "../utils/imageUtils"

export default function PhotoSourceControls({ onPhotoReady }) {
  const inputRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file) {
    setError("")
    const { ok, error: validationError } = validateImageFile(file)
    if (!ok) {
      setError(validationError)
      return
    }
    try {
      setIsConverting(true)
      const displayable = await normalizeToDisplayableImage(file)
      const { img, url } = await loadImageFromFile(displayable)
      onPhotoReady({ img, url })
    } catch {
      setError("Couldn't process that photo. Try a different file.")
    } finally {
      setIsConverting(false)
      setShowCamera(false)
    }
  }

  return (
    <div className="photo-source">
      <div className="photo-source__buttons">
        <button type="button" className="btn btn--secondary" onClick={() => inputRef.current?.click()}>
          Choose from my gallery
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setShowCamera(true)}>
          Take one right now
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
          hidden
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
      {isConverting && <p className="upload-zone__text">Reading your photo…</p>}
      {error && <p className="form-error">{error}</p>}

      {showCamera && (
        <div className="camera-overlay">
          <CameraCapture onCapture={handleFile} onCancel={() => setShowCamera(false)} />
        </div>
      )}
    </div>
  )
}
