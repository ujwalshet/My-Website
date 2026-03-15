import { motion } from "framer-motion";

import pic01 from "../assets/pic01.png";
import pic02 from "../assets/pic02.png";
import pic03 from "../assets/pic03.png";
import pic04 from "../assets/pic04.png";
import pic05 from "../assets/pic05.png";
import pic06 from "../assets/pic06.png";
import pic07 from "../assets/pic07.png";
import pic08 from "../assets/pic08.png";

const certifications = [
  pic01,
  pic02,
  pic03,
  pic04,
  pic05,
  pic06,
  pic07,
  pic08
];

export default function Certifications() {

  const duplicated = [...certifications, ...certifications];

  return (

<section id="certifications" className="relative bg-black text-white py-20 overflow-hidden">

<h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center mb-16 tracking-wide text-white/90">
  Certifications
</h2>

<div className="w-full overflow-hidden">

<motion.div
className="flex items-center gap-10 sm:gap-16 md:gap-24 px-4"
animate={{ x: ["0%", "-50%"] }}
transition={{
repeat: Infinity,
duration: 25,
ease: "linear"
}}
>

{duplicated.map((cert, index) => (
<img
key={index}
src={cert}
alt="cert"
className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px]
object-contain hover:scale-110 transition duration-300"
/>
))}

</motion.div>

</div>

</section>

  );
}