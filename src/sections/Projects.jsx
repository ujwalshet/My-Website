import { useEffect, useMemo, useRef, useState } from "react";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.png";
import photo3 from "../assets/photo3.png";
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

export default function Projects() {

  const isMobile = useIsMobile();
  const sceneRef = useRef(null);

  const projects = useMemo(() => [
  {
    title: "On-Prem to AWS Cloud Migration",
    bgColor: "#8d4dd3",
    image: img1,
    description:
      "Migrated on-premises infrastructure to AWS cloud improving scalability, reliability and operational efficiency using EC2, VPC and automated deployment strategies."
  },
  {
    title: "Automated Patch Management using AWS SSM",
    bgColor: "#38a4d3",
    image: img2,
    description:
      "Built an automated patch management solution using AWS Systems Manager to schedule patching, enforce compliance and maintain secure EC2 environments."
  },
  {
    title: "AWS Serverless Monitoring",
    bgColor: "#dc9117",
    image: img3,
    description:
      "Implemented serverless EC2 monitoring using AWS Lambda, CloudWatch and SNS to detect failures and automatically send real-time alert notifications."
  }
], []);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"]
  });

  const thresholds = projects.map((_, i) => (i + 1) / projects.length);

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = thresholds.findIndex((t) => v <= t);
    setActiveIndex(idx === -1 ? thresholds.length - 1 : idx);
  });

  const activeProject = projects[activeIndex];

  return (

<section
id="projects"
ref={sceneRef}
className="relative text-white"
style={{
height: `${100 * projects.length}vh`,
backgroundColor: activeProject.bgColor,
transition: "background-color 400ms ease"
}}
>

<div className="sticky top-0 h-screen flex flex-col items-center justify-center">

<motion.h2
  initial={{ opacity: 0, y: -60 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className={`z-10 text-center font-bold tracking-wide text-white
  ${isMobile ? "text-4xl mt-6" : "text-6xl mt-10"}
  drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]`}
>
  My Work
</motion.h2>

<div className="relative w-full flex-1 flex items-center justify-center">

{projects.map((project , idx) => (

<div
key={project.title}
className={`transition-all duration-500 w-[85%] max-w-[1200px] ${
activeIndex === idx ? "opacity-100 z-20" : "opacity-0 z-0 absolute"
}`}
>

<div className="flex flex-col lg:flex-row items-center gap-10">

<AnimatePresence mode="wait">
{activeIndex === idx && (

<motion.div
key={project.title}
initial={{opacity:0 , x:-40}}
animate={{opacity:1 , x:0}}
exit={{opacity:0 , x:-40}}
transition={{duration:0.5}}
className="lg:w-1/2 text-center lg:text-left"
>

<h3 className="text-[clamp(2rem,5vw,4rem)] font-semibold italic">
{project.title}
</h3>

<p className="mt-4 text-white/80 text-lg">
{project.description}
</p>

</motion.div>

)}
</AnimatePresence>

<div
className="lg:w-1/2 w-full relative overflow-hidden bg-black/20 shadow-2xl
md:shadow-[0_35px_40px_-15px_rgba(0,0,0,0.7)] rounded-xl h-[62vh] sm:h-[66vh]"
style={{transition: "box-shadow 250ms ease"}}
>

<img
src={project.image}
alt={project.title}
className="w-full h-full object-cover"
style={{
filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.65))",
transition: "filter 200ms ease"
}}
loading="lazy"
/>

</div>

</div>

</div>

))}

</div>

</div>

</section>

  );
}