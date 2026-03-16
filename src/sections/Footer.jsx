import { FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const socials = [
  { Icon: FaYoutube,  label: "YouTube",  href: "https://www.youtube.com/@Ujwalplays18",          accent: "#f472b6" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ujwal-shet-118318202/", accent: "#38bdf8" },
  { Icon: FaGithub,   label: "GitHub",   href: "https://github.com/ujwalshet",                    accent: "#a78bfa" },
];

const NAV_LINKS = [
  { label:"Home",           href:"#home" },
  { label:"About",          href:"#about" },
  { label:"Experience",     href:"#experience" },
  { label:"Projects",       href:"#projects" },
  { label:"Certifications", href:"#certifications" },
  { label:"Contact",        href:"#contact" },
];

// ── Shooting stars canvas ─────────────────────────────────────────────────────
function ShootingStars() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let id;

    const COLORS = ["#a78bfa","#38bdf8","#34d399","#fff"];

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H * 0.6;
        this.len = 60 + Math.random() * 80;
        this.speed = 3 + Math.random() * 5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        this.alpha = 0;
        this.alphaDir = 1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.delay = Math.random() * 120;
      }
      update() {
        if (this.delay > 0) { this.delay--; return; }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha = Math.min(1, this.alpha + 0.08 * this.alphaDir);
        if (this.alpha >= 1) this.alphaDir = -0.04;
        if (this.x > W + 50 || this.y > H + 50 || this.alpha <= 0) this.reset();
      }
      draw() {
        if (this.delay > 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.7;
        const grad = ctx.createLinearGradient(
          this.x, this.y,
          this.x - Math.cos(this.angle) * this.len,
          this.y - Math.sin(this.angle) * this.len
        );
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }
    }

    const stars = Array.from({ length: 8 }, () => new Star());

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => { s.update(); s.draw(); });
      id = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
    />
  );
}

