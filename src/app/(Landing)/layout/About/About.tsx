import { QuoteIcon } from "lucide-react"

export default function About() {
  return (
    <main className="min-h-screen bg-[#d2542b]">
      {/* Seção 1: Quem Somos */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden" style={{ backgroundColor: "#d2542b" }} id="about">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black/30 via-transparent to-transparent transform -skew-x-12"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/30 via-transparent to-transparent transform skew-x-12"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='37' cy='23' r='1'/%3E%3Ccircle cx='23' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">QUEM SOMOS?</h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8 text-white text-xl leading-relaxed">
            <p className="text-balance font-light">
              Somos a <span className="font-semibold text-white">Publi do Céu</span>, uma agência de marketing que
              nasceu do desejo de unir criatividade e propósito, ajudando empresas a comunicarem sua mensagem de forma
              única e verdadeira.
            </p>

            <p className="text-balance font-light">
              Acreditamos que o marketing pode ser mais do que apenas vender: ele pode inspirar, conectar e transformar.
              Por isso, buscamos criar estratégias e conteúdos que expressem autenticidade, transmitam valores e gerem
              impacto real.
            </p>

            <p className="text-balance font-light">
              Somos cristãos e entendemos que tudo o que fazemos deve ser para a glória de Deus. Assim, cada campanha,
              cada arte e cada ideia são pensadas para refletir profissionalismo, excelência e amor.
            </p>

            <p className="text-balance font-light">
              O nosso objetivo é espalhar mensagens de verdade, através da comunicação. Porque acreditamos que, quando
              fazemos algo para Deus, a diferença é visível e transformadora.
            </p>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-start gap-4 bg-black/40 backdrop-blur-md rounded-xl px-8 py-6 border border-white/20 shadow-lg max-w-4xl">
              <QuoteIcon className="w-8 h-8 text-white/90 flex-shrink-0 mt-1" />
              <div>
                <blockquote className="text-white italic text-xl font-medium text-balance leading-relaxed">
                  "Quer comais, quer bebais, ou façais qualquer outra coisa, fazei tudo para a glória de Deus."
                </blockquote>
                <p className="text-white/80 text-sm mt-3 font-medium">(1 Coríntios 10:31)</p>
              </div>
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
            fill="#901c25" // cor da sessão abaixo
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>

      {/* Seção 2: Para Quem Somos */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden" style={{ backgroundColor: "#901c25" }}>
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black/30 via-transparent to-transparent transform -skew-x-12"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/30 via-transparent to-transparent transform skew-x-12"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='37' cy='23' r='1'/%3E%3Ccircle cx='23' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">PARA QUEM SOMOS?</h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8 text-white text-xl leading-relaxed">
            <p className="text-balance font-light">
              A <span className="font-semibold text-white">Publi do Céu</span> é para todos. Embora nossa essência seja
              marcada por valores cristãos, não somos uma agência exclusiva para a comunidade cristã.
            </p>

            <p className="text-balance font-light">
              Somos um espaço criativo que tem como missão acolher empresas, marcas e pessoas que desejam comunicar suas
              ideias com propósito e autenticidade. Aqui, cada cliente é visto de forma única.
            </p>

            <p className="text-balance font-light">
              O nosso <span className="font-semibold text-white">IDE</span> é o mais importante. Mais do que oferecer
              serviços de marketing, desejamos que cada projeto seja um reflexo da verdade, da esperança e do amor que
              vêm de Deus.
            </p>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-start gap-4 bg-black/40 backdrop-blur-md rounded-xl px-8 py-6 border border-white/20 shadow-lg max-w-4xl">
              <QuoteIcon className="w-8 h-8 text-white/90 flex-shrink-0 mt-1" />
              <div>
                <blockquote className="text-white italic text-xl font-medium text-balance leading-relaxed">
                  "Sejam sábios no modo de agir com os que são de fora; aproveitem bem o tempo e que a sua conversa seja
                  sempre agradável e temperada com sal, para que saibam como responder a cada um."
                </blockquote>
                <p className="text-white/80 text-sm mt-3 font-medium">(Colossenses 4:5-6)</p>
              </div>
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
            fill="white" // cor da sessão abaixo
            fillOpacity="1"
            d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </main>
  )
}
