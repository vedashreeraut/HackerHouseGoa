import { useEffect, useState } from "react"

export default function FinalReveal({ id, onBack, onDownload, onShare }) {
  const [status, setStatus] = useState("")
  const [src, setSrc] = useState("")
  useEffect(() => { const url = URL.createObjectURL(id.blob); setSrc(url); return () => URL.revokeObjectURL(url) }, [id.blob])
  async function share() { setStatus(""); const result = await onShare(); if (result?.method === "fallback") setStatus("Downloaded it — attach the pass to your post, then send it into the world.") }
  return <main className={`reveal reveal--${id.theme.id}`}>
    <button className="reveal__back" onClick={onBack}>← MAKE SOME CHANGES</button>
    <div className="reveal__sky" aria-hidden="true"><span>✈</span><i>⌁ ⌁</i></div>
    <p className="reveal__eyebrow">WELCOME TO THE HOUSE.</p>
    <h1>YOUR BUILDER<br/><b>PASS IS READY.</b></h1>
    <p className="reveal__energy">{id.cardData.tag.text}</p>
    <div className="reveal__lanyard"><span className="lanyard__loop" /><img src={src} alt={`Hacker House Goa pass for ${id.cardData.name}`} /></div>
    <div className="reveal__actions"><button className="btn btn--primary" onClick={onDownload}>SAVE MY ID ↓</button><button className="btn btn--secondary" onClick={share}>SHARE TO X →</button></div>
    {status && <p className="reveal__status">{status}</p>}
  </main>
}
