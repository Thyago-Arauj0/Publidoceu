"use client"

import { ExternalLink, Instagram, Users, Heart, TrendingUp, ArrowUp } from "lucide-react"
import Image from "next/image"



export default function Works() {

  const clients = [
    {
      name: "Doce Morena Brasil",
      handle: "@docemorenabrasil",
      link: "https://instagram.com/docemorenabrasil",
      logo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560320/docemorena_su2zpu.webp',
      photo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560323/imgdocemorena_wt5o7y.webp',
      description: "Diversos produtos",
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
      logo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560318/barrocas_elnurx.webp',
      photo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560321/imgbarrocas_xiaifo.webp',
      description: "Sorveteria e diversos",
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
      logo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560325/marguerita_zi1pqu.webp',
      photo: 'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560323/imgmarguerita_eiiiul.webp',
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
    <div className="bg-[#d2542b] text-white">
      <section id="works" className="w-full md:py-16 lg:py-20 bg-[#d2542b]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">RESULTADOS QUE <span className="text-black font-extrabold">TRANSFORMAM</span></h2>
              <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-4xl md:text-center md:mx-auto space-y-4 md:p-0 px-4">
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Já ajudamos negócios locais e digitais a se destacarem com conteúdos únicos, artes profissionais e uma
                comunicação alinhada com seus princípios.
              </p>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Confira abaixo os resultados que tivemos o privilégio de entregar — todos alcançados com dedicação,
                estratégia e, acima de tudo, para a glória de Deus.
              </p>
            </div>

            {/* Cards de clientes com métricas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clients.map((client, index) => (
                <a
                  key={index}
                  href={client.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg 
                            hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 
                            flex flex-col cursor-pointer"
                >
                  {/* IMAGEM */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={client.photo}
                      alt={`Trabalho realizado para ${client.name}`}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Logo e informações básicas */}
                    <div className="flex items-center mb-5">
                      <Image
                        src={client.logo}
                        width={56}
                        height={56}
                        alt={`Logo ${client.name}`}
                        className="rounded-full border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg'
                        }}
                      />
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 text-base">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.description}</p>
                      </div>
                    </div>

                    {/* Dashboard de métricas */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Crescimento em 3 meses
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
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

                    {/* Handle */}
                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-blue-600 font-medium">
                      <Instagram className="w-4 h-4" />
                      <span>{client.handle}</span>
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
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

