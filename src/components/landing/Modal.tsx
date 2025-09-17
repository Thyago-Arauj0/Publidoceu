"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Gift, Sparkles } from "lucide-react"

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    instagram: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return; 
    }
    setIsLoading(true)
    try{
      const respostas = [
      formData.name,       // Pergunta 1: Nome completo
      formData.email,      // Pergunta 2: E-mail
      formData.phone,      // Pergunta 3: Telefone
      "Consultoria Gratuita", // Pergunta 4: O que deseja solicitar
      "Consultoria de Marketing Digital", // Pergunta 5: Descrição
      "Não especificado", // Pergunta 6: Prazo
      "Não especificado",  // Pergunta 7: Orçamento
      formData.city,       // Pergunta 8: Localização
      `Instagram do cliente: ${formData.instagram || 'Não informado'}` // Pergunta 9: Como nos encontrou + Instagram
      ];
      const response = await fetch('https://sendemail-publidoceu.vercel.app/enviar-formulario', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({respostas}),
      })
      const data = await response.json()

      if(!response.ok){
        throw new Error(data.message || 'Erro ao enviar formulário')
      }
      setIsOpen(false)

      alert("Formulário enviado com sucesso! Entraremos em contato em breve.")
    }catch(error){
      console.error("Erro ao enviar formulário:", error);
      alert("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.");
    }finally{
      setIsLoading(false)
    }

  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome completo é obrigatório";
      isValid = false;
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = "Por favor, informe seu nome completo";
      isValid = false;
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor, informe um e-mail válido";
      isValid = false;
    }

    // Validação do telefone
    if (!formData.phone.trim()) {
      newErrors.phone = "WhatsApp é obrigatório";
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Digite apenas números (10 ou 11 dígitos)";
      isValid = false;
    }

    // Validação da cidade
    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  

  if (!isOpen) return null

  return (
    <div className=" flex items-center justify-center p-4">


      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/65 bg-opacity-50 flex items-center justify-center p-4 z-50">
        {/* Modal Content */}
        <div className=" rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div
            className="relative p-6 text-white bg-[#1e3a5f] "
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Gift className="h-8 w-8" style={{ color: "white" }} />
              </div>
              <h2 className="text-2xl font-bold text-[#d35429] mb-2">Oferta Especial!</h2>
              <p className="text-[#faefdc] text-base">
                Receba uma consultoria GRATUITA de marketing digital personalizada para seu negócio!
              </p>
            </div>
          </div>

          <div className="p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[#4f2a11]">
                  Nome Completo *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#e2c9a5] rounded-md focus:outline-none focus:ring-2 focus:border-[#d4b14a]"
                  style={
                    {
                      "--tw-ring-color": "#d4b14a",
                    } as React.CSSProperties
                  }
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#4f2a11]">
                  E-mail *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#e2c9a5] rounded-md focus:outline-none focus:ring-2 focus:border-[#d4b14a]"
                  style={
                    {
                      "--tw-ring-color": "#d4b14a",
                    } as React.CSSProperties
                  }
                />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-[#4f2a11]">
                    WhatsApp *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#e2c9a5] rounded-md focus:outline-none focus:ring-2 focus:border-[#d4b14a]"
                    style={
                      {
                        "--tw-ring-color": "#d4b14a",
                      } as React.CSSProperties
                    }
                  />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-[#4f2a11]">
                    Cidade *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Sua cidade"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:border-[#d4b14a]"
                    style={
                      {
                        "--tw-ring-color": "#d4b14a",
                      } as React.CSSProperties
                    }
                  />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="instagram" className="block text-sm font-medium text-[#4f2a11]">
                  Instagram (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#844e22]">@</span>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    placeholder="seuinstagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-[#e2c9a5] rounded-md focus:outline-none focus:ring-2 focus:border-[#d4b14a]"
                    style={
                      {
                        "--tw-ring-color": "#d4b14a",
                      } as React.CSSProperties
                    }
                  />
                    {errors.instagram && <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>}
                </div>
              </div>

              <Button 
              type="submit" 
              name="btn"  
              id="meu-botao" 
              disabled={isLoading}
              className="w-full h-14 text-base text-white font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-[#e04b19] hover:bg-[#af411c]"
              >
                {isLoading ? "Enviando..." : "Quero Minha Consultoria Gratuita!"}
              </Button>

              <p className="text-xs text-[#844e22] text-center mt-4">
                Seus dados estão seguros conosco. Não enviamos spam.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
