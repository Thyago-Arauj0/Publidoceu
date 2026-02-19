import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Publi do Céu | Agência de Marketing Digital Criativa e Estratégica",
  description: "A Publi do Céu é uma agência de marketing digital especializada em campanhas criativas, tráfego pago, social media e branding. Conteúdo de outro mundo!",
  keywords: [
    "marketing digital",
    "agência criativa",
    "social media",
    "tráfego pago",
    "branding",
    "conteúdo",
    "publi do céu",
    "estratégias digitais",
    "agência de publicidade"
  ],
  authors: [{ name: "Publi do Céu" }],
  creator: "Publi do Céu",
  robots: "index, follow",
  icons: {
    icon: "/logo.ico",
  },
  metadataBase: new URL("https://www.publidoceu.com.br/"),
  openGraph: {
    type: "website",
    url: "https://www.publidoceu.com.br/",
    title: "Publi do Céu | Agência de Marketing Digital Criativa e Estratégica",
    description: "Transformamos ideias em campanhas de sucesso com criatividade, estratégia e inovação.",
    siteName: "Publi do Céu",
    locale: "pt_BR",
    images: [
      {
        url: "https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560325/logo_e5ycmq.png",
        width: 1200,
        height: 630,
        alt: "Publi do Céu - Marketing Digital"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Publi do Céu | Marketing Digital Criativo",
    description: "Do Céu: o conteúdo é de outro mundo. Estratégias digitais que elevam sua marca.",
    images: ["https://res.cloudinary.com/dxmlji5j9/image/upload/v1769560325/logo_e5ycmq.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W9FMGZHJ');`,
          }}
        />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Publi do Céu",
              "url": "https://www.publidoceu.com.br",
              "logo": "https://www.publidoceu.com.br/public/images/logo.png",
              "description": "Agência de marketing digital especializada em conteúdo criativo, branding, social media e performance.",
              "sameAs": [
                "https://www.instagram.com/publidoceu"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-75-9134-4379",
                "contactType": "customer support",
                "areaServed": "BR",
                "availableLanguage": ["Portuguese"]
              }
            })
          }}
        />

        {/* Google Analytics gtag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4HSHG1SRY5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4HSHG1SRY5');
            `,
          }}
        />
      </head>

      <body className="antialiased bg-gray-100">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W9FMGZHJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {children}
      </body>
    </html>
  );
}