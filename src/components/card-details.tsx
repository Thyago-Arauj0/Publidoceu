'use client'

import { useState, useEffect } from "react"
import { getCard } from "@/lib/Card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CalendarDays, Clock, MessageSquare, User } from "lucide-react"
import { Card as CardType } from "@/lib/types/cardType"
import { getUser } from "@/lib/User"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Footer from "./footer"

interface CardDetailsProps {
  boardId: string
  cardId: string
}

export default function CardDetails({ boardId, cardId }: CardDetailsProps) {

const [cardData, setCardData] = useState<CardType>({} as CardType)
const [user, setUser] = useState<string>('')
const router = useRouter()

useEffect(() => {
    const bId = boardId 
    const cId = cardId

    const fetchCard = async () => {
      try {
        const data: CardType = await getCard(bId, cId);
        setCardData(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setCardData({} as CardType);
      }
    };

    const fetchUser = async () => {
      try {
        const data = await getUser(bId);
        setUser(data.name);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };


    fetchCard();
    fetchUser()
}, [])


  const getStatusLabel = (status: string) => {
    const labels = {
      todo: "A Fazer",
      in_progress: "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
      disapprove: "Reprovado",
      aprovadas: "Aprovado",
      reprovadas: "Reprovado",
    } as const

    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      in_progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-black",
      done: "bg-green-500 text-white",
      disapprove: "bg-red-500 text-white",
      aprovadas: "bg-green-600 text-white",
      reprovadas: "bg-red-600 text-white",
    } as const

    return colors[status as keyof typeof colors] || "bg-gray-500 text-white"
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push(`/clients/${boardId}/`)} className="cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Voltar</h2> */}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl min-h-screen">
        <Card className="flex items-start justify-between border-none shadow-none">
          <CardContent className="space-y-2">
            <CardTitle className="text-2xl font-bold text-[#1e3a5f]">
              {cardData.title}
            </CardTitle>

            <div className="flex gap-2 items-center">
              <h3 className="text-[#941c26] font-medium">Status:</h3>
              <Badge
                className={`${getStatusColor(
                  cardData?.status
                )} bg-[#d35429] text-white px-3 py-1 rounded-full`}
              >
                {getStatusLabel(cardData?.status) || "Carregando..."}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <h3 className="text-[#1e3a5f] font-medium">Cliente:</h3>
              <User className="h-4 w-4 text-[#d35429]" />
              <span className="text-[#941c26] font-semibold">{user}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-none rounded-xl">
            <CardHeader>
              <div>
                {cardData.image && /\.(mp4|webm|ogg)(\?.*)?$/i.test(cardData.image) ? (
                  <video
                    src={cardData.image}
                    controls
                    className="w-full rounded-lg max-h-[90vh] shadow-none border-none"
                  />
                ) : (
                  <img
                    src={cardData.image || "/placeholder.svg"}
                    alt="Card illustration"
                    className="w-full rounded-lg border-none max-h-[90vh] shadow-none"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-[#1e3a5f]">Descrição</h3>
                <p className="text-[#1e3a5f]/80 leading-relaxed">
                  {cardData.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <Clock className="h-5 w-5 text-[#d35429]" />
                <span>Cronograma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#941c26]">
                    Data de Criação
                  </p>
                  <p className="flex items-center space-x-2 text-[#1e3a5f]">
                    <CalendarDays className="h-4 w-4 text-[#d35429]" />
                    <span>{formatDate(cardData.created_at)}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#941c26]">
                    Última Atualização
                  </p>
                  <p className="flex items-center space-x-2 text-[#1e3a5f]">
                    <Clock className="h-4 w-4 text-[#d35429]" />
                    <span>{formatDate(cardData.updated_at)}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#941c26]">
                    Data de Vencimento
                  </p>
                  <p className="flex items-center space-x-2 text-[#1e3a5f]">
                    <CalendarDays className="h-4 w-4 text-[#d35429]" />
                    <span>
                      {cardData.due_date
                        ? new Date(cardData.due_date).toLocaleDateString("pt-BR")
                        : "Sem data"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <MessageSquare className="h-5 w-5 text-[#d35429]" />
                <span>Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-[#941c26] pl-4 py-2 bg-white rounded-md">
                  {cardData.feedback?.text && (
                    <p className="text-[#1e3a5f]/80">{cardData.feedback?.text}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer/>

    </div>
  )
}
