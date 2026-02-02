"use client"

import { MessageCircle, Instagram, Mail, MapPin, Phone, Cloud } from "lucide-react"

export default function Contact() {

  const methods = [
    {
      title: "WhatsApp",
      icon: Phone,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "https://wa.me/5575987055340",
      text: "(75) 98705-5340",
    },
    {
      title: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      bg: "bg-pink-50",
      link: "https://instagram.com/publidoceu",
      text: "@publidoceu",
    },
    {
      title: "E-mail",
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "mailto:publidoceu@gmail.com",
      text: "publidoceu@gmail.com",
    },
    {
      title: "Localização",
      icon: MapPin,
      color: "text-orange-600",
      bg: "bg-orange-50",
      text: "Região Sisaleira, Bahia",
    },
  ];

  return (
    <div className="relative">
      {/* Nuvem decorativa simplificada */}
      <div className="absolute -top-6 left-0 w-full z-10 opacity-80">
        <div className="flex justify-center">
          <Cloud className="text-[#f2ead3] w-12 h-12" />
          <Cloud className="text-[#f2ead3] w-10 h-10 ml-12 -mt-2" />
        </div>
      </div>

      <section
        id="contact"
        className="w-full py-16 relative overflow-hidden" // Padding reduzido
        style={{
          background: "linear-gradient(135deg, #f2ead3 0%, #f8f4e9 100%)",
        }}
      >      
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12"> {/* Espaço reduzido */}
            <div className="space-y-4"> {/* Espaço reduzido */}
              <h2  className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900"> {/* Tamanho reduzido */}
                Ainda está em <span className="text-[#d35429]">dúvida</span>?
              </h2>
              <p  className="text-lg md:text-xl text-gray-700 font-medium"> {/* Estilo simplificado */}
                Fale conosco e vamos fazer seu projeto decolar
              </p>
            </div>

            <div className="flex justify-center" >
              <a
                href="https://wa.me/5575987055340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full text-base transition-colors duration-300 shadow-md" // Estilo simplificado
              >
                <MessageCircle className="w-5 h-5" /> {/* Ícone menor */}
                Entre em contato
              </a>
            </div>

            <div className="space-y-8"> {/* Espaço reduzido */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300 opacity-30"></div> {/* Opacidade reduzida */}
                </div>
                <div className="relative flex justify-center">
                  <h3 className="px-4 bg-[#f8f4e9] text-xl font-bold text-gray-800"> {/* Tamanho reduzido */}
                    Outras formas de contato
                  </h3>
                </div>
              </div>

              {/* SEÇÃO DOS CARDS */}
              <div className="grid md:grid-cols-2 gap-6"> {/* Espaço reduzido */}
                {methods.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100" // Estilo simplificado
                    >
                      <div className="flex items-center gap-4"> {/* Espaço reduzido */}
                        <div
                          className={`w-12 h-12 ${m.bg} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${m.color}`} /> {/* Ícone menor */}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 mb-1 text-base">{m.title}</h4> {/* Tamanho reduzido */}
                          {m.link ? (
                            <a
                              href={m.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${m.color} hover:opacity-80 transition-colors font-medium`}
                            >
                              {m.text}
                            </a>
                          ) : (
                            <p className="text-gray-700 font-medium">{m.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-6 border border-gray-100 shadow-sm"> {/* Estilo simplificado */}
              <p className="text-lg font-semibold text-gray-800 leading-relaxed"> {/* Tamanho reduzido */}
                Estamos prontos para transformar sua visão em realidade. Entre em contato conosco e vamos juntos criar
                algo <span className="text-[#d35429]">extraordinário</span> para sua marca!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}