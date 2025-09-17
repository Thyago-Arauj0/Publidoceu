'use client'

import AnimatedBackground from '@/components/landing/AnimatedBackground';
import { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { DollarSign, SignalHigh, Repeat, Smile } from "lucide-react"

const metricsData = [
  { label: "Faturamento", value: "300%", icon: <DollarSign className="w-6 h-6 text-green-600" />, color: "text-green-600" },
  { label: "Alcance", value: "250%", icon: <SignalHigh className="w-6 h-6 text-blue-600" />, color: "text-blue-600" },
  { label: "Conversão", value: "180%", icon: <Repeat className="w-6 h-6 text-purple-600" />, color: "text-purple-600" },
  { label: "Satisfação", value: "95%", icon: <Smile className="w-6 h-6 text-[#d35429]" />, color: "text-[#d35429]" },
]

export default function HeroSubMessage() {
  const titleRef = useRef(null)
  const chartRef = useRef(null)
  const areaDescriptionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)

            let start = null
            const duration = 800

            const animate = (timestamp) => {
              if (!start) start = timestamp
              const progress = Math.min((timestamp - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)

              setAnimationProgress(eased * 100)

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (chartRef.current) observer.observe(chartRef.current)

    return () => observer.disconnect()
  }, [])

  // Valores animados baseados no progresso
  const currentGrowthValue = (75 * animationProgress) / 100
  const remainingValue = 100 - currentGrowthValue

  const animatedData = [
    {
      name: "Crescimento Atual",
      value: currentGrowthValue,
      color: "url(#growthGradient)",
    },
    {
      name: "Potencial Restante",
      value: remainingValue,
      color: "#E5E7EB",
    },
  ]

  const currentGrowth = Math.round(currentGrowthValue)

  return (
    <div>
      <section className="w-full pt-0 md:pt-5 relative ">
        <div className=" mx-auto">
          <div className=" mx-auto ">
            <div className="space-y-16 py-5">
              <div className="md:text-center text-left px-4 md:p-0 space-y-4">
                <h2
                  ref={titleRef}
                  className="text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-[1000px] mx-auto "
                >
                  Com fé e estratégia, os resultados aparecem. Aqui está o que entregamos na prática:
                </h2>
                <p className="text-gray-600 dark:text-gray-600 text-lg">Resultados comprovados através de estratégia</p>
              </div>

              <div ref={chartRef} className="relative flex justify-center items-center w-full p-8">
                <div className="relative w-full max-w-5xl">
                  <div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Gráfico Circular - Container com altura fixa */}
                      <div className="relative flex justify-center">
                        <div className="relative" style={{ width: '320px', height: '320px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <defs>
                                <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#f2ead3" /> 
                                  <stop offset="30%" stopColor="#d35429" />
                                  <stop offset="70%" stopColor="#3B82F6" />
                                  <stop offset="100%" stopColor="#1e40af" />
                                </linearGradient>
                              </defs>

                              <Pie
                                data={animatedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                startAngle={90}
                                endAngle={450}
                                dataKey="value"
                                stroke="none"
                                isAnimationActive={false} // ⭐ DESATIVEI a animação do Recharts
                              >
                                {animatedData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color}
                                    stroke="none"
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          
                          {/* Centro do gráfico */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-5xl font-bold text-blue-500 dark:text-[#1e3a5f] mb-2">{currentGrowth}%</div>
                            <div className="text-gray-600 dark:text-gray-400 text-center">
                              <div className="font-semibold">Crescimento</div>
                              <div className="text-sm">Alcançado</div>
                            </div>
                          </div>
                        </div>

                        {/* Decorativos do gráfico */}
                        <div className="absolute -top-4 -right-4 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-bounce"></div>
                        <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-purple-500 rounded-full opacity-40 animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 -right-8 w-3 h-3 bg-green-500 rounded-full opacity-35 animate-ping delay-500"></div>
                      </div>

                      {/* Métricas */}
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-gray-800 mb-6">O que nossos números dizem</h4>

                        <div className="grid gap-4">
                          {metricsData.map((metric, index) => (
                            <div
                              key={metric.label}
                              className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                              style={{
                                transform: isVisible ? "translateX(0)" : "translateX(50px)",
                                opacity: isVisible ? 1 : 0,
                                transitionDelay: `${index * 100}ms`,
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <span>{metric.icon}</span>
                                <span className="font-semibold text-gray-700 ">{metric.label}</span>
                              </div>
                              <div className={`text-2xl font-bold ${metric.color}`}>+{metric.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorativos externos */}
                  <div className="absolute -top-6 left-1/4 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
                  <div className="absolute -bottom-6 right-1/4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
                </div>
              </div>

              <div ref={areaDescriptionRef} className="space-y-8 md:text-center text-left px-4 md:p-0 ">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  Você não precisa gritar para ser notado... com a estratégia certa, o seu nome alcança quem precisa te
                  encontrar.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  Vamos elevar sua marca com estratégia, beleza e sentido.
                </p>
                <p className="text-2xl md:text-3xl font-extrabold leading-relaxed max-w-3xl mx-auto">
                  "Porque quando você se posiciona com clareza, o faturamento é consequência e o impacto é duradouro."
                </p>
              </div>
            </div>

            <div className="flex justify-start w-full flex-wrap py-20 ">
              <AnimatedBackground />
            </div>
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
            fill="#d2542b"
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}