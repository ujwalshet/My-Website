import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const experiences = [
  {
    role: "Trainee Intern Engineer",
    company: "Tech Fortune Technology Services",
    duration: "2022",
    accent: "#a78bfa",
    icon: "◈",
    tags: ["AWS Fundamentals", "Networking", "Cloud Infra"],
    description:
      "Trained in AWS fundamentals, networking, and server administration with hands-on exposure to cloud infrastructure, monitoring, and deployment workflows.",
  },
  {
    role: "System Engineer",
    company: "Stratogent Technology Services",
    duration: "2023 – 2024",
    accent: "#38bdf8",
    icon: "◉",
    tags: ["Server Monitoring", "Deployments", "Network Config"],
    description:
      "Ensured system reliability by monitoring servers, troubleshooting infrastructure issues, and assisting with deployments and network configurations.",
  },
  {
    role: "Cloud System Analyst",
    company: "Stratogent | Pinnacle Technology Partners",
    duration: "2024 – Present",
    accent: "#34d399",
    icon: "⬡",
    tags: ["EC2", "Patch Management", "Migration", "Incident Response"],
    description:
      "Handled AWS cloud infrastructure tasks including EC2 monitoring, automated patching, and migrations while supporting performance optimization and incident response.",
  },
];

export default function Experience() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // One sentinel div per card — placed inside the tall scroll wrapper
  const sentinelRefs = useRef([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Use scroll position relative to the wrapper to derive activeIndex
  useEffect(() => {
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      // How far have we scrolled INTO the wrapper?
      // rect.top goes from 0 (just entering) to -(totalHeight - viewportHeight) (end)
      const scrolled = -rect.top;
      const totalScroll = wrapper.offsetHeight - window.innerHeight;
      // progress 0 → 1
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Divide into N equal segments
      const idx = Math.min(
        experiences.length - 1,
        Math.floor(progress * experiences.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400&display=swap');

        .exp-root { font-family: 'DM Sans', sans-serif; background: #050810; }

        .exp-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .exp-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .exp-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition:
            transform      0.6s cubic-bezier(.22,1,.36,1),
            box-shadow     0.6s ease,
            border-color   0.6s ease,
            opacity        0.6s ease,
            filter         0.6s ease;
        }
        .exp-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0; transition: opacity 0.5s ease;
        }
        .exp-card-active {
          border-color: rgba(255,255,255,0.16) !important;
          transform: translateY(-10px) scale(1.025) !important;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.07),
            0 32px 72px -16px rgba(0,0,0,0.95),
            0 0 80px -18px var(--accent) !important;
        }
        .exp-card-active::before { opacity: 0.75; }
        .exp-card-past   { opacity: 0.55; filter: saturate(0.5); transform: scale(0.98); }
        .exp-card-future { opacity: 0.22; filter: saturate(0.1) brightness(0.6); transform: scale(0.96); }

        .exp-node {
          width: 46px; height: 46px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; flex-shrink: 0;
          transition: all 0.5s ease; position: relative;
        }
        .exp-node-ring {
          position: absolute; inset: -7px; border-radius: 50%;
          border: 1px dashed var(--accent); opacity: 0.5;
          animation: exp-spin 8s linear infinite;
        }
        @keyframes exp-spin { to { transform: rotate(360deg); } }

        .exp-connector {
          flex: 1; height: 2px;
          background: rgba(255,255,255,0.07);
          align-self: center; position: relative; overflow: hidden;
        }
        .exp-connector-fill {
          position: absolute; left:0; top:0; bottom:0; border-radius:2px;
          transition: width 0.65s ease;
        }

        .exp-tag {
          font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 2px 9px; border-radius: 99px;
          border: 1px solid var(--tag-c); color: var(--tag-c);
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.4s, color 0.4s;
        }
        .exp-year {
          font-family: 'Syne', sans-serif; font-size: 0.68rem;
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 99px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.45);
        }
        .exp-ghost {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 7rem;
          color: transparent; -webkit-text-stroke: 1px var(--accent);
          opacity: 0.055; position: absolute; bottom: -0.8rem; right: 0.4rem;
          line-height: 1; pointer-events: none; user-select: none;
        }

        .exp-scan {
          position: absolute; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: scan 9s linear infinite; pointer-events: none;
        }
        @keyframes scan { from{top:0} to{top:100%} }

        .exp-vline {
          position: absolute; left:21px; top:0; bottom:0;
          width:2px; background:rgba(255,255,255,0.07); border-radius:2px;
        }
      `}</style>

      <section id="experience" className="exp-root text-white relative">
        <div className="exp-grid-bg absolute inset-0 pointer-events-none" />
        <div className="exp-scan" />
        <div style={{ position:"absolute", top:"20%", left:"-5%", width:"380px", height:"380px", borderRadius:"50%", background:"#a78bfa", opacity:0.04, filter:"blur(90px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"-5%", width:"380px", height:"380px", borderRadius:"50%", background:"#34d399", opacity:0.04, filter:"blur(90px)", pointerEvents:"none" }} />

        {/* ── DESKTOP ── */}
        {!isMobile && (
          // Tall scroll wrapper — sticky panel lives inside
          <div
            ref={wrapperRef}
            style={{ height: `${(experiences.length + 1) * 100}vh`, position: "relative" }}
          >
            {/* Sticky panel — never moves */}
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 1.5rem",
              }}
            >
              <div style={{ width: "100%", maxWidth: "1200px" }}>

                {/* Heading */}
                <div style={{ textAlign:"center", marginBottom:"3rem" }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.66rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:"0.5rem" }}>
                    Career Journey
                  </p>
                  <h2 className="exp-title" style={{ fontSize:"clamp(2.4rem,5.5vw,4.5rem)" }}>
                    EXPERIENCE
                  </h2>
                </div>

                {/* Nodes + connectors */}
                <div style={{ display:"flex", alignItems:"center", marginBottom:"2rem" }}>
                  {experiences.map((exp, idx) => {
                    const lit = activeIndex >= idx;
                    const cur = activeIndex === idx;
                    return (
                      <div key={idx} style={{ display:"flex", alignItems:"center", flex: idx < experiences.length - 1 ? 1 : "0 0 auto" }}>
                        <div
                          className="exp-node"
                          style={{
                            "--accent": exp.accent,
                            background: lit ? `radial-gradient(circle, ${exp.accent}44, ${exp.accent}11)` : "rgba(255,255,255,0.03)",
                            border: `2px solid ${lit ? exp.accent : "rgba(255,255,255,0.1)"}`,
                            color: lit ? exp.accent : "rgba(255,255,255,0.2)",
                            boxShadow: cur ? `0 0 0 5px rgba(255,255,255,0.06), 0 0 28px -4px ${exp.accent}` : "none",
                          }}
                        >
                          {cur && <div className="exp-node-ring" style={{ "--accent": exp.accent }} />}
                          <span>{exp.icon}</span>
                        </div>

                        {idx < experiences.length - 1 && (
                          <div className="exp-connector">
                            <div
                              className="exp-connector-fill"
                              style={{
                                width: activeIndex > idx ? "100%" : "0%",
                                background: `linear-gradient(90deg, ${exp.accent}, ${experiences[idx+1].accent})`,
                                boxShadow: `0 0 8px ${experiences[idx+1].accent}55`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Cards — always all visible */}
                <div style={{ display:"flex", gap:"1.25rem", alignItems:"stretch", minHeight:"290px" }}>
                  {experiences.map((exp, idx) => {
                    const lit = activeIndex >= idx;
                    const cur = activeIndex === idx;
                    const fut = activeIndex < idx;
                    return (
                      <div
                        key={idx}
                        className={`exp-card ${cur ? "exp-card-active" : fut ? "exp-card-future" : "exp-card-past"}`}
                        style={{ "--accent": exp.accent, padding:"1.5rem", flex:1 }}
                      >
                        <span className="exp-ghost">0{idx+1}</span>

                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", position:"relative", zIndex:1 }}>
                          <span className="exp-year">{exp.duration}</span>
                          <span style={{ color:exp.accent, fontSize:"0.62rem", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.12em", textTransform:"uppercase", opacity: lit ? 0.7 : 0.25 }}>
                            0{idx+1} / 0{experiences.length}
                          </span>
                        </div>

                        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, lineHeight:1.2, fontSize:"clamp(0.95rem,1.25vw,1.2rem)", color: cur ? "#fff" : "rgba(255,255,255,0.6)", marginBottom:"0.35rem", position:"relative", zIndex:1 }}>
                          {exp.role}
                        </h3>
                        <p style={{ fontSize:"0.72rem", color:exp.accent, fontFamily:"'DM Sans',sans-serif", marginBottom:"0.85rem", opacity: lit ? 0.85 : 0.35, position:"relative", zIndex:1 }}>
                          {exp.company}
                        </p>
                        <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.45)", lineHeight:1.8, marginBottom:"1.1rem", flexGrow:1, position:"relative", zIndex:1 }}>
                          {exp.description}
                        </p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", position:"relative", zIndex:1 }}>
                          {exp.tags.map(t => (
                            <span key={t} className="exp-tag" style={{ "--tag-c": lit ? exp.accent : "rgba(255,255,255,0.18)" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress indicator */}
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"0.75rem", marginTop:"2rem" }}>
                  {experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: activeIndex === idx ? "28px" : "8px",
                        height: "4px",
                        borderRadius: "99px",
                        background: activeIndex >= idx ? exp.accent : "rgba(255,255,255,0.15)",
                        boxShadow: activeIndex === idx ? `0 0 8px ${exp.accent}` : "none",
                        transition: "all 0.4s ease",
                      }}
                    />
                  ))}
                </div>

                <p style={{ textAlign:"center", marginTop:"0.75rem", fontSize:"0.6rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.16)", fontFamily:"'DM Sans',sans-serif" }}>
                  Scroll to progress timeline &nbsp;↓
                </p>

              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE ── */}
        {isMobile && (
          <div style={{ padding:"5rem 1rem 4rem" }}>
            <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.66rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:"0.5rem" }}>
                Career Journey
              </p>
              <h2 className="exp-title" style={{ fontSize:"2.4rem" }}>EXPERIENCE</h2>
            </div>

            <div style={{ maxWidth:"480px", margin:"0 auto", position:"relative" }}>
              <div className="exp-vline" />
              <div style={{ display:"flex", flexDirection:"column", gap:"1.75rem", paddingLeft:"3rem" }}>
                {experiences.map((exp, idx) => (
                  <motion.div key={idx} style={{ position:"relative" }}
                    initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true, margin:"-50px" }} transition={{ duration:0.5, delay:idx*0.1 }}
                  >
                    <div style={{ position:"absolute", left:"-2.7rem", top:"1.35rem", width:"16px", height:"16px", borderRadius:"50%", background:exp.accent, border:"3px solid #050810", boxShadow:`0 0 14px ${exp.accent}` }} />
                    <div className="exp-card exp-card-active" style={{ "--accent":exp.accent, padding:"1.25rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                        <span className="exp-year">{exp.duration}</span>
                      </div>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.05rem", color:"#fff", marginBottom:"0.3rem" }}>{exp.role}</h3>
                      <p style={{ fontSize:"0.72rem", color:exp.accent, fontFamily:"'DM Sans',sans-serif", marginBottom:"0.6rem", opacity:0.85 }}>{exp.company}</p>
                      <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:"0.75rem" }}>{exp.description}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                        {exp.tags.map(t => <span key={t} className="exp-tag" style={{ "--tag-c":exp.accent }}>{t}</span>)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}