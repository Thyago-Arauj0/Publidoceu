import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import { User } from "lucide-react"

export const metadata: Metadata = {
  title: "Publi do Céu - Login",
  description: "Faça login para acessar o sistema",
}

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-[#2d558a] flex flex-col justify-between bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">

      <main className="flex flex-1 items-center justify-center px-4 ">
        <div className="w-full max-w-md bg-white shadow-none dark:bg-gray-800  border-gray-100 border-2 rounded py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#1e3a5f]">
              <User className="h-10 w-10"/>
              <h1 className="text-3xl font-bold text-[#1e3a5f]">
                Publi do Céu 
              </h1>
            </div>
            <p className="text-foreground dark:text-gray-400 mt-2">
              Faça login para acessar o sistema
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer/>
    </div>
  )
}
