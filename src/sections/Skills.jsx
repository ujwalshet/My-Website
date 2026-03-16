/* eslint-disable react-hooks/purity */
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaAws, FaJava, FaShieldAlt, FaNetworkWired, FaCloud, FaDatabase } from 'react-icons/fa';
import { SiLinux, SiTerraform, SiReact, SiPython, SiDocker, SiMongodb, SiPostgresql, SiAnsible, SiGit, SiKubernetes } from 'react-icons/si';


const SKILL_ROWS = [
  
  [
    { icon: FaAws,          name: "AWS",              accent: "#fb923c", cat: "Cloud" },
    { icon: FaCloud,        name: "EC2 / VPC",        accent: "#fb923c", cat: "Cloud" },
    { icon: FaDatabase,     name: "S3 / Storage",     accent: "#facc15", cat: "Cloud" },
    { icon: SiTerraform,    name: "Terraform",         accent: "#a78bfa", cat: "IaC" },
    { icon: SiDocker,       name: "Docker",            accent: "#38bdf8", cat: "DevOps" },
    { icon: FaNetworkWired, name: "VPC / Networking",  accent: "#34d399", cat: "Cloud" },
    { icon: FaShieldAlt,    name: "IAM / Security",    accent: "#f472b6", cat: "Security" },
    { icon: SiKubernetes,   name: "Kubernetes",        accent: "#38bdf8", cat: "DevOps" },
  ],
  // Row 2 — Dev & OS
  [
    { icon: SiLinux,        name: "Linux",             accent: "#facc15", cat: "OS" },
    { icon: SiPython,       name: "Python",            accent: "#38bdf8", cat: "Dev" },
    { icon: FaJava,         name: "Java",              accent: "#fb923c", cat: "Dev" },
    { icon: SiReact,        name: "React",             accent: "#38bdf8", cat: "Frontend" },
    { icon: SiMongodb,      name: "MongoDB",           accent: "#34d399", cat: "Database" },
    { icon: SiPostgresql,   name: "PostgreSQL",        accent: "#38bdf8", cat: "Database" },
    { icon: SiAnsible,      name: "Ansible",           accent: "#f472b6", cat: "DevOps" },
    { icon: SiGit,          name: "Git",               accent: "#fb923c", cat: "Dev" },
  ],
];


