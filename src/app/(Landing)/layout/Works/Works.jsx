"use client"

import { ExternalLink, Instagram, Users, Heart, TrendingUp, ArrowUp } from "lucide-react"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export default function Works() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRefs = useRef([])
  const clientCardsRef = useRef([])
  const likesImgRef = useRef(null)
  const metricRefs = useRef([])

  const addToRefs = (refArr, el) => {
    if (el && !refArr.current.includes(el)) {
      refArr.current.push(el)
    }
  }

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Animação para a imagem de likes
      gsap.from(likesImgRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        scrollTrigger: {
          trigger: likesImgRef.current,
          start: "top 80%",
        }
      })

      // Animação para o título
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.7,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        }
      })

      // Animação para as descrições
      gsap.from(descriptionRefs.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: descriptionRefs.current[0],
          start: "top 80%",
        }
      })

      // Animação para os cards de clientes
      gsap.from(clientCardsRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      })

      // Animação para as métricas (entrada escalonada)
      gsap.from(metricRefs.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

const clients = [
  {
    name: "Doce Morena Brasil",
    handle: "@docemorenabrasil",
    link: "https://instagram.com/docemorenabrasil",
    logo: '/assets/docemorena.webp',
    photo: '/assets/imgdocemorena.webp',
    description: "Doces artesanais",
    metrics: {
      followers: { value: "20K", growth: "+15%" }, // de +215% para algo mais realista
      engagement: { value: "8.7%", growth: "+12%" },
      reach: { value: "1.221M", growth: "+18%" }
    }
  },
  {
    name: "Doce Morena Barrocas",
    handle: "@docemorenabarrocas",
    link: "https://instagram.com/docemorenabarrocas",
    logo: '/assets/barrocas.webp',
    photo: '/assets/imgbarrocas.webp',
    description: "Confeitaria regional",
    metrics: {
      followers: { value: "2K", growth: "+10%" },
      engagement: { value: "12.3%", growth: "+8%" },
      reach: { value: "139K", growth: "+12%" }
    }
  },
  {
    name: "Pizzaria Margherita",
    handle: "@pizzariamargherita_",
    link: "https://instagram.com/pizzariamargherita_",
    logo: '/assets/marguerita.webp',
    photo: '/assets/imgmarguerita.webp',
    description: "Pizzas artesanais",
    metrics: {
      followers: { value: "10K", growth: "+13%" },
      engagement: { value: "10.5%", growth: "+10%" },
      reach: { value: "51K", growth: "+11%" }
    }
  },
]

  // Componente para exibir métricas
  const MetricCard = ({ icon, title, value, growth }) => (
    <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center text-center">
      <div className="text-blue-500 mb-2">{icon}</div>
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="font-bold text-gray-900 text-sm mb-1">{value}</div>
      <div className="flex items-center text-xs text-green-600 font-medium">
        <ArrowUp className="w-3 h-3 mr-1" />
        {growth}
      </div>
    </div>
  )

  return (
    <div className="bg-[#1e3a5f] text-white">
      <section id="works" ref={containerRef} className="w-full md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Cabeçalho */}
            <div className="md:text-center text-left px-4 md:p-0">
              <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold tracking-tight">
                Resultados que <span className="text-blue-300">transformam</span>
              </h2>
            </div>

            <div className="max-w-4xl md:text-center md:mx-auto space-y-4 md:p-0 px-4">
              <p ref={el => addToRefs(descriptionRefs, el)} className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Já ajudamos negócios locais e digitais a se destacarem com conteúdos únicos, artes profissionais e uma
                comunicação alinhada com seus princípios.
              </p>
              <p ref={el => addToRefs(descriptionRefs, el)} className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Confira abaixo os resultados que tivemos o privilégio de entregar — todos alcançados com dedicação,
                estratégia e, acima de tudo, para a glória de Deus.
              </p>
            </div>

            {/* Cards de clientes com métricas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" ref={el => clientCardsRef.current = el}>
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Imagem de capa */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={client.photo}
                      alt={`Trabalho realizado para ${client.name}`}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Logo e informações básicas */}
                    <div className="flex items-center mb-4">
                      <Image
                        src={client.logo}
                        width={50}
                        height={50}
                        alt={`Logo ${client.name}`}
                        className="rounded-full border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg'
                        }}
                      />
                      <div className="ml-3">
                        <h3 className="font-bold text-gray-900 text-sm">{client.name}</h3>
                        <p className="text-xs text-gray-600">{client.description}</p>
                      </div>
                    </div>

                    {/* Dashboard de métricas */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Crescimento em 3 meses
                      </h4>
                      <div className="grid grid-cols-3 gap-2" ref={el => addToRefs(metricRefs, el)}>
                        <MetricCard
                          icon={<Users className="w-4 h-4" />}
                          title="Seguidores"
                          value={client.metrics.followers.value}
                          growth={client.metrics.followers.growth}
                        />
                        <MetricCard
                          icon={<Heart className="w-4 h-4" />}
                          title="Engajamento"
                          value={client.metrics.engagement.value}
                          growth={client.metrics.engagement.growth}
                        />
                        <MetricCard
                          icon={<TrendingUp className="w-4 h-4" />}
                          title="Alcance"
                          value={client.metrics.reach.value}
                          growth={client.metrics.reach.growth}
                        />
                      </div>
                    </div>

                    {/* Link para Instagram */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <a
                        href={client.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>{client.handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Imagem de destaque */}
            <div className="flex justify-center">
              <div ref={likesImgRef}>
                <Image
                  src="/assets/likes.webp"
                  alt="Trabalhos realizados"
                  width={180}
                  height={180}
                  className="object-contain w-full max-w-[120px] md:max-w-[180px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transição para a próxima seção */}
      <div className="relative w-full overflow-hidden">
        <svg
          className="w-full h-32 md:h-40 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#f2ead3"
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}