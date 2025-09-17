
import type { Metadata } from "next"
import Contact from '../layout/Contact/Contact'
import HeroSection from '../layout/HeroSection/HeroSection'
import HeroSubMessage from '../layout/Metrics/Metrics'
import ServicesSection from '../layout/ServicesSection/ServicesSection'
import Works from '../layout/Works/Works'
import Modal from '@/components/landing/Modal'
import Header from '../layout/Header/Header'
import About from '../layout/About/About'
import Footer from '../layout/Footer/Footer'


export const metadata: Metadata = {
  title: "PubliDoCeu - Login",
  description: "Faça login para acessar o sistema",
}


export default function Landing(){

    return (

    <div className='overflow-hidden relative'>
        <div className='absolute h-[100%] w-[100%]'>
        <Modal/>
        </div>
        <Header/>
        <HeroSection />
        <HeroSubMessage/>
        <About/>
        <ServicesSection/>
        <Works/>
        <Contact/>
        <Footer/>
    </div>

    )
}