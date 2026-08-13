import { useEffect, useRef } from "react"
import { drawBuilderCard, CARD_SIZE } from "../utils/canvasGenerator"

export default function BuilderPreview({ img, cardData, theme, transform }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CARD_SIZE
    canvas.height = CARD_SIZE
    const ctx = canvas.getContext("2d")
    drawBuilderCard(ctx, img, cardData, theme, transform)
  }, [img, cardData, theme, transform])

  return <canvas ref={canvasRef} className="builder-preview__canvas" />
}
