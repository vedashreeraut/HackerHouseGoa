import { useState } from "react"
import IntroScreen from "./components/IntroScreen"
import BuilderWorkspace from "./components/BuilderWorkspace"

export default function App() {
  const [screen, setScreen] = useState("intro") // "intro" | "workspace"

  return (
    <div className="app">
      <div className="goa-world" aria-hidden="true"><i className="sun" /><i className="cloud cloud--one" /><i className="cloud cloud--two" /><i className="bird bird--one">⌁</i><i className="bird bird--two">⌁</i><i className="island island--far" /><i className="island island--near" /><i className="palm palm--left">♠</i><i className="palm palm--right">♠</i><i className="foliage foliage--left">❧</i><i className="foliage foliage--right">❧</i><i className="wave" /><i className="world-kiwi">🥝</i></div>
      <div className={`screen screen--intro ${screen === "intro" ? "screen--active" : ""}`}><IntroScreen onStart={() => setScreen("workspace")} /></div>
      <div className={`screen screen--workspace ${screen === "workspace" ? "screen--active" : ""}`}>
        <header className="app-header"><button className="back-button" onClick={() => setScreen("intro")}>← BACK</button><span className="app-header__title">HACKER <b>HOUSE</b><i>GOA ’26</i></span><span className="app-header__stamp">THEKIWICREW 🥝</span></header>
        <div className="builder-masthead"><div><small>GOA, INDIA · 28—31 OCT 2026</small><h1>HACKER<br/><b>HOUSE</b><em>GOA</em></h1></div><p>YOUR PASSPORT TO A<br/><strong>BUILDER IDENTITY</strong><span>#FRAMEINGOA</span></p></div>
        <BuilderWorkspace />
        <footer className="site-footer"><span className="footer-kiwis">🥝 🥝 🥝</span> CREATED WITH CHAOS & COCONUTS BY <b>THEKIWICREW</b><small>HH GOA 2026 · #FRAMEINGOA</small></footer>
      </div>
    </div>
  )
}