function MarqueeRow({ skills, direction = 1, speed = 55 }) {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(performance.now());
  const dirRef = useRef(direction);
  const [hoveredIdx, setHoveredIdx] = useState(null);


  const items = [...skills, ...skills, ...skills, ...skills];

  useEffect(() => {
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      let next = x.get() + speed * dirRef.current * dt;
      const loop = (trackRef.current?.scrollWidth || 0) / 4;
      if (loop) {
        if (next <= -loop) next += loop;
        if (next >= 0) next -= loop;
      }
      x.set(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, x]);

  useEffect(() => {
    const onWheel = (e) => { dirRef.current = e.deltaY > 0 ? -direction : direction; };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [direction]);

  return (
    <div
      style={{
        width: '100%', overflow: 'hidden', position: 'relative',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <motion.div
        ref={trackRef}
        style={{ x, display: 'flex', gap: '1rem', width: 'max-content', willChange: 'transform', padding: '0.75rem 0' }}
      >
        {items.map((skill, i) => {
          const isHovered = hoveredIdx === i;
          const Icon = skill.icon;

          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ y: -6, scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              style={{
                position: 'relative',
                minWidth: '130px',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                cursor: 'default',
                background: isHovered
                  ? `linear-gradient(135deg, ${skill.accent}18, ${skill.accent}08)`
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: `1px solid ${isHovered ? skill.accent + '55' : 'rgba(255,255,255,0.07)'}`,
                transition: 'background 0.3s, border-color 0.3s',
                boxShadow: isHovered
                  ? `0 0 30px -8px ${skill.accent}, 0 16px 40px -8px rgba(0,0,0,0.6)`
                  : '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top border glow on hover */}
              {isHovered && (
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: `linear-gradient(90deg, transparent, ${skill.accent}, transparent)`,
                    borderRadius: '14px 14px 0 0',
                  }}
                />
              )}

              {/* Category badge */}
              <div style={{
                position: 'absolute', top: '6px', right: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '0.46rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isHovered ? skill.accent : 'rgba(255,255,255,0.18)',
                transition: 'color 0.3s',
              }}>
                {skill.cat}
              </div>

              {/* Icon */}
              <motion.div
                animate={{
                  color: isHovered ? skill.accent : 'rgba(255,255,255,0.5)',
                  filter: isHovered ? `drop-shadow(0 0 12px ${skill.accent})` : 'none',
                }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: '2rem', display: 'flex' }}
              >
                <Icon />
              </motion.div>

              {/* Name */}
              <span style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '0.72rem', letterSpacing: '0.03em',
                color: isHovered ? '#fff' : 'rgba(255,255,255,0.45)',
                textAlign: 'center', lineHeight: 1.3,
                transition: 'color 0.3s',
                fontWeight: isHovered ? 500 : 400,
              }}>
                {skill.name}
              </span>

              {/* Glow dot */}
              {isHovered && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: skill.accent,
                    boxShadow: `0 0 8px ${skill.accent}`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}


export default function Skills() {
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const fn = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .skills-root {
          background: #050810; color: #fff;
          position: relative; overflow: hidden;
          padding: 5rem 0 6rem;
          font-family: 'DM Sans', sans-serif;
        }
        .skills-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size: 60px 60px; pointer-events: none;
        }
        .skills-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .skills-scan {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent);
          animation: sk-scan 9s linear infinite; pointer-events: none; z-index: 2;
        }
        @keyframes sk-scan { from{top:0} to{top:100%} }
        .skills-divider {
          display: flex; align-items: center; gap: 0.75rem; margin: 1rem 2rem;
        }
        .skills-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
        }
        .skills-divider-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
        }
        .skill-stat {
          background: linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 0.85rem 1.25rem;
          text-align: center; position: relative; overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .skill-stat:hover { border-color: var(--sc); box-shadow: 0 0 24px -8px var(--sc); }
        .skill-stat::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,transparent,var(--sc),transparent); opacity: 0.5;
        }
        .skill-stat-num {
          font-family: 'Syne',sans-serif; font-weight: 800;
          font-size: 1.6rem; line-height: 1;
          color: var(--sc); text-shadow: 0 0 20px var(--sc);
        }
        .skill-stat-label {
          font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-top: 0.2rem;
          font-family: 'JetBrains Mono',monospace;
        }
      `}</style>

      <section id="skills" className="skills-root">

        {/* Mouse spotlight */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.05) 0%, transparent 70%)`,
          transition:'background 0.05s',
        }} />

        <div className="skills-scan" />

        {/* Ambient glows */}
        <div style={{ position:'absolute', top:'10%', left:'-8%', width:'420px', height:'420px', borderRadius:'50%', background:'#a78bfa', opacity:0.05, filter:'blur(100px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'5%', right:'-8%', width:'420px', height:'420px', borderRadius:'50%', background:'#38bdf8', opacity:0.04, filter:'blur(100px)', pointerEvents:'none' }} />

        {/* Top accent line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(56,189,248,0.5),transparent)', zIndex:3 }} />

        {/* Heading */}
        <motion.div
          initial={{ opacity:0, y:-28 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.7 }}
          style={{ textAlign:'center', marginBottom:'3rem', position:'relative', zIndex:5 }}
        >
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:'0.5rem' }}>
            Technical Arsenal
          </p>
          <h2 className="skills-title">MY SKILLS</h2>
          <p style={{ marginTop:'0.6rem', fontSize:'0.85rem', color:'rgba(255,255,255,0.35)', fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.04em' }}>
            Cloud Infrastructure · DevOps · Development
          </p>
          <p style={{ marginTop:'0.5rem', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)' }}>
            Scroll ↕ to reverse direction
          </p>
        </motion.div>

        {/* Row 1 */}
        <motion.div
          initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}
          style={{ position:'relative', zIndex:4 }}
        >
          <MarqueeRow skills={SKILL_ROWS[0]} direction={-1} speed={50} />
        </motion.div>

        {/* Divider */}
        <div className="skills-divider" style={{ position:'relative', zIndex:4 }}>
          <div className="skills-divider-line" />
          {[...Array(5)].map((_,i) => <div key={i} className="skills-divider-dot" />)}
          <div className="skills-divider-line" />
        </div>

        {/* Row 2 */}
        <motion.div
          initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
          style={{ position:'relative', zIndex:4 }}
        >
          <MarqueeRow skills={SKILL_ROWS[1]} direction={1} speed={42} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.3 }}
          style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap', marginTop:'3rem', padding:'0 2rem', position:'relative', zIndex:4 }}
        >
          {[
            { num:'15+',  label:'Skills Mastered', color:'#a78bfa' },
            { num:'8',    label:'AWS Services',    color:'#38bdf8' },
            { num:'3+',   label:'Years Hands-on',  color:'#34d399' },
            { num:'100%', label:'Cloud-focused',   color:'#fb923c' },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="skill-stat"
              style={{ '--sc': s.color, minWidth:'120px' }}
              whileHover={{ y:-4 }}
              transition={{ type:'spring', stiffness:300 }}
            >
              <div className="skill-stat-num">{s.num}</div>
              <div className="skill-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent line */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)', zIndex:3 }} />

      </section>
    </>
  );
}