// ── Glitch name ───────────────────────────────────────────────────────────────
function GlitchName() {
  return (
    <span className="footer-glitch" data-text="UJWAL SHET">
      UJWAL SHET
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Footer() {
  const [hudBlink, setHudBlink] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    const id = setInterval(() => setHudBlink(v => !v), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&family=JetBrains+Mono:wght@400;500&display=swap');

        .footer-root {
          background: #050810; color: #fff;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Grid */
        .footer-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size: 60px 60px; pointer-events: none; z-index:0;
        }

        /* Glitch name */
        .footer-glitch {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(3rem, 8vw, 8rem);
          letter-spacing: -0.03em; line-height: 1;
          color: #fff; position: relative; display: inline-block;
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
        }
        .footer-glitch::before,
        .footer-glitch::after {
          content: attr(data-text);
          position: absolute; top:0; left:0;
          width:100%; background:transparent;
          font-family: 'Syne', sans-serif; font-weight: 800;
        }
        .footer-glitch::before {
          color: #38bdf8;
          clip-path: polygon(0 20%,100% 20%,100% 40%,0 40%);
          animation: fg-top 5s infinite linear;
          text-shadow: -2px 0 #38bdf8;
        }
        .footer-glitch::after {
          color: #a78bfa;
          clip-path: polygon(0 65%,100% 65%,100% 80%,0 80%);
          animation: fg-bot 4s infinite linear;
          text-shadow: 2px 0 #a78bfa;
        }
        @keyframes fg-top {
          0%,88%,100%{transform:translateX(0)} 90%{transform:translateX(-4px)} 95%{transform:translateX(4px)}
        }
        @keyframes fg-bot {
          0%,82%,100%{transform:translateX(0)} 84%{transform:translateX(4px)} 92%{transform:translateX(-3px)}
        }

        /* Nav links */
        .footer-nav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); text-decoration: none;
          transition: color 0.25s;
          position: relative;
        }
        .footer-nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left:0; right:0; height:1px;
          background: linear-gradient(90deg, #a78bfa, #38bdf8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.25s ease;
        }
        .footer-nav-link:hover { color: #fff; }
        .footer-nav-link:hover::after { transform: scaleX(1); }

        /* Social icon */
        .footer-social {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5); font-size: 1.1rem;
          text-decoration: none;
          transition: background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s;
        }
        .footer-social:hover {
          color: #fff;
          border-color: var(--sc);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 20px -4px var(--sc);
          transform: translateY(-4px);
        }

        /* Divider */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        /* Quote */
        .footer-quote {
          font-family: 'DM Sans', sans-serif;
          font-style: italic; font-weight: 300;
          font-size: 0.88rem; color: rgba(255,255,255,0.35);
          text-align: center; max-width: 480px; line-height: 1.8;
          position: relative;
        }
        .footer-quote::before { content: '"'; font-size:1.6rem; color:rgba(167,139,250,0.4); line-height:0; vertical-align:-0.4em; margin-right:0.2rem; }
        .footer-quote::after  { content: '"'; font-size:1.6rem; color:rgba(167,139,250,0.4); line-height:0; vertical-align:-0.4em; margin-left:0.2rem; }

        /* HUD labels */
        .hud-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.52rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(52,211,153,0.45);
        }

        /* Scan line */
        .footer-scan {
          position: absolute; left:0; right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);
          animation: ft-scan 12s linear infinite; pointer-events:none; z-index:1;
        }
        @keyframes ft-scan { from{top:0} to{top:100%} }
      `}</style>

      <footer className="footer-root">
        <ShootingStars />
        <div className="footer-scan" />

        {/* Top accent line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(56,189,248,0.5),transparent)", zIndex:3 }} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:"500px", height:"300px", borderRadius:"50%", background:"#a78bfa", opacity:0.06, filter:"blur(100px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"500px", height:"300px", borderRadius:"50%", background:"#38bdf8", opacity:0.05, filter:"blur(100px)", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:5, maxWidth:"1200px", margin:"0 auto", padding:"4rem 1.5rem 2.5rem" }}>

          {/* ── TOP: Nav links ── */}
          <motion.div
            initial={{ opacity:0, y:-20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"0.5rem 2rem", marginBottom:"3rem" }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="footer-nav-link"
                initial={{ opacity:0, y:-10 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* ── CENTER: Big glitch name ── */}
          <motion.div
            initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }}
            viewport={{ once:true }} transition={{ duration:0.8 }}
            style={{ textAlign:"center", marginBottom:"2rem" }}
          >
            <GlitchName />

            {/* Gradient underline */}
            <motion.div
              initial={{ width:0 }} whileInView={{ width:"160px" }}
              viewport={{ once:true }} transition={{ duration:0.8, delay:0.3 }}
              style={{ height:3, background:"linear-gradient(90deg,#a78bfa,#38bdf8,#34d399)", borderRadius:3, margin:"1rem auto 0", boxShadow:"0 0 12px rgba(167,139,250,0.5)" }}
            />

            {/* Role subtitle */}
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginTop:"0.75rem" }}>
              AWS Cloud Engineer · DevOps · Infrastructure
            </p>
          </motion.div>

          {/* ── QUOTE ── */}
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ duration:0.7, delay:0.2 }}
            style={{ display:"flex", justifyContent:"center", marginBottom:"2.5rem" }}
          >
            <p className="footer-quote">
              Success is when preparation meets opportunity. Don't wait for it, create it.
            </p>
          </motion.div>

          {/* ── Divider ── */}
          <div className="footer-divider" style={{ marginBottom:"2rem" }} />

          {/* ── BOTTOM ROW ── */}
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"1.25rem" }}>

            {/* Left: HUD status */}
            <div>
              <div className="hud-label" style={{ marginBottom:2 }}>
                {hudBlink ? "● SYS:ONLINE" : "○ SYS:ONLINE"} · {new Date().getFullYear()}
              </div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.52rem", letterSpacing:"0.12em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>
                © {year} Ujwal Shet · All Rights Reserved
              </p>
            </div>

            {/* Center: Social icons */}
            <div style={{ display:"flex", gap:"0.6rem", alignItems:"center" }}>
              {socials.map(({ Icon, label, href, accent }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social"
                  style={{ "--sc": accent }}
                  initial={{ opacity:0, y:10 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>

            {/* Right: Back to top */}
            <motion.a
              href="#home"
              whileHover={{ y:-3, boxShadow:"0 0 20px rgba(167,139,250,0.4)" }}
              style={{
                display:"inline-flex", alignItems:"center", gap:"0.4rem",
                padding:"0.45rem 1.1rem", borderRadius:"8px",
                background:"rgba(167,139,250,0.08)",
                border:"1px solid rgba(167,139,250,0.25)",
                color:"rgba(167,139,250,0.8)",
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase",
                textDecoration:"none",
                transition:"all 0.25s",
              }}
            >
              ↑ Back to Top
            </motion.a>
          </div>

          {/* Bottom HUD strip */}
          <div style={{ display:"flex", justifyContent:"center", marginTop:"1.5rem" }}>
            <div style={{ display:"flex", gap:"1.5rem", alignItems:"center" }}>
              {[
                { dot:"#a78bfa", text:"Built with React" },
                { dot:"#38bdf8", text:"Framer Motion" },
                { dot:"#34d399", text:"Tailwind CSS" },
                { dot:"#fb923c", text:"EmailJS" },
              ].map(item => (
                <div key={item.text} style={{ display:"flex", alignItems:"center", gap:"0.35rem" }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:item.dot, boxShadow:`0 0 6px ${item.dot}` }} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom accent line */}
        <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)" }} />
      </footer>
    </>
  );
}