import { Palette, Share2, PenTool, Lightbulb, Code, CheckCircle, Users, Trophy, Zap, Video } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ServicesSection() {


  return (
    <section
      id="services"
      className="w-full pt-16 md:pt-5 relative overflow-hidden"
   
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-full h-24 opacity-20 transform rotate-12 scale-150"
          style={{ backgroundColor: "#d35429" }}
        ></div>
        <div
          className="absolute bottom-1/3 -right-32 w-full h-32 opacity-25 transform -rotate-12 scale-150"
          style={{ backgroundColor: "#195fb9" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Seção de Serviços Original */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">O QUE NÓS OFERECEMOS?</h2>
            <div className="w-24 h-1 bg-black/80 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {/* Serviço 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `#3B82F6` }}
                >
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" >
                  Identidade Visual
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Criamos marcas únicas que refletem a essência do seu negócio
                </p>
              </div>
            </div>

            {/* Serviço 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `#3B82F6` }}
                >
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" >
                  Social Media
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Gestão completa das suas redes sociais com conteúdo estratégico
                </p>
              </div>
            </div>

            {/* Serviço 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `#3B82F6` }}
                >
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" >
                  Design Gráfico
                </h3>
                <p className="text-gray-600 leading-relaxed">Peças gráficas que comunicam com impacto e elegância</p>
              </div>
            </div>

            {/* Serviço 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `#3B82F6` }}
                >
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" >
                  Campanhas Criativas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estratégias inovadoras que conectam sua marca ao público
                </p>
              </div>
            </div>

            {/* Serviço 5 - Novo: Desenvolvimento de Sites */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `#3B82F6` }}
                >
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" >
                  Desenvolvimento de Sites
                </h3>
                <p className="text-gray-600 leading-relaxed">Sites modernos, responsivos e otimizados para conversão</p>
              </div>
            </div>

            {/* Serviço 6 - Produção de Vídeos */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `#3B82F6` }}
                >
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">
                  Produção de Vídeos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Criação e edição de vídeos criativos que potencializam o alcance da sua marca
                </p>
              </div>
            </div>

          </div>

          <div className="text-center mb-16">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofereçemos um serviço personalizado e dedicado para fazer sua marca se destacar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {/* Benefício 1 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `#3B82F6` }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">Todos os nossos projetos passam por rigoroso controle de qualidade</p>
            </div>

            {/* Benefício 2 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `#3B82F6` }}
              >
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Atendimento Personalizado
              </h3>
              <p className="text-gray-600">Cuidado individual e atenção aos detalhes em cada projeto</p>
            </div>

            {/* Benefício 3 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `#3B82F6` }}
              >
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Qualidade Comprovada
              </h3>
              <p className="text-gray-600">Cada projeto é tratado com dedicação e profissionalismo</p>
            </div>

            {/* Benefício 4 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `#3B82F6` }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Agilidade
              </h3>
              <p className="text-gray-600">Prazos cumpridos e entregas dentro do cronograma estabelecido</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-8 md:p-12 mb-24"
            style={{ background: `linear-gradient(135deg, #f2ead3 0%, rgba(211, 84, 41, 0.1) 100%)` }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Nosso Processo
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Um método testado e aprovado para garantir os melhores resultados
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Processo 1 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: `#3B82F6`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      01
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Briefing
                  </h3>
                  <p className="text-gray-600">
                    Entendemos suas necessidades e objetivos através de uma conversa detalhada
                  </p>
                </div>
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-0.5 transform -translate-x-8"
                  style={{ background: `linear-gradient(90deg, #3B82F6 0%, #1e3a5f 100%)` }}
                ></div>
              </div>

              {/* Processo 2 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: `#3B82F6`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      02
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Estratégia
                  </h3>
                  <p className="text-gray-600">Desenvolvemos uma estratégia personalizada para o seu projeto</p>
                </div>
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-0.5 transform -translate-x-8"
                  style={{ background: `linear-gradient(90deg, #3B82F6 0%, #1e3a5f 100%)` }}
                ></div>
              </div>

              {/* Processo 3 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: `#3B82F6`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      03
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Criação
                  </h3>
                  <p className="text-gray-600">Nossa equipe coloca a mão na massa e desenvolve soluções criativas</p>
                </div>
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-0.5 transform -translate-x-8"
                  style={{ background: `linear-gradient(90deg, #3B82F6 0%, #1e3a5f 100%)` }}
                ></div>
              </div>

              {/* Processo 4 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: `#3B82F6`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      04
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Entrega
                  </h3>
                  <p className="text-gray-600">Apresentamos o resultado final e fazemos os ajustes necessários</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full -mt-18 md:-mt-24 lg:-mt-32 overflow-hidden">
        <svg
          className="w-full h-32 md:h-40 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#901c25" // cor da sessão abaixo
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}