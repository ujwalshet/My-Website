import { useState, useEffect, useRef } from "react";
import OverlayMenu from "./OverlayMenu";
import Logo from "../assets/Logo.png";
import { FiMenu } from "react-icons/fi";



export default function Navbar(){
  const [menuOpen , setMenuOpen] = useState(false);
  const [visible , setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [forceVisible , setForceVisible] = useState(false);

const lastScrollY = useRef(0);
const timerId = useRef(null);

useEffect(() => {
  const homeSection = document.querySelector("#home");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if(entry.isIntersecting){
        setForceVisible(true);
        setVisible(true);
      }else{
        setForceVisible(false);
      }
    },
    {threshold: 0.1}
  )

  if(homeSection) observer.observe(homeSection);
  return () => {
    if (homeSection) observer.unobserve(homeSection);
  }
}, [])

useEffect(() => {
  const handleScroll = () => {
    if (forceVisible){
      setVisible(true);
      return
    }

    const currentScrollY = window.scrollY;
    if(currentScrollY > lastScrollY.current){
      setVisible(false)
    } else {
      setVisible(false);
    }

    if(timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      setVisible(false);
    }, 3000)

    lastScrollY.current = currentScrollY;
  }

  window.addEventListener("scroll", handleScroll, {passive:true})
return () => {
  window.removeEventListener("scroll", handleScroll)
  if(timerId.current) clearTimeout(timerId.current);
}
}, [forceVisible])



  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return(
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "bg-black bg-opacity-80 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        
        <a href="#home" className="flex items-center space-x-2 group">
          <img src={Logo} alt="logo" className="w-12 h-12 hover:scale-110 transition-transform duration-300" />
          <div className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white bg-clip-text text-transparent hidden sm:block transition-all duration-300">
            Cloud Solutions
          </div>
        </a>

        <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <button onClick={() => setMenuOpen(true)}
            className="text-white text-3xl focus:outline-none hover:scale-110 transition-transform duration-200"
            aria-label="Open Menu">
           <FiMenu />
        </button>
        </div>

    <div className="hidden lg:block">
  <a href="#contact" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse">
    Reach Out
  </a>
</div>



      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}  />
    </>
  )

}
