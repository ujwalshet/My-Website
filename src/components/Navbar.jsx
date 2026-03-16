import { useState, useEffect, useRef } from "react";
import OverlayMenu from "./OverlayMenu";
import { FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";
import AwsLogo from "./AwsLogo"; // adjust path as needed

const NAV_LINKS = ["home", "about", "experience", "projects", "certifications", "contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [visible, setVisible]       = useState(true);
  const [scrolled, setScrolled]     = useState(false);
  const [activeSection, setActive]  = useState("home");
  const [hudBlink, setHudBlink]     = useState(true);
  const [time, setTime]             = useState("");

  const lastScrollY  = useRef(0);
  const hideTimer    = useRef(null);
  const forceVisible = useRef(true);

  // Live clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB",{ hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id);
  },[]);

  // HUD blink
  useEffect(() => {
    const id = setInterval(() => setHudBlink(v => !v), 1600);
    return () => clearInterval(id);
  },[]);

  // Active section
  useEffect(() => {
    const observers = NAV_LINKS.map(id => {
      const el = document.querySelector(`#${id}`);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold:0.35 }
      );
      obs.observe(el); return obs;
    }).filter(Boolean);
    return () => observers.forEach(o => o.disconnect());
  },[]);

  // Force visible on #home
  useEffect(() => {
    const home = document.querySelector("#home");
    if (!home) return;
    const obs = new IntersectionObserver(
      ([e]) => { forceVisible.current = e.isIntersecting; if (e.isIntersecting) setVisible(true); },
      { threshold:0.1 }
    );
    obs.observe(home); return () => obs.disconnect();
  },[]);

  // Scroll show/hide
  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 50);
      if (forceVisible.current) { setVisible(true); lastScrollY.current = cur; return; }
      if (cur < lastScrollY.current - 5) setVisible(true);
      else if (cur > lastScrollY.current + 5) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), 1500);
      }
      lastScrollY.current = cur;
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(hideTimer.current); };
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .nav-root {
          position:fixed; top:0; left:0; width:100%; z-index:50;
          transition:transform 0.4s cubic-bezier(.22,1,.36,1);
          font-family:'JetBrains Mono',monospace;
        }
        .nav-root.nav-hidden { transform:translateY(-110%); }

        .nav-top-line {
          height:1px; width:100%;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.7),rgba(56,189,248,0.7),transparent);
        }

        .nav-glass {
          display:flex; align-items:center; justify-content:space-between;
          padding:0.6rem 1.5rem;
          background:rgba(5,8,16,0.78);
          backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          position:relative; gap:1rem;
        }
        .nav-glass::before {
          content:''; position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:40px 40px; pointer-events:none;
        }

        /* Logo */
        .nav-logo { display:flex; align-items:center; gap:0.6rem; text-decoration:none; flex-shrink:0; }
        .nav-logo-name {
          font-family:'Syne',sans-serif; font-weight:800; font-size:0.95rem; letter-spacing:0.04em;
          background:linear-gradient(135deg,#fff 40%,rgba(255,255,255,0.45));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nav-logo-sub { font-size:0.5rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(52,211,153,0.6); display:block; margin-top:-2px; }

        /* Pill nav */
        .nav-pill {
          display:flex; align-items:center; gap:0;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:99px; padding:3px;
        }
        .nav-link {
          position:relative; padding:5px 14px; border-radius:99px;
          font-size:0.6rem; letter-spacing:0.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.38); text-decoration:none; transition:color .25s; white-space:nowrap;
        }
        .nav-link:hover { color:rgba(255,255,255,0.8); }
        .nav-link.active-link { color:#fff; }
        .nav-link-bg {
          position:absolute; inset:0; border-radius:99px;
          background:linear-gradient(135deg,rgba(167,139,250,0.18),rgba(56,189,248,0.12));
          border:1px solid rgba(167,139,250,0.25); z-index:-1;
        }

        .nav-right { display:flex; align-items:center; gap:0.75rem; flex-shrink:0; }
        .nav-hud-data { display:flex; flex-direction:column; align-items:flex-end; gap:1px; }
        .nav-hud-line { font-size:0.5rem; letter-spacing:0.14em; text-transform:uppercase; color:rgba(52,211,153,0.5); line-height:1; }
        .nav-hud-time { font-size:0.56rem; letter-spacing:0.1em; color:rgba(255,255,255,0.28); }

        .nav-cta {
          display:inline-flex; align-items:center; gap:0.4rem;
          padding:0.45rem 1.1rem; border-radius:8px;
          background:linear-gradient(135deg,#a78bfa,#38bdf8);
          color:#000; font-weight:700; font-size:0.68rem;
          letter-spacing:0.08em; text-transform:uppercase; text-decoration:none;
          transition:box-shadow .3s,transform .2s; white-space:nowrap;
          font-family:'JetBrains Mono',monospace;
        }
        .nav-cta:hover { box-shadow:0 0 24px rgba(167,139,250,.6); transform:translateY(-1px); }

        .nav-burger {
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
          border-radius:8px; padding:0.4rem; color:rgba(255,255,255,0.7);
          cursor:pointer; font-size:1.15rem; transition:background .25s,color .25s,border-color .25s,box-shadow .25s;
          display:flex; align-items:center; justify-content:center;
        }
        .nav-burger:hover {
          background:rgba(167,139,250,0.12); border-color:rgba(167,139,250,0.35);
          color:#fff; box-shadow:0 0 16px rgba(167,139,250,.3);
        }

        .nav-section-bar { height:2px; width:100%; background:rgba(255,255,255,0.04); position:relative; overflow:hidden; }
        .nav-section-fill {
          position:absolute; left:0; top:0; bottom:0;
          background:linear-gradient(90deg,#a78bfa,#38bdf8);
          box-shadow:0 0 8px rgba(167,139,250,.5);
          transition:width 0.5s ease; border-radius:0 2px 2px 0;
        }
      `}</style>

      <nav className={`nav-root ${visible ? "" : "nav-hidden"}`}>
        <div className="nav-top-line" />

        <div className="nav-glass">

          {/* ── Logo: AWS glow mark + text ── */}
          <a href="#home" className="nav-logo">
            <AwsLogo size={36} />
            <div className="hidden sm:block">
              <span className="nav-logo-name">Cloud Solutions</span>
              <span className="nav-logo-sub">AWS Engineer</span>
            </div>
          </a>

          {/* ── Center pill links ── */}
          <div className="nav-pill hidden lg:flex">
            {NAV_LINKS.map(id => (
              <a key={id} href={`#${id}`} className={`nav-link ${activeSection===id?"active-link":""}`}>
                {activeSection===id && (
                  <motion.div className="nav-link-bg" layoutId="nav-active-pill" transition={{ type:"spring", stiffness:400, damping:30 }} />
                )}
                {id}
              </a>
            ))}
          </div>

          {/* ── Right ── */}
          <div className="nav-right">
            <div className="nav-hud-data hidden lg:flex">
              <span className="nav-hud-line">{hudBlink ? "● sys:online" : "○ sys:online"}</span>
              <span className="nav-hud-time">{time}</span>
            </div>
            <a href="#contact" className="nav-cta hidden lg:inline-flex">
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#000", opacity:.5 }} />
              Reach Out
            </a>
            <button onClick={() => setMenuOpen(true)} className="nav-burger" aria-label="Open Menu">
              <FiMenu />
            </button>
          </div>
        </div>

        {/* Section progress bar */}
        <div className="nav-section-bar">
          <div
            className="nav-section-fill"
            style={{ width:`${((NAV_LINKS.indexOf(activeSection)+1)/NAV_LINKS.length)*100}%` }}
          />
        </div>
      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}