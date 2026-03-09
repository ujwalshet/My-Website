import { useMemo } from "react";
import ParticleBackground from "../components/ParticleBackground";
import { motion } from "framer-motion";
import React from "react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa6";
import avatar from "../assets/avatar.png";

const socials = [
  { Icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@Ujwalplays18" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ujwal-shet-118318202/" },
  { Icon: FaGithub, label: "GitHub", href: "https://github.com/ujwalshet" },
]
const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: {
    scale: 1.2, y: -3,
    filter: "drop-shadow(0 6px rgba(13,38,204,0.9)) drop-shadow(0 10px rgba(16,165,129,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  },
  tap: { scale: 0.95, y: 0, transition: { duration: 0.08 } }
};



export default function Home() {

const roles = useMemo(() => ["AWS Cloud Engineer", "Server Administration"], [])

const [index , setIndex] = React.useState(0);
const [subIndex , setSubIndex] = React.useState(0);
const [deleting , setDeleting] = React.useState(false);

React.useEffect(() => {

const current = roles[index];

const timeout = setTimeout(() => {

if(!deleting && subIndex < current.length) setSubIndex(v => v + 1);
else if(!deleting && subIndex === current.length) setTimeout(() => setDeleting(true), 1200);
else if(deleting && subIndex > 0) setSubIndex(v => v - 1);
else if(deleting && subIndex === 0){
setDeleting(false);
setIndex(p => (p + 1) % roles.length);
}

}, deleting ? 40 : 80)

return () => clearTimeout(timeout);

}, [subIndex , index , deleting , roles])


return(
<section
id="home"
className="w-full h-screen relative bg-black overflow-hidden"
>

<ParticleBackground/>

<div className="absolute inset-0">

{/* Top Glow */}
<div
className="absolute top-32 left-32
lg:w-[70vw] sm:w-[50vw] md:w-[40vw]
h-[70vw] sm:h-[50vw] md:h-[40vw]
max-w-[580px] max-h-[580px]
rounded-full
bg-gradient-to-r from-[#02b63b] via-[#00b8f8] to-[#1cdd2e]
opacity-20 md:opacity-10
blur-[100px] sm:blur-[130px] md:blur-[150px]
animate-pulse"
/>

{/* Bottom Glow */}
<div
className="absolute bottom-0 right-0
w-[70vw] sm:w-[50vw] md:w-[40vw]
h-[70vw] sm:h-[50vw] md:h-[40vw]
max-w-[580px] max-h-[580px]
rounded-full
bg-gradient-to-r from-[#3cbd63] via-[#00b8f8] to-[#1cdd2e]
opacity-30 sm:opacity-20 md:opacity-10
blur-[100px] sm:blur-[130px] md:blur-[150px]
animate-pulse delay-500"
/>

<div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 flex items-center">

<div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left w-full max-w-[48rem]">

{/* Typing Role */}
<motion.div
className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]"
initial={{opacity:0 , y:12}}
animate={{opacity:1 , y:0}}
transition={{duration:0.6}}
>

<span>
{roles[index].substring(0, subIndex)}
</span>

<span
className="inline-block w-[2px] ml-1 bg-white animate-pulse align-middle"
style={{height:"1em"}}
/>

</motion.div>


{/* Name */}
<motion.h1
className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4cddd2] via-[#00b8f8] to-[#382c60] drop-shadow-lg"
initial={{opacity:0 , y:40}}
animate={{opacity:1 , y:0}}
transition={{duration:1}}
>

Hello I'm
<br/>

<span className="text-white font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap">
Ujwal Shet
</span>

</motion.h1>


{/* Bio */}
<motion.p
className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl"
initial={{opacity:0 , y:20}}
animate={{opacity:1 , y:0}}
transition={{delay:0.4 , duration:0.8}}
>

AWS Cloud Engineer specializing in scalable and secure cloud solutions. Skilled in AWS services, automation, Infrastructure as Code, and DevOps-driven deployments.

</motion.p>


{/* Buttons */}
<motion.div
className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
initial={{opacity:0}}
animate={{opacity:1}}
transition={{delay:0.8 , duration:0.8}}
>

<a
href="#projects"
className="px-6 py-3 rounded-full font-medium text-lg text-white
bg-gradient-to-r from-[#1cdd2e] via-[#00b8f8] to-[#392cb3]
shadow-lg hover:scale-105 transition-all"
>
View My Work
</a>

<a href="/Resume.pdf" download
className="px-6 py-3 rounded-full text-lg font-medium text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all ">
  My Resume
</a>

</motion.div>

<div className="mt-10 flex gap-5 text-2xl md:text-3xl justify-center lg:justify-start">
  {socials.map(({ Icon, label, href }) => (
    <motion.a
      href={href}
      key={label}
      target="_blank"
      aria-label={label}
      rel="noopener noreferrer"
      variants={glowVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="text-gray-300"
    >
      <Icon />
    </motion.a>
  ))}
</div>

</div>
</div>

<div className="relative hidden lg:block lg:h-1/2 ">
<div
className="absolute bottom-1/4 -translate-y-1/2 pointer-events-none"
style={{
  right: "350px", width: "min(22vw, 410px)", height: "min(40vw, 760px)", borderRadius: "50%",
  filter: "blur(38px)", opacity: 0.32 ,
  background: "conic-gradient(from 0deg, #1cdd82, #00b8f8, #302b63, #1cdd82 )"
}}
/>

<motion.img src={avatar} alt="avatar"
className="absolute bottom-1/4 -translate-y-1/2 object-contain select-none pointer-events-none"
style={{
  right: "200px", width: "min(45vw, 780px)", maxHeight: "90vh"
}}

initial={{opacity:0 , y: 40 , scale: 0.98}}
animate={{opacity:1 , y:0 , scale: 1}}
transition={{delay: 0.2 , duration:0.8}}

/>

</div>


</div>
</section>
)
}