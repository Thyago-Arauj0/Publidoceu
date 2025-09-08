import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: ".: Publi do Céu | Sistema de gestão de conteúdo",
  description: "Sistema de gestão PubliDoCéu",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className='antialiased bg-gray-100'
      >
        {children}
      </body>
    </html>
  );
}
