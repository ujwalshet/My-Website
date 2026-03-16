import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiX, FiHome, FiUser, FiCode, FiFolder,
  FiBriefcase, FiMessageSquare, FiMail, FiAward
} from "react-icons/fi";

const MENU_ITEMS = [
  { name: "Home",           icon: FiHome,          accent: "#a78bfa", cmd: "goto --home" },
  { name: "About",          icon: FiUser,           accent: "#38bdf8", cmd: "cat about.md" },
  { name: "Experience",     icon: FiBriefcase,      accent: "#34d399", cmd: "ls ./experience" },
  { name: "Projects",       icon: FiFolder,         accent: "#fb923c", cmd: "open projects/" },
  { name: "Certifications", icon: FiAward,          accent: "#f472b6", cmd: "verify certs.json" },
  { name: "Contact",        icon: FiMail,           accent: "#facc15", cmd: "send --contact" },
];

// ── Scanline canvas overlay ───────────────────────────────────────────────────
function ScanLines() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
    }} />
  );
}

// ── Animated grid ─────────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
  );
}

// ── Corner HUD brackets ───────────────────────────────────────────────────────
function HudCorners() {
  const style = (pos) => ({
    position: "absolute", width: 32, height: 32,
    borderColor: "rgba(52,211,153,0.45)", borderStyle: "solid",
    ...pos,
  });
  return (
    <>
      <div style={style({ top: 20, left: 20, borderWidth: "2px 0 0 2px" })} />
      <div style={style({ top: 20, right: 20, borderWidth: "2px 2px 0 0" })} />
      <div style={style({ bottom: 20, left: 20, borderWidth: "0 0 2px 2px" })} />
      <div style={style({ bottom: 20, right: 20, borderWidth: "0 2px 2px 0" })} />
    </>
  );
}

