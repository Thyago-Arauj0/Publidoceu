'use client'

import style from './HeroSection.module.css';
import { gsap } from "gsap";
import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { MessageCircle, Calculator, ArrowRight, User } from "lucide-react"
import Image from 'next/image';

export default function HeroSection() {

const titleRef = useRef<HTMLHeadingElement | null>(null)
const subTitleRef = useRef<HTMLHeadingElement | null>(null)
const descriptionRef = useRef<HTMLParagraphElement | null>(null)
const spanRef = useRef<HTMLSpanElement | null>(null)
const containerRef = useRef<HTMLElement | null>(null)
const containerBtnRef = useRef<HTMLDivElement | null>(null)


  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
      if (titleRef.current) {
        setWidth(titleRef.current.offsetWidth);
      }
    }, []);


  useEffect(()=>{

    const span = spanRef.current
    if (!span) return; // sai se o elemento não existir


    const letras = span.textContent.split('');
    span.innerHTML = ''; 
    letras.forEach((letra) => {
      const letraSpan = document.createElement('span');
      letraSpan.textContent = letra;
      letraSpan.style.display = 'inline-block';
      letraSpan.style.opacity = "0";
      letraSpan.style.transform = 'translateY(20px)';
      if (letra === ' ') {
        letraSpan.style.width = '0.4em'; // espaço visível
        letraSpan.style.display = 'inline-block';
        letraSpan.innerHTML = '&nbsp;'; // espaço não colapsável
      }

      span.appendChild(letraSpan);
    });
      
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    const container = containerRef.current
    const title = titleRef.current
    const subTitle = subTitleRef.current
    const description = descriptionRef.current
    const containertBtn = containerBtnRef.current

    const letrasSpans = span.querySelectorAll('span');
    tl.fromTo(container,
      {opacity:0},
      {opacity:1, duration:1}).
    to(letrasSpans, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05
    }, "-=0.6")
    .fromTo(title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1},
      "-=0.6"
    )
    .fromTo(subTitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1},
      "-=0.6"
    )
    .fromTo(description,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7},
      "-=0.6"
    )
    .fromTo(containertBtn,
      {opacity:0, y:20},
      {opacity:1, y:0, duration: 0.7},
       "-=0.6"
     )
  }, [])


  return (

    <div>
      <section
        className={style.heroSection} id='hero'
        style={{
          backgroundImage: "url(/assets/background.webp)",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }} ref={containerRef}
      >
        <div className={style.overlay}></div>

          <div className={style.content}>
            <div className={style.logo} >
              <a href="https://publidoceu.com" aria-label="Ir para o site Publi do Céu">
                <Image src={'/assets/logo.png'} alt='Logo da Publi do Céu' height="80" width="80" className={style.logoImage} />
              </a>
              <span 
                  ref={spanRef} 
                  className='text-[white] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]'
                >
                  Agência de Marketing
              </span>
            </div>

            <div className={`${style.start} max-w-5xl`}>
                <div>
                  <div style={{ position: 'relative', display: 'inline-block' }} className='text-left'>                
                    <h1 className='text-6xl relative' ref={titleRef}>Do céu:</h1>
                    <h2 className='text-3xl relative' ref={subTitleRef}>O conteúdo é de outro mundo</h2>
                    <br />
                    <svg 
                      style={{ position: 'absolute', bottom: '-15px', left: '0' }} 
                      width={width} height="20"
                      viewBox={`0 0 ${width} 20`} fill="none" stroke="#d35429" strokeWidth="3">
                      <path d={`M0 10 Q ${width/4} 0, ${width/2} 10 T ${width} 10`} />
                    </svg>
                  </div>
                  <br />
                  <br />
                  <p ref={descriptionRef}>Marketing com propósito. Criatividade, fé e estratégia alinhadas com o seu negócio.</p>
                </div>
                <br />
                <br />
                <div className="flex flex-col items-center gap-4 w-full max-w-[300px] mx-auto md:mx-0" ref={containerBtnRef}>
                     {/* Botão de Orçamento - Primário */}
                    <Link href="/Questions" className="w-full cursor-pointer">
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-[#e04b19] hover:bg-[#af411c] text-white"
                      >
                        <Calculator className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Solicite um orçamento
                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>

                    {/* Botão do WhatsApp - Laranja */}
                    <Link
                      href="https://wa.me/5575987055340?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20um%20pouco%20mais%20sobre%20seus%20servi%C3%A7os%2C%20vim%20pelo%20site."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full cursor-pointer"
                    >
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-[#e04b19] hover:bg-[#af411c] text-white"
                      >
                        <MessageCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        Fale conosco
                        <span className="ml-auto text-xs bg-white text-green-800 px-2 py-1 rounded-full">
                          WhatsApp
                        </span>
                      </Button>
                    </Link>

                    {/* Botão Já sou cliente - Primário */}
                    <Link href="/login" className="w-full cursor-pointer">
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-[#e04b19] hover:bg-[#af411c] text-white"
                      >
                        <User className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Já sou cliente
                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                </div>
            </div>

            <div className='absolute -z-10 right-0'>
            </div>
          </div>

      </section>

      <div className="relative w-full -mt-18 md:-mt-24 lg:-mt-32 overflow-hidden">
        <svg
          className="w-full h-32 md:h-40 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="white" // cor da sessão abaixo
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
