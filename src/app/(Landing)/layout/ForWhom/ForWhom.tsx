import { QuoteIcon } from "lucide-react"

export default function ForWhon() {
  return (
    <main className="min-h-screen relative bg-[#901c25]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/dxmlji5j9/image/upload/v1769962953/online-networking-handshake-marketing-remixed-media-background_e7kkgi.png)",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
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
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">PARA QUEM SOMOS?</h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8 text-white text-xl leading-relaxed">
            <p className="text-balance text-2xl font-light">
              A <span className="font-semibold text-white">Publi do Céu</span> é para todos. Embora nossa essência seja
              marcada por valores cristãos, não somos uma agência exclusiva para a comunidade cristã.

              Somos um espaço criativo que tem como missão acolher empresas, marcas e pessoas que desejam comunicar suas
              ideias com propósito e autenticidade. Aqui, cada cliente é visto de forma única.
  
              O nosso <span className="font-semibold text-white">IDE</span> é o mais importante. Mais do que oferecer
              serviços de marketing, desejamos que cada projeto seja um reflexo da verdade, da esperança e do amor que
              vêm de Deus.
            </p>
          </div>

          <div className="mt-12 max-w-[600px] mx-auto text-center">
            <div className="inline-flex items-start gap-4 rounded-xl py-6 max-w-4xl">
              <div>
                <blockquote className="text-white italic text-xl leading-relaxed">
                  " Sejam sábios no modo de agir com os que são de fora; aproveitem bem o tempo e que a sua conversa seja
                  sempre agradável e temperada com sal, para que saibam como responder a cada um. "
                </blockquote>
                <p className="text-white/80 text-sm mt-3 font-medium">(Colossenses 4:5-6)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="relative w-full overflow-hidden">
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
    </main>
  )
}
