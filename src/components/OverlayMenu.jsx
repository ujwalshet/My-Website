import { motion , AnimatePresence } from "framer-motion"
import { FiX, FiHome, FiUser, FiCode, FiFolder, FiBriefcase, FiMessageSquare, FiMail } from "react-icons/fi";

export default function OverlayMenu({isOpen , onClose}){

const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
const origin = isMobile ? "95% 8%" : "50% 8%";

const menuItems = [
  { name: "Home", icon: FiHome },
  { name: "About", icon: FiUser },
  { name: "Skills", icon: FiCode },
  { name: "Projects", icon: FiFolder },
  { name: "Experience", icon: FiBriefcase },
  { name: "Certifications", icon: FiMessageSquare },
  { name: "Contact", icon: FiMail }
];

  return(
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black bg-opacity-95"
        initial={{clipPath: `circle(0% at ${origin})`}}
        animate={{clipPath: `circle(150% at ${origin})`}}
        exit={{clipPath: `circle(0% at ${origin})`}}
        transition={{duration: 0.7, ease: [0.4,0.0,0.2,1]}}
        
    
        >

          <motion.button onClick = {onClose}
            className="absolute top-6 right-6 text-white text-3xl"
            aria-label="Close Menu"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX/>
          </motion.button>
<ul className="space-y-6 text-center">
{
menuItems.map((item , index) => (
<motion.li key={item.name}
initial={{opacity : 0, y:200}}
animate={{opacity: 1, y:0}}
transition={{delay: 0.3 + index *0.1}}
whileHover={{ scale: 1.05 }}
className="flex items-center justify-center space-x-4"
>

<a href={`#${item.name.toLowerCase()}`}
onClick={onClose}
className="text-4xl text-white font-semibold hover:text-orange-400 transition-colors duration-300 flex items-center space-x-4"
>
<item.icon className="text-2xl" />
<span>{item.name}</span>
</a>


</motion.li>
))
}
</ul>












        </motion.div>
      )}
    </AnimatePresence>
  )
}
