import { PiInstagramLogoLight, PiWhatsappLogoLight, PiCloudLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import Image from "next/image";

export default function Footer() {
  const date = new Date()
  const year = date.getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-[#f2ead3] to-[#e8dfc0] pt-16 pb-8 px-4 md:px-6 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-16 -translate-y-full">
        <svg 
          className="w-full h-full"
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#f2ead3" 
            d="M0,0 C300,80 700,20 1440,80 L1440,120 L0,120 Z"
          ></path>
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full opacity-10">
        <div className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-green-400 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 rounded-full bg-yellow-400 mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
          {/* Logo e descrição */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
            <a 
              href='https://publidoceu.com' 
              aria-label="Ir para o site Publi do Céu"
              className="mb-6 transition-transform hover:scale-105 duration-300"
            >
              <Image 
                src={'https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560325/logo_e5ycmq.png'} 
                alt='Logo da Publi do Céu' 
                height="60" 
                width="60" 
                className='rounded-full shadow-lg '
              />
            </a>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              PUBLI DO CÉU <PiCloudLight className="text-blue-400" />
            </h2>
            <p className="text-gray-700 italic">Marketing com propósito, criatividade e fé.</p>
          </div>

          {/* Contato e redes sociais */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-6">Conecte-se conosco</p>
            
            <div className="flex justify-center gap-6">
              <a 
                href="https://instagram.com/publidoceu" 
                aria-label="Ir para o Instagram da Publi do Céu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-2xl text-pink-600 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-pink-100"
              >
                <PiInstagramLogoLight />
              </a>
              
              <a 
                href="https://wa.me/5575987055340" 
                aria-label="Ir para o WhatsApp da Publi do Céu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl text-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-100"
              >
                <PiWhatsappLogoLight />
              </a>
              
              <a 
                href="mailto:publidoceu@gmail.com" 
                aria-label="Enviar um email para a Publi do Céu"
                className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-2xl text-blue-600 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-100"
              >
                <CiMail />
              </a>
            </div>
            
            <p className="mt-6 text-gray-600">
              Respondemos em até 24h
            </p>
          </div>
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-700">
            Desenvolvido com 💙 por{" "}
            <a 
              href='https://marketilize.com.br/' 
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-600 hover:text-red-800 hover:underline transition-colors"
            >
              Marketilize
            </a> 
            {" "}© {year}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Publi do Céu - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}