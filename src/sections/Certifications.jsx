import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";

import pic01 from "../assets/pic01.png";
import pic02 from "../assets/pic02.png";
import pic03 from "../assets/pic03.png";
import pic04 from "../assets/pic04.png";
import pic05 from "../assets/pic05.png";
import pic06 from "../assets/pic06.png";
import pic07 from "../assets/pic07.png";
import pic08 from "../assets/pic08.png";

const certifications = [pic01, pic02, pic03, pic04, pic05, pic06, pic07, pic08];

// Split into two rows for opposing marquees
const row1 = certifications.slice(0, 4);
const row2 = certifications.slice(4, 8);

// Duplicate 4x for seamless loop
const makeLoop = (arr) => [...arr, ...arr, ...arr, ...arr];

function CertCard({ src, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [12, -12]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-12, 12]), { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0); y.set(0); setHovered(false);
  };

  // Cycle accent colors per card
  const accents = ["#a78bfa", "#38bdf8", "#34d399", "#fb923c", "#f472b6", "#facc15", "#a78bfa", "#38bdf8"];
  const accent = accents[index % accents.length];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      whileHover={{ scale: 1.18, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="cert-card"
      data-accent={accent}
      // inline style for accent since CSS var doesn't work with data attrs easily
      style={{
        "--accent": accent,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow border */}
      <div className="cert-card-glow" />

      {/* Scan line on hover */}
      {hovered && <div className="cert-scan" />}

      {/* Corner decorations */}
      <div className="cert-corner cert-corner-tl" />
      <div className="cert-corner cert-corner-tr" />
      <div className="cert-corner cert-corner-bl" />
      <div className="cert-corner cert-corner-br" />

      <img
        src={src}
        alt="certification"
        className="cert-img"
        draggable={false}
      />

      {/* Reflection sheen */}
      <div className="cert-sheen" />
    </motion.div>
  );
}

function MarqueeRow({ items, direction = 1, speed = 35 }) {
  const looped = makeLoop(items);

  return (
    <div className="marquee-track">
      <motion.div
        className="marquee-inner"
        animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
      >
        {looped.map((src, i) => (
          <CertCard key={i} src={src} index={i % items.length} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Certifications() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400&display=swap');

        .cert-section {
          background: #050810;
          position: relative;
          overflow: hidden;
          padding: 6rem 0 7rem;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Background grid ── */
        .cert-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Ambient glows ── */
        .cert-glow-l {
          position: absolute; top: 30%; left: -10%;
          width: 500px; height: 500px; border-radius: 50%;
          background: #a78bfa; opacity: 0.05; filter: blur(100px);
          pointer-events: none;
        }
        .cert-glow-r {
          position: absolute; bottom: 20%; right: -10%;
          width: 500px; height: 500px; border-radius: 50%;
          background: #38bdf8; opacity: 0.05; filter: blur(100px);
          pointer-events: none;
        }
        .cert-glow-c {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 200px; border-radius: 50%;
          background: #34d399; opacity: 0.03; filter: blur(80px);
          pointer-events: none;
        }

        /* ── Heading ── */
        .cert-heading-wrap {
          text-align: center;
          margin-bottom: 4rem;
          position: relative; z-index: 10;
        }
        .cert-label {
          font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 0.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .cert-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2.5rem, 6vw, 5rem);
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em; line-height: 1;
        }
        .cert-subtitle {
          margin-top: 0.75rem;
          font-size: 0.82rem; color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
        }

        /* ── Marquee ── */
        .marquee-track {
          width: 100%; overflow: hidden;
          margin-bottom: 1.5rem;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .marquee-inner {
          display: flex; align-items: center;
          gap: 1.5rem; padding: 1.5rem 0;
          width: max-content;
          will-change: transform;
        }

        /* ── Card ── */
        .cert-card {
          position: relative;
          width: 180px; height: 180px;
          flex-shrink: 0;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .cert-card:hover {
          border-color: var(--accent) !important;
        }

        /* Animated gradient glow border on hover */
        .cert-card-glow {
          position: absolute; inset: -1px;
          border-radius: inherit;
          background: conic-gradient(from 0deg, var(--accent), transparent 40%, var(--accent) 60%, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
          animation: cert-spin-glow 3s linear infinite;
        }
        .cert-card:hover .cert-card-glow { opacity: 0.6; }
        @keyframes cert-spin-glow { to { transform: rotate(360deg); } }

        /* Inner mask so glow only shows as border */
        .cert-card::after {
          content: '';
          position: absolute; inset: 1px;
          border-radius: 15px;
          background: linear-gradient(135deg, #0a0d1a, #07090f);
          z-index: 1;
        }

        /* Corner brackets */
        .cert-corner {
          position: absolute; width: 12px; height: 12px;
          z-index: 3; opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cert-card:hover .cert-corner { opacity: 1; }
        .cert-corner-tl { top: 6px; left: 6px; border-top: 1.5px solid var(--accent); border-left: 1.5px solid var(--accent); }
        .cert-corner-tr { top: 6px; right: 6px; border-top: 1.5px solid var(--accent); border-right: 1.5px solid var(--accent); }
        .cert-corner-bl { bottom: 6px; left: 6px; border-bottom: 1.5px solid var(--accent); border-left: 1.5px solid var(--accent); }
        .cert-corner-br { bottom: 6px; right: 6px; border-bottom: 1.5px solid var(--accent); border-right: 1.5px solid var(--accent); }

        /* Scan line on hover */
        .cert-scan {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          z-index: 4; opacity: 0.7;
          animation: cert-scan 1.2s ease-in-out infinite;
        }
        @keyframes cert-scan { from { top: 0%; } to { top: 100%; } }

        .cert-img {
          position: relative; z-index: 2;
          max-width: 80%; max-height: 80%;
          object-fit: contain;
          transition: filter 0.3s ease, transform 0.3s ease;
          filter: drop-shadow(0 0 0px transparent);
        }
        .cert-card:hover .cert-img {
          filter: drop-shadow(0 0 12px var(--accent));
        }

        /* Sheen */
        .cert-sheen {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%);
          border-radius: inherit;
          pointer-events: none;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .cert-card:hover .cert-sheen { opacity: 1; }

        /* ── Divider line ── */
        .cert-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; margin: 0.5rem 2rem 0.5rem;
          position: relative; z-index: 10;
        }
        .cert-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
        .cert-divider-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        /* ── Count badge ── */
        .cert-count-row {
          display: flex; justify-content: center; gap: 3rem;
          margin-top: 3rem; position: relative; z-index: 10;
        }
        .cert-stat {
          text-align: center;
        }
        .cert-stat-num {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 2rem; line-height: 1;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.5));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cert-stat-label {
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-top: 0.3rem;
        }
        .cert-stat-bar {
          width: 40px; height: 2px; border-radius: 2px; margin: 0.4rem auto 0;
        }
      `}</style>

      <section id="certifications" className="cert-section">
        {/* Ambient glows */}
        <div className="cert-glow-l" />
        <div className="cert-glow-r" />
        <div className="cert-glow-c" />

        {/* Heading */}
        <motion.div
          className="cert-heading-wrap"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="cert-label">AWS & Cloud</p>
          <h2 className="cert-title">CERTIFICATIONS</h2>
          <p className="cert-subtitle">Verified credentials across cloud infrastructure & DevOps</p>
        </motion.div>

        {/* Row 1 — left to right */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MarqueeRow items={row1} direction={1} speed={28} />
        </motion.div>

        {/* Divider */}
        <div className="cert-divider">
          <div className="cert-divider-line" />
          <div className="cert-divider-dot" />
          <div className="cert-divider-dot" />
          <div className="cert-divider-dot" />
          <div className="cert-divider-line" />
        </div>

        {/* Row 2 — right to left */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MarqueeRow items={row2} direction={-1} speed={22} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="cert-count-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { num: "8", label: "Certifications", color: "#a78bfa" },
            { num: "3+", label: "Years Experience", color: "#38bdf8" },
            { num: "100%", label: "AWS Verified", color: "#34d399" },
          ].map((s) => (
            <div className="cert-stat" key={s.label}>
              <div className="cert-stat-num">{s.num}</div>
              <div className="cert-stat-label">{s.label}</div>
              <div className="cert-stat-bar" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}