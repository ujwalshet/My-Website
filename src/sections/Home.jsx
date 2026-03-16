/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa6";
import ParticleBackground from "../components/ParticleBackground";
import AwsLogo from "../components/AwsLogo";

const socials = [
  { Icon: FaYoutube,  label: "YouTube",  href: "https://www.youtube.com/@Ujwalplays18" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ujwal-shet-118318202/" },
  { Icon: FaGithub,   label: "GitHub",   href: "https://github.com/ujwalshet" },
];

const ROLES = ["AWS Cloud Engineer", "Cloud Infrastructure Architect", "DevOps Practitioner", "Server Administration"];

const TERMINAL_SESSION = [
  { prompt:"$", text:"whoami",                                        color:"#38bdf8", pause:600  },
  { prompt:">", text:"Ujwal Shet — AWS Cloud Engineer",               color:"#34d399", pause:400  },
  { prompt:"$", text:"aws ec2 describe-instances --region ap-south-1",color:"#38bdf8", pause:700  },
  { prompt:">", text:"InstanceId: i-0a3f2b1c · State: running ✓",     color:"#a78bfa", pause:400  },
  { prompt:"$", text:"aws s3 ls s3://ujwal-portfolio-assets",         color:"#38bdf8", pause:600  },
  { prompt:">", text:"2024-01-15  about.md  projects/  certs/",       color:"#facc15", pause:400  },
  { prompt:"$", text:"uptime",                                        color:"#38bdf8", pause:500  },
  { prompt:">", text:"3+ years building cloud at scale",              color:"#34d399", pause:400  },
  { prompt:"$", text:"cat status.txt",                                color:"#38bdf8", pause:500  },
  { prompt:">", text:"● Available for opportunities",                 color:"#34d399", pause:800  },
  { prompt:"$", text:"_",                                             color:"#38bdf8", pause:99999},
];

// ── Live terminal ─────────────────────────────────────────────────────────────
function LiveTerminal() {
  const [lines, setLines]   = useState([]);
  const [typing, setTyping] = useState({ lineIdx:0, charIdx:0 });
  const bodyRef             = useRef(null);

  useEffect(() => {
    const { lineIdx, charIdx } = typing;
    if (lineIdx >= TERMINAL_SESSION.length) return;
    const line = TERMINAL_SESSION[lineIdx];
    setLines(prev => {
      if (prev.length <= lineIdx) return [...prev, { ...line, displayed:"" }];
      return prev;
    });
    if (charIdx < line.text.length) {
      const t = setTimeout(() => {
        setLines(prev => {
          const next = [...prev];
          next[lineIdx] = { ...next[lineIdx], displayed: line.text.slice(0, charIdx + 1) };
          return next;
        });
        setTyping(p => ({ ...p, charIdx: p.charIdx + 1 }));
      }, line.prompt === ">" ? 18 : 55);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setTyping({ lineIdx: lineIdx + 1, charIdx: 0 }), line.pause);
      return () => clearTimeout(t);
    }
  }, [typing]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (typing.lineIdx >= TERMINAL_SESSION.length) {
      const t = setTimeout(() => { setLines([]); setTyping({ lineIdx:0, charIdx:0 }); }, 2500);
      return () => clearTimeout(t);
    }
  }, [typing.lineIdx]);

  return (
    <div style={{ background:"rgba(0,0,0,0.72)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", overflow:"hidden", width:"100%", maxWidth:"520px", boxShadow:"0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px -16px rgba(0,0,0,0.9), 0 0 60px -20px rgba(167,139,250,0.2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.6),rgba(56,189,248,0.6),transparent)" }} />
      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.65rem 1rem", background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
        <span style={{ marginLeft:"0.5rem", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em" }}>ujwal@aws-cloud — bash</span>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 8px #34d399", animation:"term-pulse 2s ease infinite" }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", color:"rgba(52,211,153,0.6)", letterSpacing:"0.1em", textTransform:"uppercase" }}>live</span>
        </div>
      </div>
      <div ref={bodyRef} style={{ padding:"1rem 1.25rem", minHeight:"260px", maxHeight:"300px", overflowY:"auto", overflowX:"hidden", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", lineHeight:2, scrollbarWidth:"none" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
            <span style={{ color: line.prompt === "$" ? "rgba(52,211,153,0.7)" : "rgba(255,255,255,0.25)", flexShrink:0 }}>{line.prompt}</span>
            <span style={{ color: line.color || "#fff" }}>
              {line.displayed}
              {i === lines.length - 1 && line.displayed !== line.text && (
                <span style={{ display:"inline-block", width:7, height:"1em", background: line.color || "#fff", opacity:0.8, verticalAlign:"middle", marginLeft:2, animation:"cur-blink 0.8s step-end infinite" }} />
              )}
              {line.text === "_" && line.displayed === "_" && (
                <span style={{ display:"inline-block", width:7, height:"1em", background:"#38bdf8", opacity:0.8, verticalAlign:"middle", marginLeft:2, animation:"cur-blink 0.8s step-end infinite" }} />
              )}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding:"0.45rem 1rem", background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.5rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
        <span>ap-south-1 · aws-cloud</span>
        <span>utf-8 · bash 5.2</span>
      </div>
    </div>
  );
}

// ── Mouse spotlight ───────────────────────────────────────────────────────────
function MouseSpotlight() {
  const [pos, setPos] = useState({ x:-999, y:-999 });
  useEffect(() => {
    const fn = (e) => setPos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, background:`radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(167,139,250,0.06) 0%, transparent 70%)`, transition:"background 0.05s" }} />
  );
}

// ── Glitch text — white name, green + gold strips ─────────────────────────────
function GlitchText({ text, style }) {
  return (
    <span className="glitch-wrap" data-text={text} style={{ position:"relative", display:"inline-block", ...style }}>
      {text}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [hudBlink, setHudBlink] = useState(true);

  useEffect(() => {
    const cur = ROLES[roleIdx];
    const delay = deleting ? 38 : 75;
    const t = setTimeout(() => {
      if (!deleting && charIdx < cur.length)        setCharIdx(c => c + 1);
      else if (!deleting && charIdx === cur.length) setTimeout(() => setDeleting(true), 1400);
      else if (deleting && charIdx > 0)             setCharIdx(c => c - 1);
      else { setDeleting(false); setRoleIdx(i => (i + 1) % ROLES.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, roleIdx, deleting]);

  useEffect(() => {
    const id = setInterval(() => setHudBlink(v => !v), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .home-root {
          width:100%; height:100vh; background:#050810;
          overflow:hidden; position:relative; font-family:'DM Sans',sans-serif;
        }
        .home-root::before {
          content:''; position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; pointer-events:none; z-index:0;
        }

        /* ── Glitch name — white text, GREEN top strip, GOLD bottom strip ── */
        .glitch-wrap {
          color: #fff;
        }

        /* Top strip — Neon Green #00ff87 */
        .glitch-wrap::before {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; background: transparent;
          color: #00ff87;
          text-shadow: -2px 0 #00ff87;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          animation: glitch-top 4s infinite linear;
        }

        /* Bottom strip — Gold #ffd60a */
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; background: transparent;
          color: #ffd60a;
          text-shadow: 2px 0 #ffd60a;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          animation: glitch-bot 3.5s infinite linear;
        }

        @keyframes glitch-top {
          0%,90%,100% { transform:translateX(0);    opacity:1; }
          92%          { transform:translateX(-3px); opacity:0.85; }
          96%          { transform:translateX(3px);  opacity:0.9; }
        }
        @keyframes glitch-bot {
          0%,85%,100% { transform:translateX(0);   opacity:1; }
          87%          { transform:translateX(3px); opacity:0.85; }
          91%          { transform:translateX(-3px);opacity:0.9; }
        }

        /* ── Typewriter cursor ── */
        .type-cursor {
          display:inline-block; width:2px; height:1em;
          background:#38bdf8; margin-left:3px; vertical-align:middle;
          animation:cur-blink 0.9s step-end infinite;
          box-shadow:0 0 8px #38bdf8;
        }
        @keyframes cur-blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── CTAs ── */
        .cta-main {
          padding:0.75rem 2rem; border-radius:10px;
          background:linear-gradient(135deg,#a78bfa,#38bdf8);
          color:#000; font-weight:700; font-size:0.88rem;
          letter-spacing:0.05em; text-decoration:none;
          transition:box-shadow .3s,transform .2s;
          display:inline-flex; align-items:center; gap:0.5rem;
          font-family:'DM Sans',sans-serif;
        }
        .cta-main:hover { box-shadow:0 0 30px rgba(167,139,250,.55); transform:translateY(-2px); }

        .cta-ghost {
          padding:0.75rem 2rem; border-radius:10px;
          border:1px solid rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.05);
          color:rgba(255,255,255,0.8); font-size:0.88rem;
          letter-spacing:0.05em; text-decoration:none;
          transition:border-color .3s,background .3s,transform .2s;
          display:inline-flex; align-items:center; gap:0.5rem;
          font-family:'DM Sans',sans-serif;
        }
        .cta-ghost:hover { border-color:rgba(255,255,255,.35); background:rgba(255,255,255,.1); transform:translateY(-2px); }

        /* ── Socials ── */
        .social-icon { color:rgba(255,255,255,.45); transition:color .25s,filter .25s,transform .25s; font-size:1.3rem; }
        .social-icon:hover { color:#fff; filter:drop-shadow(0 0 8px rgba(167,139,250,.8)); transform:translateY(-3px) scale(1.15); }

        /* ── HUD ── */
        .hud-line { font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.14em; text-transform:uppercase; color:rgba(52,211,153,.5); }

        /* ── Scroll indicator ── */
        .scroll-ind { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:.4rem; z-index:20; }
        .scroll-pill { width:22px; height:36px; border-radius:99px; border:1px solid rgba(255,255,255,.2); display:flex; justify-content:center; padding-top:6px; }
        .scroll-dot { width:4px; height:8px; border-radius:99px; background:rgba(255,255,255,.5); animation:scroll-drop 1.8s ease-in-out infinite; }
        @keyframes scroll-drop { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(14px);opacity:0} }
        @keyframes term-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
      `}</style>

      <section id="home" className="home-root">
        <ParticleBackground />
        <MouseSpotlight />

        {/* Accent lines */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,.5),rgba(56,189,248,.5),transparent)", zIndex:10 }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,.3),transparent)", zIndex:10 }} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"10%", left:"-5%", width:"500px", height:"500px", borderRadius:"50%", background:"#a78bfa", opacity:.06, filter:"blur(110px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"0", right:"5%", width:"500px", height:"500px", borderRadius:"50%", background:"#38bdf8", opacity:.05, filter:"blur(120px)", pointerEvents:"none", zIndex:0 }} />

        {/* HUD */}
        <div style={{ position:"absolute", top:"1.2rem", left:"1.5rem", zIndex:10 }}>
          <div className="hud-line">{hudBlink ? "● SYS:ONLINE" : "○ SYS:ONLINE"} · v2.4.1</div>
        </div>
        <div style={{ position:"absolute", top:"1.2rem", right:"1.5rem", zIndex:10, textAlign:"right" }}>
          <div className="hud-line">AWS:ACTIVE · AP-SOUTH-1</div>
        </div>

        {/* Main layout */}
        <div style={{ position:"relative", zIndex:10, height:"100%", maxWidth:"1280px", margin:"0 auto", padding:"0 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"2rem" }}>

          {/* ── LEFT ── */}
          <div style={{ maxWidth:"520px", flex:"0 0 auto" }}>

            {/* Role badge */}
            <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} style={{ marginBottom:"1.25rem" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"0.5rem",
                padding:"5px 14px", borderRadius:"99px",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.08)",
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:"0.68rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.45)",
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 8px #34d399", display:"inline-block" }} />
                {ROLES[roleIdx].substring(0, charIdx)}
                <span className="type-cursor" />
              </div>
            </motion.div>

            {/* Name — white with green + gold glitch strips */}
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:"0.4rem" }}>
                Hello, I'm
              </p>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(3rem,6vw,5.5rem)", lineHeight:0.95, letterSpacing:"-0.03em", margin:0 }}>
                <GlitchText text="Ujwal" />
                <br />
                <GlitchText text="Shet" style={{ color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.6)" }} />
              </h1>
            </motion.div>

            {/* Bio */}
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.7 }}
              style={{ marginTop:"1.5rem", fontSize:"0.9rem", color:"rgba(255,255,255,0.48)", lineHeight:1.85, maxWidth:"420px", fontFamily:"'DM Sans',sans-serif" }}
            >
              Building <span style={{ color:"#38bdf8", fontWeight:500 }}>scalable, secure cloud infrastructure</span> on AWS — EC2, VPC, IAM, Lambda, CloudWatch. Engineering reliability at scale.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7, duration:0.6 }}
              style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", marginTop:"2rem" }}
            >
              <a href="#projects" className="cta-main">View My Work →</a>
              <a href="/Resume.pdf" download className="cta-ghost">My Resume ↓</a>
            </motion.div>

            {/* Socials */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9, duration:0.6 }}
              style={{ display:"flex", gap:"1.25rem", marginTop:"1.75rem", alignItems:"center" }}
            >
              {socials.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-icon">
                  <Icon />
                </a>
              ))}
              <div style={{ width:1, height:18, background:"rgba(255,255,255,0.12)" }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)" }}>
                Connect
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT: Live Terminal ── */}
          <motion.div
            initial={{ opacity:0, x:60, y:10 }} animate={{ opacity:1, x:0, y:0 }}
            transition={{ delay:0.3, duration:0.9 }}
            style={{ flex:"0 0 auto", display:"none", width:"520px" }}
            className="home-terminal-wrap"
          >
            <LiveTerminal />
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginTop:"1rem", justifyContent:"center" }}
            >
              {[
                { label:"EC2",        color:"#fb923c" },
                { label:"Lambda",     color:"#f472b6" },
                { label:"S3",         color:"#facc15" },
                { label:"CloudWatch", color:"#34d399" },
                { label:"IAM",        color:"#38bdf8" },
                { label:"VPC",        color:"#a78bfa" },
              ].map((t, i) => (
                <motion.span key={t.label}
                  initial={{ opacity:0, scale:0.6 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:1.3 + i * 0.07, type:"spring", stiffness:280 }}
                  style={{
                    fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    padding:"3px 10px", borderRadius:"99px",
                    border:`1px solid ${t.color}`,
                    color:t.color, background:`${t.color}12`,
                    boxShadow:`0 0 8px ${t.color}25`,
                  }}
                >
                  {t.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div className="scroll-ind" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}>
          <div className="scroll-pill"><div className="scroll-dot" /></div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.18)" }}>
            Scroll
          </span>
        </motion.div>

      </section>

      <style>{`
        @media(min-width:1024px) { .home-terminal-wrap { display:block !important; } }
      `}</style>
    </>
  );
}