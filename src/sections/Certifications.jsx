import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import pic01 from "../assets/pic01.png"; // AWS AI Practitioner
import pic02 from "../assets/pic02.png"; // AWS Solutions Architect
import pic03 from "../assets/pic03.png"; // AWS Technical Essentials
import pic04 from "../assets/pic04.png"; // Automox Essentials L1
import pic05 from "../assets/pic05.png"; // Automox Practitioner L2
import pic06 from "../assets/pic06.png"; // ManageEngine Patch Manager
import pic07 from "../assets/pic07.png"; // AWS Cloud Practitioner Essentials
import pic08 from "../assets/pic08.png"; // ManageEngine Application Manager

// ── Correct mapping: pic → name → issuer → accent ─────────────────────────
const CERTS = [
  {
    src:    pic01,
    name:   "AWS AI Practitioner",
    issuer: "Amazon Web Services",
    accent: "#FF9900",
  },
  {
    src:    pic02,
    name:   "Solutions Architect Associate",
    issuer: "Amazon Web Services",
    accent: "#FF9900",
  },
  {
    src:    pic03,
    name:   "AWS Technical Essentials",
    issuer: "Amazon Web Services",
    accent: "#FF9900",
  },
  {
    src:    pic04,
    name:   "Automox Essentials — Level 1",
    issuer: "Automox University",
    accent: "#38bdf8",
  },
  {
    src:    pic05,
    name:   "Automox Practitioner — Level 2",
    issuer: "Automox University",
    accent: "#a78bfa",
  },
  {
    src:    pic06,
    name:   "UEMS Patch Manager Plus",
    issuer: "ManageEngine",
    accent: "#34d399",
  },
  {
    src:    pic07,
    name:   "Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    accent: "#FF9900",
  },
  {
    src:    pic08,
    name:   "MECPA Application Manager",
    issuer: "ManageEngine",
    accent: "#facc15",
  },
];

// Triplicate for seamless loop
const LOOPED = [...CERTS, ...CERTS, ...CERTS];

