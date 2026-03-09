import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills"
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Projects from "./sections/Projects";
// import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import IntroAnimations from "./components/IntroAnimations";
import React from "react";

export default function App(){
  const [introDone , setIntroDone] = React.useState(false);
  return(
    <>
      {!introDone && <IntroAnimations onFinish={() => setIntroDone(true)} />}
      
      {introDone && (
        <div className= "relative gradient text-white">
            <CustomCursor/>
            {/* <ParticleBackground/> */}
            <Navbar/>
            <Home/>
            <About/>
            <Skills/>
            <Projects/>
            <Experience/>
            <Certifications/>
            <Contact/>
            <Footer/>
        </div>
    )
}
   </>
  )
  
}

    
