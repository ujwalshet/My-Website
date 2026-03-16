import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Boot log lines ─────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "INITIALIZING CLOUD SYSTEMS...",      color: "rgba(255,255,255,0.5)",  delay: 0 },
  { text: "AWS SERVICES: CONNECTED",            color: "#34d399",                delay: 120 },
  { text: "EC2 · VPC · IAM · LAMBDA · S3",      color: "rgba(255,255,255,0.3)",  delay: 240 },
  { text: "LOADING PORTFOLIO v2.4.1...",         color: "#38bdf8",                delay: 360 },
  { text: "IDENTITY CONFIRMED: UJWAL SHET",     color: "#a78bfa",                delay: 500 },
  { text: "STATUS: ONLINE · READY",             color: "#34d399",                delay: 640 },
];

// ── Greetings ──────────────────────────────────────────────────────────────────
const GREETINGS = [
  { text: "Hello",         lang: "English" },
  { text: "नमस्ते",       lang: "Hindi" },
  { text: "ನಮಸ್ಕಾರ",    lang: "Kannada" },
  { text: "Hola",          lang: "Spanish" },
  { text: "Bonjour",       lang: "French" },
  { text: "Ciao",          lang: "Italian" },
  { text: "Olá",           lang: "Portuguese" },
  { text: "Merhaba",       lang: "Turkish" },
  { text: "Hallo",         lang: "German" },
  { text: "Salam",         lang: "Arabic" },
];

