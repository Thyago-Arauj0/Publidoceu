
import type { Metadata } from "next"
import Contact from '../layout/Contact/Contact'
import HeroSection from '../layout/HeroSection/HeroSection'
import HeroSubMessage from '../layout/Metrics/Metrics'
import ServicesSection from '../layout/ServicesSection/ServicesSection'
import Works from '../layout/Works/Works'
import Modal from '@/components/landing/Modal'
import Header from '../layout/Header/Header'
import About from '../layout/About/About'
import ForWhom from '../layout/ForWhom/ForWhom'
import Footer from '../layout/Footer/Footer'


export const metadata: Metadata = {
  title: "Publi do Céu | Empresa de Marketing Digital",
  description: "Agência de Marketing Digital especializada em impulsionar sua presença online e alcançar resultados extraordinários.",
}


export default function Landing(){

    return (

    <div className='overflow-hidden relative'>
        <div className='absolute'>
        <Modal/>
        </div>
        <Header/>
        <HeroSection />
        <HeroSubMessage/>
        <About/>
        <ServicesSection/>
        <ForWhom/>
        <Works/>
        <Contact/>
        <Footer/>
    </div>

    )
}