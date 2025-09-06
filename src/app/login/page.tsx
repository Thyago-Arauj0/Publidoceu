import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PubliDoCeu - Login",
  description: "Faça login para acessar o sistema",
}

export default function LoginPage() {

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Publi do Céu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Faça login para acessar o sistema
            </p>
          </div>
          <LoginForm />
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        Plataforma Desenvolvida por{" "}
        <a
          href="https://marketilize.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          DTeX Serviços Online LTDA
        </a>
      </footer>
    </div>
  )
}