// ── Radar canvas ───────────────────────────────────────────────────────────────
function RadarCanvas({ size = 180 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    const cx = size / 2, R = size / 2 - 6;
    let angle = 0, id;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      // Rings
      [1, 0.66, 0.33].forEach(f => {
        ctx.beginPath();
        ctx.arc(cx, cx, R * f, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52,211,153,${f === 1 ? 0.35 : 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      // Crosshairs
      ctx.strokeStyle = "rgba(52,211,153,0.12)";
      ctx.lineWidth = 0.5;
      [[cx,cx-R,cx,cx+R],[cx-R,cx,cx+R,cx]].forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Sweep
      for (let i = 0; i < 40; i++) {
        const a = angle - (i / 40) * Math.PI * 0.7;
        ctx.beginPath();
        ctx.moveTo(cx, cx);
        ctx.arc(cx, cx, R, a, a + Math.PI * 0.7 / 40);
        ctx.closePath();
        ctx.fillStyle = `rgba(52,211,153,${(i / 40) * 0.22})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(angle) * R, cx + Math.sin(angle) * R);
      ctx.strokeStyle = "rgba(52,211,153,0.9)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#34d399"; ctx.shadowBlur = 8;
      ctx.stroke(); ctx.shadowBlur = 0;
      angle += 0.03;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [size]);
  return <canvas ref={ref} width={size} height={size} />;
}

// ── Particle burst canvas ──────────────────────────────────────────────────────
function ParticleBurst({ trigger }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cx = W / 2, cy = H / 2;
    const COLORS = ["#a78bfa","#38bdf8","#34d399","#fb923c","#f472b6","#facc15"];
    const particles = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
      };
    });
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.08; // gravity
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });
      if (alive) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [trigger]);
  return (
    <canvas
      ref={ref}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:2 }}
    />
  );
}

// ── Corner HUD brackets ────────────────────────────────────────────────────────
function HudCorners({ accent = "rgba(52,211,153,0.5)" }) {
  const s = (pos) => ({
    position:"absolute", width:24, height:24,
    borderColor: accent, borderStyle:"solid", ...pos,
  });
  return (
    <>
      <div style={s({ top:16, left:16, borderWidth:"2px 0 0 2px" })} />
      <div style={s({ top:16, right:16, borderWidth:"2px 2px 0 0" })} />
      <div style={s({ bottom:16, left:16, borderWidth:"0 0 2px 2px" })} />
      <div style={s({ bottom:16, right:16, borderWidth:"0 2px 2px 0" })} />
    </>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function BootProgress({ progress }) {
  return (
    <div style={{ width:"280px", position:"relative" }}>
      <div style={{ height:"2px", background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
        <motion.div
          style={{ height:"100%", background:"linear-gradient(90deg,#a78bfa,#38bdf8,#34d399)", borderRadius:2 }}
          animate={{ width:`${progress}%` }}
          transition={{ duration:0.3, ease:"easeOut" }}
        />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", color:"rgba(52,211,153,0.5)", letterSpacing:"0.1em" }}>
          LOADING
        </span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

// ── Glitch text ────────────────────────────────────────────────────────────────
function GlitchGreeting({ text }) {
  return (
    <span className="intro-glitch" data-text={text} style={{ position:"relative", display:"inline-block" }}>
      {text}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function IntroAnimation({ onFinish }) {
  // Phases: "boot" → "greet" → "exit"
  const [phase, setPhase]           = useState("boot");
  const [bootLines, setBootLines]   = useState([]);
  const [progress, setProgress]     = useState(0);
  const [greetIdx, setGreetIdx]     = useState(0);
  const [visible, setVisible]       = useState(true);
  const [burst, setBurst]           = useState(false);
  const [hudBlink, setHudBlink]     = useState(true);

  // HUD blink
  useEffect(() => {
    const id = setInterval(() => setHudBlink(v => !v), 900);
    return () => clearInterval(id);
  }, []);

  // ── BOOT phase: reveal log lines + progress bar ──────────────────────────────
  useEffect(() => {
    if (phase !== "boot") return;
    let lineIdx = 0;
    const total = BOOT_LINES.length;

    const addLine = () => {
      if (lineIdx >= total) {
        // All lines shown — jump to greet phase
        setTimeout(() => { setBurst(true); setPhase("greet"); }, 300);
        return;
      }
      const line = BOOT_LINES[lineIdx];
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        setProgress(Math.round(((lineIdx + 1) / total) * 100));
        lineIdx++;
        addLine();
      }, line.delay + 100);
    };
    addLine();
  }, [phase]);

  // ── GREET phase: cycle greetings ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "greet") return;
    if (greetIdx < GREETINGS.length - 1) {
      const id = setInterval(() => setGreetIdx(i => i + 1), 200);
      return () => clearInterval(id);
    } else {
      // Last greeting — hold then exit
      const t = setTimeout(() => setVisible(false), 900);
      return () => clearTimeout(t);
    }
  }, [phase, greetIdx]);

  const currentGreet = GREETINGS[greetIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .intro-root {
          position:fixed; inset:0; z-index:9999;
          background:#050810; color:#fff; overflow:hidden;
          display:flex; align-items:center; justify-content:center;
          font-family:'DM Sans',sans-serif;
        }

        /* Grid */
        .intro-root::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; pointer-events:none;
        }

        /* Scan line */
        .intro-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.2),transparent);
          animation:intro-scan 5s linear infinite; pointer-events:none; z-index:3;
        }
        @keyframes intro-scan { from{top:0} to{top:100%} }

        /* CRT scanlines overlay */
        .intro-crt {
          position:absolute; inset:0; pointer-events:none; z-index:2;
          backgroundImage: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px);
        }

        /* Glitch greeting */
        .intro-glitch { color:#fff; }
        .intro-glitch::before,
        .intro-glitch::after {
          content:attr(data-text);
          position:absolute; top:0; left:0;
          width:100%; background:transparent;
        }
        .intro-glitch::before {
          color:#38bdf8; clip-path:polygon(0 25%,100% 25%,100% 45%,0 45%);
          animation:ig-top 2.5s infinite linear; text-shadow:-2px 0 #38bdf8;
        }
        .intro-glitch::after {
          color:#a78bfa; clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);
          animation:ig-bot 2s infinite linear; text-shadow:2px 0 #a78bfa;
        }
        @keyframes ig-top {
          0%,88%,100%{transform:translateX(0)} 90%{transform:translateX(-4px)} 95%{transform:translateX(4px)}
        }
        @keyframes ig-bot {
          0%,82%,100%{transform:translateX(0)} 84%{transform:translateX(4px)} 90%{transform:translateX(-4px)}
        }

        /* Boot log line reveal */
        .boot-line {
          overflow:hidden; white-space:nowrap;
          animation:boot-reveal 0.25s ease forwards;
        }
        @keyframes boot-reveal {
          from { max-width:0; opacity:0; }
          to   { max-width:100%; opacity:1; }
        }

        /* Greeting lang label */
        .greet-lang {
          font-family:'JetBrains Mono',monospace;
          font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase;
          color:rgba(255,255,255,0.3);
        }
      `}</style>

      <AnimatePresence onExitComplete={onFinish}>
        {visible && (
          <motion.div
            className="intro-root"
            exit={{ y:"-100%", transition:{ duration:1.4, ease:[0.22,1,0.36,1] } }}
          >
            {/* Decorations */}
            <div className="intro-scan" />
            <div className="intro-crt" />
            <HudCorners />
            <ParticleBurst trigger={burst} />

            {/* Top accent line */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.7),rgba(56,189,248,0.7),transparent)", zIndex:4 }} />
            {/* Bottom accent line */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)", zIndex:4 }} />

            {/* HUD top-left */}
            <div style={{ position:"absolute", top:"1.2rem", left:"1.5rem", zIndex:10, fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(52,211,153,0.5)" }}>
              {hudBlink ? "● SYS:BOOT" : "○ SYS:BOOT"} · v2.4.1
            </div>
            {/* HUD top-right */}
            <div style={{ position:"absolute", top:"1.2rem", right:"1.5rem", zIndex:10, fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", textAlign:"right" }}>
              UJWAL.SHET · CLOUD.ENG
            </div>

            {/* Radar (bottom-left) */}
            <div style={{ position:"absolute", bottom:"1.5rem", left:"1.5rem", zIndex:5, opacity:0.7 }}>
              <RadarCanvas size={120} />
            </div>

            {/* Ambient glows */}
            <div style={{ position:"absolute", top:"15%", left:"-5%", width:"400px", height:"400px", borderRadius:"50%", background:"#a78bfa", opacity:0.05, filter:"blur(100px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"10%", right:"-5%", width:"400px", height:"400px", borderRadius:"50%", background:"#38bdf8", opacity:0.04, filter:"blur(100px)", pointerEvents:"none" }} />

            {/* ── BOOT PHASE ── */}
            {phase === "boot" && (
              <motion.div
                key="boot"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.3 }}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem", zIndex:10 }}
              >
                {/* Logo / title */}
                <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(1.4rem,3vw,2rem)", color:"rgba(255,255,255,0.9)", letterSpacing:"0.06em" }}>
                    CLOUD SOLUTIONS
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"rgba(52,211,153,0.6)", letterSpacing:"0.22em", textTransform:"uppercase", marginTop:"4px" }}>
                    AWS Cloud Engineer Portfolio
                  </div>
                </div>

                {/* Boot log */}
                <div style={{
                  width:"min(440px,90vw)",
                  background:"rgba(0,0,0,0.5)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"12px", overflow:"hidden",
                }}>
                  {/* Terminal bar */}
                  <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.5rem 0.85rem", background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => (
                      <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />
                    ))}
                    <span style={{ marginLeft:"0.5rem", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.06em" }}>
                      boot.sh — portfolio
                    </span>
                  </div>
                  <div style={{ padding:"0.85rem 1rem", minHeight:"120px" }}>
                    {bootLines.map((line, i) => (
                      <div key={i} className="boot-line" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.7rem", color:line.color, lineHeight:1.9, letterSpacing:"0.04em" }}>
                        <span style={{ color:"rgba(52,211,153,0.4)", marginRight:"0.5rem" }}>$</span>
                        {line.text}
                      </div>
                    ))}
                    {bootLines.length < BOOT_LINES.length && (
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.7rem", color:"rgba(52,211,153,0.6)" }}>
                        <span style={{ color:"rgba(52,211,153,0.4)", marginRight:"0.5rem" }}>$</span>
                        <span style={{ display:"inline-block", width:8, height:"0.85em", background:"rgba(52,211,153,0.6)", verticalAlign:"middle", animation:"cur-blink 0.8s step-end infinite" }} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <BootProgress progress={progress} />
              </motion.div>
            )}

            {/* ── GREET PHASE ── */}
            {phase === "greet" && (
              <motion.div
                key="greet"
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                transition={{ duration:0.35 }}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem", zIndex:10 }}
              >
                {/* Language label */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={greetIdx + "lang"}
                    className="greet-lang"
                    initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:8 }}
                    transition={{ duration:0.1 }}
                  >
                    {currentGreet.lang}
                  </motion.span>
                </AnimatePresence>

                {/* Main greeting */}
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={greetIdx}
                    initial={{ opacity:0, y:28, scale:0.94 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-28, scale:1.04 }}
                    transition={{ duration:0.12, ease:"easeOut" }}
                    style={{
                      fontFamily:"'Syne',sans-serif", fontWeight:800,
                      fontSize:"clamp(3.5rem,10vw,8rem)",
                      lineHeight:1, letterSpacing:"-0.03em",
                      margin:0, textAlign:"center",
                    }}
                  >
                    <GlitchGreeting text={currentGreet.text} />
                  </motion.h1>
                </AnimatePresence>

                {/* Accent line */}
                <motion.div
                  key={greetIdx + "line"}
                  initial={{ width:0 }} animate={{ width:"80px" }}
                  transition={{ duration:0.15 }}
                  style={{ height:2, background:"linear-gradient(90deg,#a78bfa,#38bdf8)", borderRadius:2, boxShadow:"0 0 10px rgba(167,139,250,0.6)" }}
                />

                {/* Dot progress */}
                <div style={{ display:"flex", gap:"0.35rem", marginTop:"0.25rem" }}>
                  {GREETINGS.map((_, i) => (
                    <div key={i} style={{
                      width: i === greetIdx ? 20 : 6, height:4, borderRadius:99,
                      background: i <= greetIdx ? "linear-gradient(90deg,#a78bfa,#38bdf8)" : "rgba(255,255,255,0.12)",
                      transition:"all 0.2s ease",
                      boxShadow: i === greetIdx ? "0 0 8px rgba(167,139,250,0.6)" : "none",
                    }} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bottom right: skip hint */}
            <div style={{ position:"absolute", bottom:"1.5rem", right:"1.5rem", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.15)", zIndex:10 }}>
              Loading experience...
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes cur-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}