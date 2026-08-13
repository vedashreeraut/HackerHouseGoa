import { useEffect, useRef, useState } from "react"

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState("")
  const [capturedUrl, setCapturedUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        setError("Camera access was blocked. You can upload a photo instead.")
      }
    }
    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function handleCapture() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) setCapturedUrl(URL.createObjectURL(blob))
    }, "image/jpeg", 0.92)
  }

  function handleRetake() {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl)
    setCapturedUrl(null)
  }

  async function handleUsePhoto() {
    const res = await fetch(capturedUrl)
    const blob = await res.blob()
    const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
    onCapture(file)
  }

  if (error) {
    return (
      <div className="camera-modal">
        <p className="form-error">{error}</p>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Close</button>
      </div>
    )
  }

  return (
    <div className="camera-modal">
      {!capturedUrl ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="camera-modal__video" />
          <div className="camera-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn--primary" onClick={handleCapture}>Capture</button>
          </div>
        </>
      ) : (
        <>
          <img src={capturedUrl} alt="" className="camera-modal__video" />
          <div className="camera-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={handleRetake}>Retake</button>
            <button type="button" className="btn btn--primary" onClick={handleUsePhoto}>Use Photo</button>
          </div>
        </>
      )}
    </div>
  )
}
