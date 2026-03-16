import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import P from "../assets/P.png";

function useTyping(lines, speed = 45) {
  const [displayed, setDisplayed] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (lineIdx >= lines.length) { setDone (true); return; }
    if (charIdx <= lines[lineIdx].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIdx] = lines[lineIdx].slice(0, charIdx);
          return next;
        });
        setCharIdx(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 300);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, lines, speed]);

  return { displayed, done };
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 1.5,
      color: ["#a78bfa","#38bdf8","#34d399"][Math.floor(Math.random()*3)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250,${0.12 * (1 - dist/120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.6 }} />;
}


function Counter({ to, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.floor(eased * to));
          if (progress < 1) requestAnimationFrame(tick);
          else setVal(to);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const skills = [
  { name: "AWS EC2",      color: "#fb923c" },
  { name: "VPC",          color: "#a78bfa" },
  { name: "IAM",          color: "#38bdf8" },
  { name: "S3",           color: "#34d399" },
  { name: "Lambda",       color: "#f472b6" },
  { name: "CloudWatch",   color: "#facc15" },
  { name: "SSM",          color: "#a78bfa" },
  { name: "SNS",          color: "#38bdf8" },
  { name: "Terraform",    color: "#34d399" },
  { name: "DevOps",       color: "#fb923c" },
  { name: "Linux",        color: "#f472b6" },
  { name: "Monitoring",   color: "#facc15" },
];


const TERMINAL_LINES = [
  "$ whoami",
  "> Ujwal Shet — AWS Cloud Engineer",
  "$ cat skills.txt",
  "> EC2 · VPC · IAM · S3 · Lambda · CloudWatch",
  "$ uptime",
  "> 2+ years building scalable cloud infrastructure",
  "$ status",
  "> ✓ Available for new opportunities",
];


export default function About() {
  
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 280, damping: 22 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 280, damping: 22 });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  // Terminal
  const { displayed, done } = useTyping(TERMINAL_LINES, 42);
  const [termOpen, setTermOpen] = useState(true);

  // Active tab
  const [tab, setTab] = useState("about");

  const tabs = [
    { id: "about",    label: "about.md" },
    { id: "skills",   label: "skills.json" },
    { id: "personal", label: "personal.log" },
  ];

  const tabContent = {
    about: (
      <div style={{ color:"rgba(255,255,255,0.65)", lineHeight:1.9, fontSize:"0.9rem" }}>
        <p>I design and build <span style={{ color:"#38bdf8", fontWeight:600 }}>scalable, secure cloud infrastructure</span> on AWS. My work focuses on cloud architecture, automation, and infrastructure reliability using services like EC2, VPC, IAM, S3, Lambda, and CloudWatch.</p>
        <p style={{ marginTop:"0.9rem" }}>I develop cloud solutions that improve performance, optimize costs, and ensure <span style={{ color:"#34d399", fontWeight:600 }}>high availability</span> while following best practices in cloud security and DevOps.</p>
      </div>
    ),
    skills: (
      <div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem" }}>
          {skills.map((s, i) => (
            <motion.span
              key={s.name}
              initial={{ opacity:0, scale:0.7 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: i * 0.05, type:"spring", stiffness:300 }}
              style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem",
                letterSpacing:"0.08em", textTransform:"uppercase",
                padding:"4px 12px", borderRadius:"99px",
                border:`1px solid ${s.color}`,
                color: s.color,
                background: `${s.color}15`,
                boxShadow: `0 0 10px ${s.color}30`,
                cursor:"default",
              }}
              whileHover={{ scale:1.1, boxShadow:`0 0 18px ${s.color}70` }}
            >
              {s.name}
            </motion.span>
          ))}
        </div>
      </div>
    ),
    personal: (
      <div style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.9, fontSize:"0.88rem" }}>
        {[
          { icon:"🎮", text: "Grinding ranked in Valorant" },
          { icon:"🏏", text: "Die-hard cricket fan" },
          { icon:"🍳", text: "Amateur chef experimenting in the kitchen" },
          { icon:"✈️", text: "Wanderlust — always planning the next trip" },
          { icon:"📚", text: "Continuous learner in cloud & DevOps" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity:0, x:-16 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.08 }}
            style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}
          >
            <span style={{ fontSize:"1.1rem" }}>{item.icon}</span>
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .about-root {
          min-height: 100vh; width: 100%;
          display: flex; align-items: center; justify-content: center;
          background: #050810; color: #fff;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Grid */
        .about-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Avatar card ── */
        .avatar-wrap {
          position: relative;
          width: 200px; height: 200px;
          flex-shrink: 0;
        }
        .avatar-ring {
          position: absolute; inset: -10px;
          border-radius: 50%;
          border: 1px dashed rgba(167,139,250,0.35);
          animation: about-spin 14s linear infinite;
        }
        .avatar-ring-2 {
          position: absolute; inset: -20px;
          border-radius: 50%;
          border: 1px dashed rgba(56,189,248,0.2);
          animation: about-spin 22s linear infinite reverse;
        }
        @keyframes about-spin { to { transform: rotate(360deg); } }

        .avatar-dot {
          position: absolute;
          width: 8px; height: 8px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 10px #a78bfa;
          top: -4px; left: 50%; transform: translateX(-50%);
        }

        .avatar-img-wrap {
          width: 200px; height: 200px;
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(135deg, rgba(167,139,250,0.15), rgba(56,189,248,0.08));
          box-shadow: 0 0 60px rgba(167,139,250,0.15), 0 32px 64px rgba(0,0,0,0.6);
          position: relative;
        }
        .avatar-img-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%);
          border-radius: inherit;
          pointer-events: none;
        }
        .avatar-status {
          position: absolute; bottom: -4px; right: -4px;
          background: #050810; border-radius: 99px;
          padding: 3px 10px 3px 8px;
          display: flex; align-items: center; gap: 5px;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
        }
        .avatar-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          animation: about-pulse 2s ease infinite;
        }
        @keyframes about-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(0.85); }
        }

        /* ── Name / title ── */
        .about-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          line-height: 1;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .about-role-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 5px 14px; border-radius: 99px;
          background: rgba(56,189,248,0.1);
          border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8;
          font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; margin-top: 0.6rem;
        }

        /* ── Stats ── */
        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 1rem 1.25rem;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--sc); 
          box-shadow: 0 0 30px -8px var(--sc);
        }
        .stat-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, var(--sc), transparent);
          opacity: 0.5;
        }
        .stat-num {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.6rem; line-height: 1;
          color: var(--sc);
          text-shadow: 0 0 20px var(--sc);
        }
        .stat-label {
          font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-top: 0.25rem;
        }

        /* ── Tab panel ── */
        .tab-bar {
          display: flex; gap: 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.25rem;
        }
        .tab-btn {
          padding: 0.6rem 1rem;
          font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
          color: rgba(255,255,255,0.38); cursor: pointer;
          border: none; background: none;
          border-bottom: 2px solid transparent;
          transition: color 0.25s, border-color 0.25s;
          margin-bottom: -1px;
          letter-spacing: 0.03em;
        }
        .tab-btn:hover { color: rgba(255,255,255,0.7); }
        .tab-btn.active { color: #a78bfa; border-bottom-color: #a78bfa; }

        /* ── Terminal ── */
        .terminal {
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }
        .terminal-bar {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .t-dot { width:10px; height:10px; border-radius:50%; }
        .terminal-body {
          padding: 1rem 1.25rem;
          font-size: 0.78rem; line-height: 2;
          min-height: 160px;
          overflow: hidden;
        }
        .t-line-cmd { color: #38bdf8; }
        .t-line-out { color: rgba(255,255,255,0.6); padding-left: 0.5rem; }
        .t-cursor {
          display: inline-block; width: 8px; height: 1em;
          background: #a78bfa; margin-left: 2px; vertical-align: middle;
          animation: t-blink 1s step-end infinite;
        }
        @keyframes t-blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── CTA buttons ── */
        .cta-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 10px;
          background: linear-gradient(135deg, #a78bfa, #38bdf8);
          color: #000; font-weight: 700; font-size: 0.85rem;
          letter-spacing: 0.04em; text-decoration: none;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .cta-primary:hover {
          box-shadow: 0 0 30px rgba(167,139,250,0.5);
          transform: translateY(-2px);
        }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8); font-size: 0.85rem;
          letter-spacing: 0.04em; text-decoration: none;
          transition: border-color 0.3s, background 0.3s, transform 0.2s;
        }
        .cta-secondary:hover {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        /* ── Scan line ── */
        .about-scan {
          position: absolute; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: about-scanv 10s linear infinite; pointer-events:none;
        }
        @keyframes about-scanv { from{top:0} to{top:100%} }
      `}</style>

      <section id="about" className="about-root">
        <ParticleField />
        <div className="about-scan" />

        {/* Ambient glows */}
        {[
          { color:"#a78bfa", style:{ top:"5%", left:"-8%", width:"420px", height:"420px", opacity:0.06 } },
          { color:"#38bdf8", style:{ bottom:"5%", right:"-8%", width:"420px", height:"420px", opacity:0.05 } },
          { color:"#34d399", style:{ top:"50%", left:"45%", width:"300px", height:"300px", opacity:0.04 } },
        ].map((g, i) => (
          <div key={i} style={{ position:"absolute", borderRadius:"50%", background:g.color, filter:"blur(90px)", pointerEvents:"none", ...g.style }} />
        ))}

        <div style={{ position:"relative", zIndex:10, maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"5rem 1.5rem" }}>

          {/* ── TOP ROW: avatar + name + stats ── */}
          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7 }}
            style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:"2.5rem", marginBottom:"3rem" }}
          >
            {/* Avatar */}
            <div className="avatar-wrap">
              <div className="avatar-ring"><div className="avatar-dot" /></div>
              <div className="avatar-ring-2" />
              <motion.div
                className="avatar-img-wrap"
                style={{ rotateX: rotX, rotateY: rotY, transformStyle:"preserve-3d" }}
                onMouseMove={handleMove} onMouseLeave={handleLeave}
              >
                <img src={P} alt="Ujwal Shet" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </motion.div>
              <div className="avatar-status">
                <div className="avatar-status-dot" />
                Available
              </div>
            </div>

            {/* Name + role */}
            <div style={{ flex:1, minWidth:"220px" }}>
              <motion.p
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:0.1 }}
                style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.66rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:"0.4rem" }}
              >
                Cloud Engineer
              </motion.p>
              <h2 className="about-name">Ujwal Shet</h2>
              <div className="about-role-badge">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#38bdf8", boxShadow:"0 0 8px #38bdf8", display:"inline-block" }} />
                AWS Cloud Engineer
              </div>

              {/* Stats row */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", marginTop:"1.5rem" }}>
                {[
                  { num:2, suffix:"+", label:"Years Exp", color:"#a78bfa" },
                  { num:8, suffix:"",  label:"Certs", color:"#38bdf8" },
                  { num:10, suffix:"+", label:"AWS Services", color:"#34d399" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="stat-card"
                    style={{ "--sc": s.color, minWidth:"100px" }}
                    initial={{ opacity:0, y:16 }}
                    whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    whileHover={{ y:-3 }}
                  >
                    <div className="stat-num"><Counter to={s.num} suffix={s.suffix} /></div>
                    <div className="stat-label">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── BOTTOM ROW: tabs panel + terminal ── */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"1.5rem", alignItems:"flex-start" }}>

            {/* Left: tab panel */}
            <motion.div
              initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}
              style={{
                flex:"1 1 340px",
                background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"16px", padding:"1.5rem",
                position:"relative", overflow:"hidden",
              }}
            >
              {/* Top border glow */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent)" }} />

              <div className="tab-bar">
                {tabs.map(t => (
                  <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity:0, y:8 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.25 }}
                >
                  {tabContent[tab]}
                </motion.div>
              </AnimatePresence>

              {/* CTA buttons */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", marginTop:"1.5rem" }}>
                <a href="#projects" className="cta-primary">View Projects →</a>
                <a href="#contact" className="cta-secondary">Get in Touch</a>
              </div>
            </motion.div>

            {/* Right: terminal */}
            <motion.div
              initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
              style={{ flex:"1 1 300px" }}
            >
              <div className="terminal">
                <div className="terminal-bar">
                  <div className="t-dot" style={{ background:"#ff5f57" }} />
                  <div className="t-dot" style={{ background:"#febc2e" }} />
                  <div className="t-dot" style={{ background:"#28c840" }} />
                  <span style={{ marginLeft:"0.5rem", fontSize:"0.65rem", color:"rgba(255,255,255,0.3)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.05em" }}>
                    ujwal@cloud ~ bash
                  </span>
                </div>
                <div className="terminal-body">
                  {TERMINAL_LINES.map((line, i) => {
                    if (displayed[i] === undefined) return null;
                    const isCmd = line.startsWith("$");
                    return (
                      <div key={i} className={isCmd ? "t-line-cmd" : "t-line-out"}>
                        {displayed[i]}
                        {i === (displayed.length - 1) && !done && <span className="t-cursor" />}
                      </div>
                    );
                  })}
                  {done && <div className="t-line-cmd">$ <span className="t-cursor" /></div>}
                </div>
              </div>

              {/* Location / social strip */}
              <motion.div
                initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true }} transition={{ delay:0.4 }}
                style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", marginTop:"1rem", alignItems:"center" }}
              >
                {[
                  { icon:"📍", text:"India" },
                  { icon:"☁️", text:"AWS Certified" },
                  { icon:"🚀", text:"Open to Work" },
                ].map((b, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:"0.4rem",
                    padding:"4px 12px", borderRadius:"99px",
                    background:"rgba(255,255,255,0.04)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    fontSize:"0.72rem", color:"rgba(255,255,255,0.5)",
                    fontFamily:"'DM Sans',sans-serif",
                  }}>
                    <span>{b.icon}</span><span>{b.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
