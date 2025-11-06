"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { loginUser } from "@/lib/services/AuthService"
import Cookies from "js-cookie"
import ModalError from "./others/modal-error"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      setIsLoading(false)
      return
    }

    try {

        const result = await loginUser({ email, password })

        if (result.userType === "admin") {
          router.push("/dashboard")
          // Cookies.set("isAdmin", "true", { expires: 7 })
        }else if(result.userType === "client"){
          const clientId = `${result.user.id}`
          // Cookies.set("isAdmin", "false", { expires: 7 })
          // Cookies.set("userId", clientId, { expires: 7 })
          router.push(`/client/${clientId}`)
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
        setError(error.message)
          } else {
        setError("Erro ao logar usuário")
        }
       setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <Card className="w-full border-0 shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full cursor-pointer disabled:cursor-not-allowed bg-[#d35429] hover:bg-[#aa3f1c]" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </div>
            )}
          </Button>
        </form>
      </CardContent>


    </Card>

      <ModalError
        open={isErrorModalOpen}
        setIsErrorModalOpen={setIsErrorModalOpen}
        error={error}
      />
    </>
  )
}
