import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills"
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Projects from "./sections/Projects";

export default function App(){
    return(
        <div>
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
    

    
