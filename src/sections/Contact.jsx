import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import Astra from "../assets/Astra.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiCpu, FiDollarSign, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const SERVICE_ID  = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_PUBLIC_KEY;

// ── Particle canvas ────────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const COLORS = ["#a78bfa","#38bdf8","#34d399"];
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: 1+Math.random()*1.5,
      c: COLORS[Math.floor(Math.random()*3)],
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){ ctx.beginPath(); ctx.strokeStyle=`rgba(167,139,250,${0.1*(1-d/110)})`; ctx.lineWidth=.5; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
        }
      }
      pts.forEach(p=>{
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c; ctx.shadowColor=p.c; ctx.shadowBlur=5; ctx.fill(); ctx.shadowBlur=0;
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; };
    window.addEventListener("resize",onResize);
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",onResize); };
  },[]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:.5 }} />;
}

// ── Transmission animation ─────────────────────────────────────────────────────
function Transmission({ onDone }) {
  const lines = [
    "ESTABLISHING SECURE CONNECTION...",
    "ENCRYPTING PAYLOAD...",
    "ROUTING VIA AWS SNS...",
    "TRANSMITTING MESSAGE...",
    "✓ DELIVERED SUCCESSFULLY",
  ];
  const [shown, setShown] = useState([]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown(prev => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) { clearInterval(id); setTimeout(onDone, 1200); }
    }, 380);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
      style={{ textAlign:"center", padding:"1rem 0" }}
    >
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", color:"#34d399", lineHeight:2.2 }}>
        {shown.map((l,i) => (
          <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:.25 }}>
            <span style={{ color: l.startsWith("✓") ? "#34d399" : "rgba(52,211,153,0.6)", marginRight:"0.5rem" }}>$</span>
            {l}
          </motion.div>
        ))}
        {shown.length < lines.length && (
          <span style={{ display:"inline-block", width:8, height:"1em", background:"rgba(52,211,153,0.7)", verticalAlign:"middle", animation:"cur-blink .8s step-end infinite" }} />
        )}
      </div>
    </motion.div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, required, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
      <label style={{
        fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem",
        letterSpacing:"0.12em", textTransform:"uppercase",
        color: error ? "#f87171" : "rgba(255,255,255,0.45)",
        display:"flex", alignItems:"center", gap:"0.4rem",
      }}>
        <Icon size={11} />
        {label}
        {required && <span style={{ color:"#f472b6" }}>*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#f87171", letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:4 }}
          >
            <FiAlertCircle size={10} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const INPUT_STYLE = (hasError) => ({
  padding:"0.7rem 1rem",
  borderRadius:"10px",
  background:"rgba(255,255,255,0.04)",
  border:`1px solid ${hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.08)"}`,
  color:"#fff",
  fontFamily:"'DM Sans',sans-serif",
  fontSize:"0.88rem",
  outline:"none",
  transition:"border-color .25s, box-shadow .25s, background .25s",
  width:"100%",
  boxSizing:"border-box",
});

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState({ name:"", email:"", service:"", budget:"", idea:"" });
  const [errors, setErrors]     = useState({});
  const [status, setStatus]     = useState(""); // "" | "sending" | "transmitting" | "success" | "error"
  const [focusedField, setFocused] = useState(null);
  const [hudBlink, setHudBlink] = useState(true);
  const [time, setTime]         = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);
  useEffect(() => { const id=setInterval(()=>setHudBlink(v=>!v),1400); return ()=>clearInterval(id); },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name==="budget" && value && !/^\d*$/.test(value)) return;
    setFormData(prev=>({...prev,[name]:value}));
    if (errors[name]) setErrors(prev=>({...prev,[name]:""}));
  };

  const validate = () => {
    const newErrors = {};
    ["name","email","service","idea"].forEach(f => { if(!formData[f].trim()) newErrors[f]="Required"; });
    if(formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email="Invalid email";
    if(formData.budget && !/^\d+$/.test(formData.budget.trim())) newErrors.budget="Numbers only";
    setErrors(newErrors);
    return Object.keys(newErrors).length===0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("transmitting");
  };

  const handleTransmitDone = async () => {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...formData, from_name:formData.name, reply_to:formData.email }, PUBLIC_KEY);
      setStatus("success");
      setFormData({ name:"", email:"", service:"", budget:"", idea:"" });
    } catch(err) {
      console.error(err); setStatus("error");
    }
  };

  const inputStyle = (field) => ({
    ...INPUT_STYLE(!!errors[field]),
    boxShadow: focusedField===field ? `0 0 0 2px ${errors[field] ? "rgba(248,113,113,0.3)" : "rgba(167,139,250,0.25)"}` : "none",
    background: focusedField===field ? "rgba(167,139,250,0.06)" : "rgba(255,255,255,0.04)",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        .contact-root { background:#050810; color:#fff; min-height:100vh; position:relative; overflow:hidden; font-family:'DM Sans',sans-serif; }
        .contact-root::before {
          content:''; position:absolute; inset:0;
          background-image: linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; pointer-events:none;
        }
        .contact-scan { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent); animation:ct-scan 10s linear infinite; pointer-events:none; z-index:2; }
        @keyframes ct-scan { from{top:0} to{top:100%} }
        .hud-label { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.18em; text-transform:uppercase; color:rgba(52,211,153,.5); }
        select option { background:#0a0d1a; color:#fff; }
        @keyframes cur-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .contact-title { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(2rem,4vw,3.2rem); letter-spacing:-.02em; background:linear-gradient(135deg,#fff 40%,rgba(255,255,255,.3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .send-btn {
          width:100%; padding:.8rem; border-radius:10px;
          background:linear-gradient(135deg,#a78bfa,#38bdf8);
          color:#000; font-weight:700; font-size:.85rem;
          letter-spacing:.08em; text-transform:uppercase;
          border:none; cursor:pointer; font-family:'JetBrains Mono',monospace;
          transition:box-shadow .3s, transform .2s, opacity .2s;
          display:flex; align-items:center; justify-content:center; gap:.5rem;
        }
        .send-btn:hover:not(:disabled) { box-shadow:0 0 32px rgba(167,139,250,.55); transform:translateY(-2px); }
        .send-btn:disabled { opacity:.5; cursor:not-allowed; }
      `}</style>

      <section id="contact" className="contact-root">
        <Particles />
        <div className="contact-scan" />

        {/* Accent lines */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,.6),rgba(56,189,248,.6),transparent)", zIndex:4 }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(52,211,153,.4),transparent)", zIndex:4 }} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"10%", left:"-5%", width:"450px", height:"450px", borderRadius:"50%", background:"#a78bfa", opacity:.05, filter:"blur(100px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"5%", right:"-5%", width:"450px", height:"450px", borderRadius:"50%", background:"#38bdf8", opacity:.04, filter:"blur(100px)", pointerEvents:"none" }} />

        {/* HUD strip */}
        <div style={{ position:"absolute", top:"1.2rem", left:"1.5rem", zIndex:10 }}>
          <div className="hud-label">{hudBlink?"● COMMS:READY":"○ COMMS:READY"} · {time}</div>
        </div>
        <div style={{ position:"absolute", top:"1.2rem", right:"1.5rem", zIndex:10, textAlign:"right" }}>
          <div className="hud-label">SECURE CHANNEL · EMAILJS</div>
        </div>

        {/* Main layout */}
        <div style={{ position:"relative", zIndex:10, maxWidth:"1200px", margin:"0 auto", padding:"5rem 1.5rem 4rem", display:"flex", flexWrap:"wrap", alignItems:"center", gap:"3rem", minHeight:"100vh" }}>

          {/* ── LEFT: Image + info ── */}
          <motion.div
            initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:.7 }}
            style={{ flex:"1 1 300px", display:"flex", flexDirection:"column", alignItems:"center", gap:"2rem" }}
          >
            {/* Floating image with orbit ring */}
            <div style={{ position:"relative" }}>
              <div style={{
                position:"absolute", inset:"-16px", borderRadius:"28px",
                border:"1px dashed rgba(167,139,250,.25)",
                animation:"contact-spin 16s linear infinite",
              }} />
              <div style={{
                position:"absolute", inset:"-32px", borderRadius:"36px",
                border:"1px dashed rgba(56,189,248,.15)",
                animation:"contact-spin 28s linear infinite reverse",
              }} />
              <motion.img
                src={Astra} alt="Contact"
                animate={{ y:[0,12,0] }}
                transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
                style={{ width:"min(280px,80vw)", borderRadius:"20px", position:"relative", zIndex:2, filter:"drop-shadow(0 0 40px rgba(167,139,250,.25))" }}
              />
              {/* Status badge */}
              <div style={{
                position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)",
                background:"#050810", border:"1px solid rgba(255,255,255,.1)",
                borderRadius:"99px", padding:"4px 14px 4px 10px",
                display:"flex", alignItems:"center", gap:6, zIndex:3, whiteSpace:"nowrap",
                fontFamily:"'JetBrains Mono',monospace", fontSize:".62rem", letterSpacing:".08em", textTransform:"uppercase", color:"rgba(255,255,255,.5)",
              }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 8px #34d399", animation:"ct-pulse 2s ease infinite" }} />
                Available for Work
              </div>
            </div>

            {/* Contact info cards */}
            <div style={{ width:"100%", maxWidth:"320px", display:"flex", flexDirection:"column", gap:".75rem" }}>
              {[
                { label:"Email", value:"ujwalshet@gmail.com", color:"#a78bfa" },
                { label:"Location", value:"India · Remote-ready", color:"#38bdf8" },
                { label:"Response", value:"Within 24 hours", color:"#34d399" },
              ].map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ x:4 }}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:".65rem 1rem", borderRadius:"10px",
                    background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
                    transition:"border-color .3s",
                  }}
                >
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,.3)" }}>{item.label}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".8rem", color:item.color, fontWeight:500 }}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Form panel ── */}
          <motion.div
            initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:.7, delay:.1 }}
            style={{ flex:"1 1 360px" }}
          >
            <div style={{
              background:"linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
              border:"1px solid rgba(255,255,255,.08)",
              borderRadius:"20px", overflow:"hidden",
              position:"relative",
            }}>
              {/* Top border glow */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,.5),rgba(56,189,248,.5),transparent)" }} />

              {/* Terminal bar */}
              <div style={{
                display:"flex", alignItems:"center", gap:".4rem",
                padding:".65rem 1rem", background:"rgba(0,0,0,.4)",
                borderBottom:"1px solid rgba(255,255,255,.06)",
              }}>
                {["#ff5f57","#febc2e","#28c840"].map(c=>(
                  <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
                ))}
                <span style={{ marginLeft:".5rem", fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", color:"rgba(255,255,255,.3)", letterSpacing:".05em" }}>
                  compose_message.sh — contact
                </span>
              </div>

              <div style={{ padding:"1.75rem" }}>

                {/* Heading */}
                <div style={{ marginBottom:"1.5rem" }}>
                  <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".62rem", letterSpacing:".18em", textTransform:"uppercase", color:"rgba(255,255,255,.28)", marginBottom:".4rem" }}>
                    Initiate Contact
                  </p>
                  <h2 className="contact-title">Let's Work Together</h2>
                </div>

                {/* Transmission overlay */}
                <AnimatePresence mode="wait">
                  {status==="transmitting" && (
                    <motion.div key="tx" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                      <Transmission onDone={handleTransmitDone} />
                    </motion.div>
                  )}

                  {status==="success" && (
                    <motion.div
                      key="ok"
                      initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                      style={{ textAlign:"center", padding:"2rem 0" }}
                    >
                      <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:.5 }}>
                        <FiCheckCircle size={52} color="#34d399" style={{ margin:"0 auto", filter:"drop-shadow(0 0 16px #34d399)" }} />
                      </motion.div>
                      <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.2rem", color:"#fff", marginTop:"1rem" }}>Message Transmitted!</p>
                      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", color:"rgba(52,211,153,.7)", letterSpacing:".1em", marginTop:".4rem" }}>I'll respond within 24 hours</p>
                      <motion.button
                        onClick={() => setStatus("")}
                        whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
                        style={{ marginTop:"1.25rem", padding:".55rem 1.5rem", borderRadius:"8px", background:"rgba(167,139,250,.15)", border:"1px solid rgba(167,139,250,.35)", color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".1em", cursor:"pointer" }}
                      >
                        Send Another →
                      </motion.button>
                    </motion.div>
                  )}

                  {status==="error" && (
                    <motion.div key="err" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"1.5rem 0" }}>
                      <FiAlertCircle size={44} color="#f87171" style={{ margin:"0 auto", filter:"drop-shadow(0 0 12px #f87171)" }} />
                      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", color:"#f87171", marginTop:".75rem", letterSpacing:".08em" }}>TRANSMISSION FAILED — Try again</p>
                      <motion.button onClick={()=>setStatus("")} whileHover={{ scale:1.04 }} style={{ marginTop:"1rem", padding:".5rem 1.25rem", borderRadius:"8px", background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.3)", color:"#f87171", fontFamily:"'JetBrains Mono',monospace", fontSize:".62rem", cursor:"pointer" }}>
                        Retry →
                      </motion.button>
                    </motion.div>
                  )}

                  {!status && (
                    <motion.form
                      key="form"
                      initial={{ opacity:0 }} animate={{ opacity:1 }}
                      onSubmit={handleSubmit}
                      style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}
                    >
                      {/* Name + Email row */}
                      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                        <div style={{ flex:"1 1 140px" }}>
                          <Field label="Your Name" icon={FiUser} error={errors.name} required>
                            <input
                              type="text" name="name" placeholder="Ujwal Shet"
                              value={formData.name} onChange={handleChange}
                              onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}
                              style={inputStyle("name")}
                            />
                          </Field>
                        </div>
                        <div style={{ flex:"1 1 140px" }}>
                          <Field label="Email" icon={FiMail} error={errors.email} required>
                            <input
                              type="email" name="email" placeholder="you@email.com"
                              value={formData.email} onChange={handleChange}
                              onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
                              style={inputStyle("email")}
                            />
                          </Field>
                        </div>
                      </div>

                      {/* Service */}
                      <Field label="Service Needed" icon={FiCpu} error={errors.service} required>
                        <select
                          name="service" value={formData.service} onChange={handleChange}
                          onFocus={()=>setFocused("service")} onBlur={()=>setFocused(null)}
                          style={inputStyle("service")}
                        >
                          <option value="" disabled>Select a service...</option>
                          <option value="AWS Cloud Solutions">AWS Cloud Solutions</option>
                          <option value="IT Infrastructure Setup">IT Infrastructure Setup</option>
                          <option value="Others">Others</option>
                        </select>
                      </Field>

                      {/* Budget */}
                      {formData.service && formData.service!=="Others" && (
                        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25 }}>
                          <Field label="Budget (USD)" icon={FiDollarSign} error={errors.budget}>
                            <input
                              type="number" name="budget" placeholder="e.g. 5000"
                              value={formData.budget} onChange={handleChange}
                              onFocus={()=>setFocused("budget")} onBlur={()=>setFocused(null)}
                              style={inputStyle("budget")}
                            />
                          </Field>
                        </motion.div>
                      )}

                      {/* Idea */}
                      <Field label="Your Idea" icon={FiMessageSquare} error={errors.idea} required>
                        <textarea
                          name="idea" rows={4} placeholder="Describe your project or cloud infrastructure needs..."
                          value={formData.idea} onChange={handleChange}
                          onFocus={()=>setFocused("idea")} onBlur={()=>setFocused(null)}
                          style={{ ...inputStyle("idea"), resize:"vertical", minHeight:"100px" }}
                        />
                      </Field>

                      {/* Submit */}
                      <motion.button
                        className="send-btn"
                        type="submit"
                        whileHover={{ scale:1.02 }}
                        whileTap={{ scale:.97 }}
                        disabled={status==="sending" || status==="transmitting"}
                      >
                        <FiSend size={14} />
                        Transmit Message
                      </motion.button>

                      {/* Bottom HUD strip */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:".25rem" }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,.18)" }}>
                          Powered by EmailJS
                        </span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".1em", textTransform:"uppercase", color:"rgba(52,211,153,.4)" }}>
                          {hudBlink ? "● SECURE" : "○ SECURE"}
                        </span>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <style>{`
        @keyframes contact-spin { to { transform:rotate(360deg); } }
        @keyframes ct-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
      `}</style>
    </>
  );
}