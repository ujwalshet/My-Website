import { motion, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';



const experiences = [
  {
    role: "Trainee Intern Engineer",
    company: "Tech Fortune Technology Services Limited",
    duration: "2022",
    description:
      "Went through structured training covering AWS cloud fundamentals, networking basics, and server administration. Gained hands-on exposure to cloud infrastructure concepts, monitoring systems, and deployment workflows while assisting senior engineers."
  },
  {
    role: "System Engineer",
    company: "Stratogent Technology Services Limited",
    duration: "2023 - 2024",
    description:
      "Worked on maintaining system reliability and performance by monitoring servers, troubleshooting infrastructure issues, and supporting deployment processes. Assisted in managing networking configurations, ensuring system uptime, and maintaining operational stability."
  },
  {
    role: "Cloud System Analyst",
    company: "Stratogent | Pinnacle Technology Partners",
    duration: "2024 - Present",
    description: 
      "Handled AWS-based cloud infrastructure projects including EC2 monitoring, automated patch management, and cloud migration initiatives. Worked closely with customers to understand requirements, implement cloud solutions, and maintain system performance through monitoring, optimization, and incident response."
  }
];

function ExperienceItem({ exp, idx, start, end, scrollYProgress, layout }) {

  const scale = useTransform(scrollYProgress, [start, end], [0, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  const y = useTransform(scrollYProgress, [start, end], [idx % 2 === 0 ? 30 : -30, 0]);
  const x = useTransform(scrollYProgress, [start, end], [-24, 0]);

  if (layout === "desktop") {
    return (
      <div className="relative flex flex-1 justify-center items-center min-w-0">

        <motion.div
          className="z-10 w-7 h-7 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          style={{ scale, opacity }}
        >
        </motion.div>

        <div
          className={`absolute ${idx % 2 === 0 ? "-top-8" : "-bottom-8"} w-[3px] bg-white/40`}
          style={{ height: 40, opacity }}
        />

        <motion.article
          className={`absolute ${idx % 2 === 0 ? "bottom-12" : "top-12"}
          bg-gray-900/80 backdrop-blur border border-gray-700/70
          rounded-xl p-7 w-[320px] shadow-lg`}
         style={{ opacity, y, maxWidth: "90vw" }}
transition={{ duration: 0.6, delay: idx * 0.15 }}

>

<h3 className="text-xl font-semibold">
  {exp.role}
</h3>

<p className="text-sm text-gray-400 mb-3">
  {exp.company} · {exp.duration}
</p>

<p className="text-md text-gray-300 break-words">
  {exp.description}
</p>




        </motion.article>

      </div>
    );
  }
}




export default function Experience() {
  return (
    <section id="experience" className="relative bg-black text-white">

    </section>
  );
}
