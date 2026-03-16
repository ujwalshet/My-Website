import { useEffect, useMemo, useRef, useState } from "react";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const useIsMobile = (query = "(max-width: 639px)") => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return isMobile;
};

// Accent colors per project — used for glow, number, tag border
const ACCENTS = ["#a78bfa", "#38bdf8", "#fb923c"];

export default function Projects() {
  const isMobile = useIsMobile();
  const sceneRef = useRef(null);

  const projects = useMemo(() => [
    {
      title: "On-Prem to AWS Cloud Migration",
      image: img1,
      accent: ACCENTS[0],
      tags: ["EC2", "VPC", "AWS", "DevOps"],
      description:
        "Migrated on-premises infrastructure to AWS cloud improving scalability, reliability and operational efficiency using EC2, VPC and automated deployment strategies.",
    },
    {
      title: "Automated Patch Management using AWS SSM",
      image: img2,
      accent: ACCENTS[1],
      tags: ["SSM", "Compliance", "Automation", "EC2"],
      description:
        "Built an automated patch management solution using AWS Systems Manager to schedule patching, enforce compliance and maintain secure EC2 environments.",
    },
    {
      title: "AWS Serverless Monitoring",
      image: img3,
      accent: ACCENTS[2],
      tags: ["Lambda", "CloudWatch", "SNS", "Serverless"],
      description:
        "Implemented serverless EC2 monitoring using AWS Lambda, CloudWatch and SNS to detect failures and automatically send real-time alert notifications.",
    },
  ], []);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const thresholds = projects.map((_, i) => (i + 1) / projects.length);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = thresholds.findIndex((t) => v <= t);
    setActiveIndex(idx === -1 ? thresholds.length - 1 : idx);
  });

  const active = projects[activeIndex];

  return (
    <>
      {/* Inject global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

        .proj-root {
          font-family: 'DM Sans', sans-serif;
        }
        .proj-title-font {
          font-family: 'Syne', sans-serif;
        }

        /* Animated grid background */
        .proj-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Noise overlay */
        .proj-noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .proj-card-glow {
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 32px 64px -16px rgba(0,0,0,0.8),
            0 0 80px -20px var(--accent);
          transition: box-shadow 0.5s ease;
        }

        .proj-img-wrapper::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, var(--accent), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .proj-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid var(--accent);
          color: var(--accent);
          opacity: 0.85;
        }

        .proj-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px 3px var(--accent);
          transition: all 0.4s ease;
        }
        .proj-dot.inactive {
          background: rgba(255,255,255,0.15);
          box-shadow: none;
        }

        .proj-number {
          font-family: 'Syne', sans-serif;
          font-size: clamp(5rem, 10vw, 9rem);
          font-weight: 800;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px var(--accent);
          opacity: 0.12;
          position: absolute;
          top: -0.2em;
          left: -0.05em;
          pointer-events: none;
          user-select: none;
        }

        .proj-line {
          width: 40px;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
          box-shadow: 0 0 8px var(--accent);
        }

        /* Progress bar */
        .proj-progress-track {
          width: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .proj-progress-fill {
          width: 100%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          border-radius: 2px;
          transition: height 0.5s ease;
        }
      `}</style>

      <section
        id="projects"
        ref={sceneRef}
        className="proj-root relative text-white proj-noise"
        style={{
          height: `${110 * projects.length}vh`,
          background: "#050810",
        }}
      >
        <div className="proj-grid-bg absolute inset-0 pointer-events-none" />

        {/* Ambient glow blob that follows active accent */}
        <div
          style={{
            position: "fixed",
            top: "30%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: active.accent,
            opacity: 0.06,
            filter: "blur(100px)",
            transition: "background 0.6s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-6 py-12 z-10 relative">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 md:mb-16"
          >
            <p
              className="proj-tag inline-block mb-3"
              style={{ "--accent": "#ffffff55", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }}
            >
              Portfolio
            </p>
            <h2
              className="proj-title-font font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.4))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MY WORK
            </h2>
          </motion.div>

          {/* Main card area */}
          <div className="relative w-full max-w-6xl flex items-stretch gap-6 md:gap-10">

            {/* Left: progress sidebar */}
            <div className="hidden md:flex flex-col items-center gap-4 py-4 min-w-[24px]">
              <div
                className="proj-progress-track flex-1"
                style={{ "--accent": active.accent }}
              >
                <div
                  className="proj-progress-fill"
                  style={{ height: `${((activeIndex + 1) / projects.length) * 100}%` }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {projects.map((p, i) => (
                  <div
                    key={i}
                    className={`proj-dot ${i === activeIndex ? "" : "inactive"}`}
                    style={{ "--accent": p.accent }}
                  />
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 relative">
              {projects.map((project, idx) => (
                <div
                  key={project.title}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeIndex === idx ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {activeIndex === idx && (
                      <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="proj-card-glow rounded-2xl overflow-hidden"
                        style={{
                          "--accent": project.accent,
                          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full`}>

                          {/* Text panel */}
                          <div className="relative flex flex-col justify-center p-8 md:p-12 lg:w-1/2 overflow-hidden">
                            {/* Ghost number */}
                            <span className="proj-number">0{idx + 1}</span>

                            <div className="relative z-10">
                              {/* Index + line */}
                              <div className="flex items-center gap-3 mb-5">
                                <div className="proj-line" style={{ "--accent": project.accent }} />
                                <span
                                  className="proj-title-font font-bold text-sm tracking-widest uppercase"
                                  style={{ color: project.accent }}
                                >
                                  Project {String(idx + 1).padStart(2, "0")}
                                </span>
                              </div>

                              <h3
                                className="proj-title-font font-bold leading-tight mb-4"
                                style={{
                                  fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)",
                                  color: "#fff",
                                }}
                              >
                                {project.title}
                              </h3>

                              <p
                                className="mb-6 leading-relaxed"
                                style={{
                                  fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                                  color: "rgba(255,255,255,0.55)",
                                  maxWidth: "38ch",
                                }}
                              >
                                {project.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="proj-tag"
                                    style={{ "--accent": project.accent }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Image panel */}
                          <div
                            className={`proj-img-wrapper relative overflow-hidden ${isMobile ? "h-56" : "lg:w-1/2 min-h-[360px]"}`}
                            style={{ "--accent": project.accent }}
                          >
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              style={{
                                transition: "transform 0.6s ease",
                              }}
                              loading="lazy"
                            />
                            {/* Gradient fade on left edge for desktop */}
                            {!isMobile && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "linear-gradient(to right, rgba(5,8,16,0.6) 0%, transparent 40%)",
                                }}
                              />
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Spacer so the absolute children have height */}
              <div
                style={{
                  height: isMobile ? "520px" : "420px",
                  pointerEvents: "none",
                }}
              />
            </div>

          </div>

          {/* Bottom scroll hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll to explore &nbsp;↓
          </motion.p>

        </div>
      </section>
    </>
  );
}