import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import P from "../assets/P.png";

export default function About(){
const stats = React.useMemo(() => [
  { label: "Experience", value: "3+ Years" },
  { label: "Specialization", value: "Cloud Computing" },
  { label: "Primary Platform", value: "AWS Cloud" },
], []);


const [counters, setCounters] = useState(stats.map(() => 0));

useEffect(() => {
  const interval = setInterval(() => {
    setCounters(prev => prev.map((count, i) => {
      const target = parseInt(stats[i].value) || 3; // fallback for "3+ Years"
      return count < target ? count + 1 : target;
    }));
  }, 100);
  return () => clearInterval(interval);
}, [stats]);


useEffect(() => {
  const section = document.getElementById("about");
  if (!section) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      launchConfetti();
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(section);

  function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    section.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const pieces = [];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: 5 + Math.random() * 10,
        h: 5 + Math.random() * 10,
        color: `hsl(${Math.random() * 360},100%,50%)`,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 5 + 2,
        rotation: Math.random() * 360,
        spin: Math.random() * 10 - 5,
      });
    }
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      requestAnimationFrame(update);
    }
    update();
    setTimeout(() => {
      canvas.remove();
    }, 5000);
  }
}, [stats]);

const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]));
const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]));

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  mouseX.set(x);
  mouseY.set(y);
};

const handleMouseLeave = () => {
  mouseX.set(0);
  mouseY.set(0);
};



const glows = [
"top-10 left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
"bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
"top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[100px]",
]

return(
<section id="about"
className="min-h-screen w-full flex items-center justify-center relative bg-black text-white overflow-hidden">

<div className="absolute inset-0 pointer-events-none">
{glows.map((c,i) => (
<div key={i} className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00b8f8] to-[#1cdd82] animate-pulse ${c}`} />
))}

{/* Floating elements */}
{[...Array(5)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute text-4xl opacity-20"
    style={{
      left: `${20 + i * 15}%`,
      top: `${30 + i * 10}%`,
    }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {i % 2 === 0 ? "☁️" : "⚡"}
  </motion.div>
))}
</div>

<div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12 py-20 flex flex-col gap-12">
<motion.div className="flex flex-col md:flex-row items-center md:items-stretch gap-8"
initial={{opacity:0 , y:24}}
whileInView={{opacity:1 , y:0}}
transition={{duration:0.6}}
viewport={{once:true , amount:0.4}}

>
<motion.div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px]
rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1cdd82]/20 to-[#302b63]/20 border border-[#1cdd82]/25"
style={{
  rotateX,
  rotateY,
  transformStyle: "preserve-3d",
}}
onMouseMove={handleMouseMove}
onMouseLeave={handleMouseLeave}
>

  <img src={P} alt="P" className="absolute inset-0" />

</motion.div>

<div className="flex-1 flex flex-col justify-center text-center md:text-left">
  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent
  bg-gradient-to-r from-[#1cdd82] via-[#00b8f8] to-[#1cdd82]">
    Ujwal Shet
  </h2>
<p className="mt-2 text-lg sm:text-xl text-white/90 font-semibold">
AWS Cloud Engineer
</p>

<p className="mt-4 text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl md:max-w-3xl">
I design and build scalable, secure cloud infrastructure on AWS. My work focuses on cloud architecture, automation, and infrastructure reliability using services such as EC2, VPC, IAM, S3, Lambda, and CloudWatch. I develop cloud solutions that improve performance, optimize costs, and ensure high availability while following best practices in cloud security and DevOps.
</p>

<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
  {stats.map((item, i) => (
    <motion.div
      key={i}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * i, duration: 0.4 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="text-sm text-gray-400">{item.label}</div>
      <div className="text-base font-semibold">{item.label === "Experience" ? `${counters[i]}+ Years` : item.value}</div>
    </motion.div>
  ))}
</div>

<div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
  <a
    href="#Projects" className="inline-flex items-center justify-center rounded-lg bg-white text-black font-semibold px-5 py-3 hover:bg-gray-200 transition"
  >
    View Projects
  </a>

  <a
    href="#Contact" className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white px-5 py-3 hover:bg-white/20 transition"
  >
    Get in Touch
  </a>
</div>



</div>

</motion.div>
<motion.div className="text-center md:text-left"
initial={{opacity:0 , x: -30}}
whileInView={{opacity:1 , x:0}}
transition={{duration:0.6}}
viewport={{once:true , amount:0.4}}
>

<h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
About Me
</h3>

<p className="text-gray-300 leading-relaxed text-base sm:text-lg">
I'm an AWS Cloud Engineer focused on building scalable, secure, and reliable cloud infrastructure. 
I enjoy working with AWS services like EC2, VPC, IAM, S3, and CloudWatch to design efficient cloud solutions and automate infrastructure.
</p>

<p className="mt-4 text-gray-400 text-base sm:text-lg">
Outside of cloud engineering, I enjoy playing Valorant, watching cricket, cooking, and travelling. 
I love exploring new technologies and continuously learning to improve my cloud and DevOps skills.
</p>

</motion.div>



</div>

</section>
)
}