// ── Single cert card ──────────────────────────────────────────────────────────
function CertCard({ cert, onHover, onLeave }) {
  const cardRef = useRef(null);
  const mx      = useMotionValue(0);
  const my      = useMotionValue(0);
  const rotX    = useSpring(useTransform(my, [-70, 70], [14, -14]), { stiffness: 280, damping: 22 });
  const rotY    = useSpring(useTransform(mx, [-70, 70], [-14, 14]), { stiffness: 280, damping: 22 });
  const [active, setActive] = useState(false);

  const handleMove  = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left - r.width  / 2);
    my.set(e.clientY - r.top  - r.height / 2);
  };
  const handleEnter = () => { setActive(true);  onHover(); };
  const handleLeave = () => { setActive(false); mx.set(0); my.set(0); onLeave(); };

  return (
    <motion.div
      ref={cardRef}
      className="cc-wrap"
      style={{ "--ac": cert.accent }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.08, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        className="cc-inner"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      >
        {/* Spinning conic glow border */}
        <div className={`cc-glow-border ${active ? "cc-glow-border--on" : ""}`} />

        {/* Dark bg inset */}
        <div className="cc-bg-mask" />

        {/* HUD corner brackets */}
        <div className="cc-corner cc-corner--tl" />
        <div className="cc-corner cc-corner--tr" />
        <div className="cc-corner cc-corner--bl" />
        <div className="cc-corner cc-corner--br" />

        {/* Scan line on hover */}
        {active && <div className="cc-scanline" />}

        {/* Badge image */}
        <motion.img
          src={cert.src}
          alt={cert.name}
          className="cc-img"
          animate={{
            filter: active
              ? `drop-shadow(0 0 18px ${cert.accent}) drop-shadow(0 0 6px ${cert.accent})`
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
          }}
          transition={{ duration: 0.3 }}
          draggable={false}
        />

        {/* Sheen */}
        <div className={`cc-sheen ${active ? "cc-sheen--on" : ""}`} />

        {/* Name + issuer slides up on hover */}
        <motion.div
          className="cc-info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <span className="cc-info-name">{cert.name}</span>
          <span className="cc-info-issuer">{cert.issuer}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Certifications() {
  const [paused, setPaused] = useState(false);
  const [mouse, setMouse]   = useState({ x: -999, y: -999 });

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&family=JetBrains+Mono:wght@400;500&display=swap');

        .cert-section {
          background: #050810; position: relative; overflow: hidden;
          padding: 6rem 0 7rem; font-family: 'DM Sans', sans-serif;
        }
        .cert-section::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size: 60px 60px; pointer-events: none;
        }
        .cert-title {
          font-family: 'Syne',sans-serif; font-weight:800;
          font-size: clamp(2.5rem,6vw,5rem); letter-spacing:-0.02em; line-height:1;
          background: linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }

        /* Track */
        .cert-track {
          width:100%; overflow:hidden; position:relative; padding:2rem 0;
          -webkit-mask-image: linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
          mask-image:         linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
        }
        .cert-track-inner {
          display:flex; align-items:center; gap:1.75rem;
          width:max-content; will-change:transform;
          animation: cert-scroll 20s linear infinite;
        }
        .cert-track-inner.paused { animation-play-state: paused; }
        @keyframes cert-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        /* Card */
        .cc-wrap {
          position:relative; width:200px; height:200px; flex-shrink:0;
          cursor:pointer; perspective:900px;
        }
        .cc-inner {
          width:100%; height:100%; border-radius:18px;
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          border:1px solid rgba(255,255,255,0.08);
          transition:border-color 0.3s;
        }
        .cc-wrap:hover .cc-inner { border-color: var(--ac); }

        .cc-glow-border {
          position:absolute; inset:-2px; border-radius:20px;
          background:conic-gradient(from 0deg,var(--ac),transparent 40%,var(--ac) 60%,transparent);
          opacity:0; z-index:0; animation:cc-spin 3s linear infinite; transition:opacity 0.35s;
        }
        .cc-glow-border--on { opacity:0.75; }
        @keyframes cc-spin { to { transform:rotate(360deg); } }

        .cc-bg-mask {
          position:absolute; inset:1px; border-radius:17px;
          background:linear-gradient(135deg,#0a0d1a,#06080e); z-index:1;
        }

        .cc-corner {
          position:absolute; width:14px; height:14px; z-index:5; opacity:0;
          border-color:var(--ac); border-style:solid; transition:opacity 0.3s;
        }
        .cc-wrap:hover .cc-corner { opacity:1; }
        .cc-corner--tl { top:7px;    left:7px;  border-width:2px 0 0 2px; }
        .cc-corner--tr { top:7px;    right:7px; border-width:2px 2px 0 0; }
        .cc-corner--bl { bottom:7px; left:7px;  border-width:0 0 2px 2px; }
        .cc-corner--br { bottom:7px; right:7px; border-width:0 2px 2px 0; }

        .cc-scanline {
          position:absolute; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,var(--ac),transparent);
          z-index:6; opacity:0.8; animation:cc-scan 1.4s ease-in-out infinite;
        }
        @keyframes cc-scan { from{top:0} to{top:100%} }

        .cc-img {
          position:relative; z-index:4;
          max-width:72%; max-height:72%; object-fit:contain;
          transition:transform 0.3s;
        }
        .cc-wrap:hover .cc-img { transform:scale(1.06) translateZ(20px); }

        .cc-sheen {
          position:absolute; inset:0; z-index:5; border-radius:17px;
          background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 55%);
          opacity:0; pointer-events:none; transition:opacity 0.3s;
        }
        .cc-sheen--on { opacity:1; }

        .cc-info {
          position:absolute; bottom:0; left:0; right:0; padding:0.55rem 0.75rem;
          background:linear-gradient(to top,rgba(5,8,16,0.97) 0%,transparent 100%);
          z-index:7; display:flex; flex-direction:column; gap:2px;
          pointer-events:none; border-radius:0 0 17px 17px;
        }
        .cc-info-name {
          font-family:'Syne',sans-serif; font-weight:700;
          font-size:0.63rem; color:#fff; letter-spacing:0.02em; line-height:1.3;
        }
        .cc-info-issuer {
          font-family:'JetBrains Mono',monospace; font-size:0.5rem;
          color:var(--ac); letter-spacing:0.08em; text-transform:uppercase; opacity:0.9;
        }

        .cert-pause-hint {
          font-family:'JetBrains Mono',monospace; font-size:0.56rem;
          letter-spacing:0.18em; text-transform:uppercase;
          color:rgba(255,255,255,0.2); text-align:center; margin-top:0.75rem;
        }

        .cert-stat-num {
          font-family:'Syne',sans-serif; font-weight:800; font-size:2rem; line-height:1;
          background:linear-gradient(135deg,#fff,rgba(255,255,255,0.5));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .cert-stat-label {
          font-size:0.62rem; letter-spacing:0.15em; text-transform:uppercase;
          color:rgba(255,255,255,0.3); margin-top:0.3rem;
          font-family:'JetBrains Mono',monospace;
        }
        .cert-section-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent);
          animation:cs-scan 10s linear infinite; pointer-events:none; z-index:2;
        }
        @keyframes cs-scan { from{top:0} to{top:100%} }
      `}</style>

      <section id="certifications" className="cert-section">
        <div className="cert-section-scan" />

        {/* Mouse spotlight */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
          background:`radial-gradient(500px circle at ${mouse.x}px ${mouse.y}px,rgba(167,139,250,0.06) 0%,transparent 70%)`,
          transition:"background 0.05s" }} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"20%", left:"-6%", width:"500px", height:"500px", borderRadius:"50%", background:"#a78bfa", opacity:0.05, filter:"blur(100px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"-6%", width:"500px", height:"500px", borderRadius:"50%", background:"#38bdf8", opacity:0.05, filter:"blur(100px)", pointerEvents:"none" }} />

        {/* Top accent line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(56,189,248,0.5),transparent)", zIndex:3 }} />

        {/* Heading */}
        <motion.div
          initial={{ opacity:0, y:-28 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.7 }}
          style={{ textAlign:"center", marginBottom:"3rem", position:"relative", zIndex:5 }}
        >
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:"0.5rem" }}>
            AWS &amp; Cloud
          </p>
          <h2 className="cert-title">CERTIFICATIONS</h2>
          <p style={{ marginTop:"0.6rem", fontSize:"0.82rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.04em" }}>
            Verified credentials across cloud infrastructure &amp; DevOps
          </p>
        </motion.div>

        {/* Single marquee */}
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}
        >
          <div className="cert-track">
            <div className={`cert-track-inner ${paused ? "paused" : ""}`}>
              {LOOPED.map((cert, i) => (
                <CertCard
                  key={i}
                  cert={cert}
                  onHover={() => setPaused(true)}
                  onLeave={() => setPaused(false)}
                />
              ))}
            </div>
          </div>
          <p className="cert-pause-hint">Hover a badge to pause &amp; inspect ↑</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
          style={{ display:"flex", justifyContent:"center", gap:"4rem", marginTop:"3.5rem", position:"relative", zIndex:5 }}
        >
          {[
            { num:"8",    label:"Certifications",  color:"#a78bfa" },
            { num:"2+",   label:"Years Experience", color:"#38bdf8" },
            { num:"100%", label:"AWS Verified",     color:"#34d399" },
          ].map((s) => (
            <motion.div key={s.label} whileHover={{ y:-4 }}
              transition={{ type:"spring", stiffness:300 }}
              style={{ textAlign:"center", padding:"1rem 1.5rem", borderRadius:"14px",
                background:"linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
                border:"1px solid rgba(255,255,255,0.07)", position:"relative", overflow:"hidden",
                transition:"border-color .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=s.color; e.currentTarget.style.boxShadow=`0 0 24px -8px ${s.color}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow="none"; }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:`linear-gradient(90deg,transparent,${s.color},transparent)`, opacity:.5 }} />
              <div className="cert-stat-num">{s.num}</div>
              <div className="cert-stat-label">{s.label}</div>
              <div style={{ width:40, height:2, borderRadius:2, background:s.color, boxShadow:`0 0 8px ${s.color}`, margin:"0.4rem auto 0" }} />
            </motion.div>
          ))}
        </motion.div>

        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)", zIndex:3 }} />
      </section>
    </>
  );
}