// ── Particle field ────────────────────────────────────────────────────────────
function Particles({ count = 40 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      color: ["#a78bfa","#38bdf8","#34d399","#fb923c","#f472b6"][Math.floor(Math.random()*5)],
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
            width: p.size, height: p.size, borderRadius:"50%",
            background: p.color, boxShadow:`0 0 6px ${p.color}`,
          }}
          animate={{ y:[0,-30,0], opacity:[0.2,0.7,0.2] }}
          transition={{ duration:p.duration, delay:p.delay, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Menu item row ─────────────────────────────────────────────────────────────
function MenuItem({ item, index, onClose, isHovered, onHover, onLeave }) {
  return (
    <motion.li
      initial={{ opacity:0, x:-60 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }}
      transition={{ delay: 0.15 + index * 0.07, type:"spring", stiffness:280, damping:24 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ listStyle:"none" }}
    >
      <a
        href={`#${item.name.toLowerCase()}`}
        onClick={onClose}
        style={{ textDecoration:"none", display:"block" }}
      >
        <motion.div
          animate={{
            x: isHovered ? 12 : 0,
            background: isHovered ? `rgba(${hexToRgb(item.accent)},0.07)` : "transparent",
          }}
          transition={{ type:"spring", stiffness:300, damping:22 }}
          style={{
            display:"flex", alignItems:"center", gap:"1.5rem",
            padding:"0.75rem 1.5rem", borderRadius:"12px",
            border: isHovered ? `1px solid ${item.accent}30` : "1px solid transparent",
            position:"relative", overflow:"hidden",
            cursor:"pointer",
          }}
        >
          {/* Left accent bar */}
          <motion.div
            animate={{ height: isHovered ? "100%" : "0%" }}
            transition={{ duration:0.25 }}
            style={{
              position:"absolute", left:0, top:0, width:"2px",
              background:item.accent, boxShadow:`0 0 10px ${item.accent}`,
              borderRadius:"0 2px 2px 0",
            }}
          />

          {/* Index number */}
          <span style={{
            fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem",
            color: isHovered ? item.accent : "rgba(255,255,255,0.2)",
            letterSpacing:"0.1em", minWidth:"24px",
            transition:"color 0.25s",
          }}>
            {String(index + 1).padStart(2,"0")}
          </span>

          {/* Icon */}
          <motion.div
            animate={{ rotate: isHovered ? [0,10,-6,0] : 0, scale: isHovered ? 1.15 : 1 }}
            transition={{ duration:0.4 }}
            style={{
              color: isHovered ? item.accent : "rgba(255,255,255,0.35)",
              fontSize:"1.1rem", display:"flex", alignItems:"center",
              transition:"color 0.25s",
              filter: isHovered ? `drop-shadow(0 0 8px ${item.accent})` : "none",
            }}
          >
            <item.icon />
          </motion.div>

          {/* Name */}
          <span style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(1.8rem, 4vw, 3rem)", lineHeight:1,
            color: isHovered ? "#fff" : "rgba(255,255,255,0.5)",
            letterSpacing:"-0.02em",
            transition:"color 0.25s",
            textShadow: isHovered ? `0 0 40px ${item.accent}60` : "none",
          }}>
            {item.name}
          </span>

          {/* Terminal command — slides in on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity:0, x:20 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:10 }}
                transition={{ duration:0.2 }}
                style={{
                  marginLeft:"auto",
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:"0.65rem", letterSpacing:"0.08em",
                  color: item.accent, opacity:0.7,
                  whiteSpace:"nowrap",
                }}
              >
                $ {item.cmd}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Arrow */}
          <motion.span
            animate={{ x: isHovered ? 0 : -8, opacity: isHovered ? 1 : 0 }}
            transition={{ duration:0.2 }}
            style={{ color:item.accent, fontSize:"1.2rem", marginLeft: isHovered ? "0" : "auto" }}
          >
            →
          </motion.span>
        </motion.div>
      </a>
    </motion.li>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OverlayMenu({ isOpen, onClose }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [time, setTime] = useState("");
  const [hudBlink, setHudBlink] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const origin = isMobile ? "95% 5%" : "95% 5%";

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHudBlink(v => !v), 1500);
    return () => clearInterval(id);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .overlay-noise::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }

        .overlay-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.15),transparent);
          animation:ov-scan 7s linear infinite; pointer-events:none; z-index:3;
        }
        @keyframes ov-scan { from{top:0} to{top:100%} }

        .close-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 0.5rem;
          color: rgba(255,255,255,0.6);
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition: background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.2s;
          font-size: 1.2rem;
        }
        .close-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #ef4444;
          box-shadow: 0 0 20px rgba(239,68,68,0.3);
          transform: rotate(90deg) scale(1.1);
        }

        .hud-label {
          font-family:'JetBrains Mono',monospace;
          font-size:0.55rem; letter-spacing:0.18em; text-transform:uppercase;
          color:rgba(52,211,153,0.5);
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overlay-noise"
            style={{
              position:"fixed", inset:0, zIndex:100,
              background:"rgba(3,5,12,0.97)",
              backdropFilter:"blur(24px)",
            }}
            initial={{ clipPath:`circle(0% at ${origin})` }}
            animate={{ clipPath:`circle(160% at ${origin})` }}
            exit={{ clipPath:`circle(0% at ${origin})` }}
            transition={{ duration:0.65, ease:[0.4,0,0.2,1] }}
          >
            <GridBg />
            <ScanLines />
            <Particles />
            <HudCorners />
            <div className="overlay-scan" />

            {/* Top gradient line */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.6),rgba(56,189,248,0.6),transparent)", zIndex:4 }} />
            {/* Bottom gradient line */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)", zIndex:4 }} />

            {/* ── HEADER ── */}
            <motion.div
              initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.1, duration:0.5 }}
              style={{
                position:"absolute", top:0, left:0, right:0,
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"1.25rem 1.75rem", zIndex:10,
                borderBottom:"1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Left: logo text */}
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"0.9rem", color:"rgba(255,255,255,0.8)", letterSpacing:"0.04em" }}>
                  NAVIGATION
                </div>
                <div className="hud-label" style={{ marginTop:"2px" }}>
                  {hudBlink ? "● sys:online" : "○ sys:online"} · {time}
                </div>
              </div>

              {/* Right: section count + close */}
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ textAlign:"right" }}>
                  <div className="hud-label">{MENU_ITEMS.length} routes available</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.12em" }}>
                    SELECT DESTINATION
                  </div>
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close Menu">
                  <FiX />
                </button>
              </div>
            </motion.div>

            {/* ── MENU ITEMS ── */}
            <div style={{
              position:"absolute", inset:0, zIndex:5,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"6rem 2rem 4rem",
            }}>
              <div style={{ width:"100%", maxWidth:"780px" }}>

                {/* Terminal prompt header */}
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay:0.2 }}
                  style={{
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize:"0.65rem", color:"rgba(52,211,153,0.5)",
                    letterSpacing:"0.12em", marginBottom:"1.5rem",
                    paddingLeft:"1.5rem",
                  }}
                >
                  ujwal@cloud:~$ <span style={{ color:"rgba(255,255,255,0.3)" }}>list --all --routes</span>
                </motion.div>

                <ul style={{ margin:0, padding:0 }}>
                  {MENU_ITEMS.map((item, idx) => (
                    <MenuItem
                      key={item.name}
                      item={item}
                      index={idx}
                      onClose={onClose}
                      isHovered={hoveredIdx === idx}
                      onHover={() => setHoveredIdx(idx)}
                      onLeave={() => setHoveredIdx(null)}
                    />
                  ))}
                </ul>

                {/* Bottom status */}
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    marginTop:"1.5rem", paddingLeft:"1.5rem",
                    display:"flex", alignItems:"center", gap:"1.5rem",
                  }}
                >
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.18)", letterSpacing:"0.1em" }}>
                    ESC to close
                  </span>
                  <span style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.05)" }} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"rgba(167,139,250,0.4)", letterSpacing:"0.1em" }}>
                    ujwalshet.cloud
                  </span>
                </motion.div>
              </div>
            </div>

            {/* ── RIGHT SIDE DECORATION (desktop) ── */}
            <motion.div
              initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3, duration:0.6 }}
              style={{
                position:"absolute", right:"3rem", top:"50%", transform:"translateY(-50%)",
                zIndex:5, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"1rem",
              }}
              className="hidden lg:flex"
            >
              {/* Vertical status lines */}
              {[
                { label:"AWS:ACTIVE",    color:"#34d399" },
                { label:"EC2:RUNNING",   color:"#38bdf8" },
                { label:"LAMBDA:READY",  color:"#a78bfa" },
                { label:"MONITOR:ON",    color:"#fb923c" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  style={{
                    display:"flex", alignItems:"center", gap:"0.5rem",
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase",
                    color: s.color, opacity:0.6,
                  }}
                >
                  <span style={{ width:24, height:1, background:s.color, opacity:0.5, display:"inline-block" }} />
                  {hudBlink && i === 0 ? "● " : ""}{s.label}
                </motion.div>
              ))}

              {/* Mini decorative grid */}
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay:0.6 }}
                style={{ marginTop:"1rem", display:"grid", gridTemplateColumns:"repeat(5,10px)", gap:"4px" }}
              >
                {Array.from({ length:25 }, (_, i) => (
                  <div key={i} style={{
                    width:10, height:10, borderRadius:2,
                    background: Math.random() > 0.5
                      ? "rgba(167,139,250,0.25)"
                      : "rgba(255,255,255,0.05)",
                    boxShadow: Math.random() > 0.7 ? "0 0 6px rgba(167,139,250,0.4)" : "none",
                  }} />
                ))}
              </motion.div>
            </motion.div>

            {/* ESC key listener */}
            <EscListener onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EscListener({ onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return null;
}