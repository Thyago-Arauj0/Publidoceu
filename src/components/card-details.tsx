'use client'

import { useState, useEffect } from "react"
import { getCard } from "@/lib/CardApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, MessageSquare, User } from "lucide-react"
import { Card as CardType } from "@/lib/types/card"

interface CardDetailsProps {
  boardId: string
  cardId: string
}

export default function CardDetails({ boardId, cardId }: CardDetailsProps) {

const [cardData, setCardData] = useState<CardType>({} as CardType)

useEffect(() => {
    const bId = boardId 
    const cId = cardId

    const fetchCard = async () => {
      try {
        const data: CardType = await getCard(bId, cId);
        console.log("Card data:", data);
        setCardData(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setCardData({} as CardType);
      }
    };

    fetchCard();
}, [])


  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      in_progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-black",
      done: "bg-green-500 text-white",
      disapprove: "bg-red-500 text-white",
      aprovadas: "bg-green-600 text-white",
      reprovadas: "bg-red-600 text-white",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

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
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Detalhes do Card</h1>
          <p className="text-muted-foreground mt-2">Informações completas sobre o item selecionado</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{cardData.title}</CardTitle>
                  <Badge className={getStatusColor(cardData?.status)}>
                     {cardData?.status || "Carregando..."}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Responsável</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar>
                  {/* <AvatarImage src={cardData.usuario.avatar || "/placeholder.svg"} alt={cardData.usuario.name} /> */}
                  <AvatarFallback>
                    {cardData.board}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">{cardData.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Imagem</h3>
                <img
                  src={cardData.image || "/placeholder.svg"}
                  alt="Card illustration"
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Cronograma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(cardData.created_at)}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(cardData.updated_at)}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Data de Vencimento</p>
                  <p className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{cardData.due_date 
                        ? new Date(cardData.due_date).toLocaleDateString("pt-BR") 
                        : "Sem data"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 py-2">
                    {cardData.feedback?.text && (
                    <p className="text-muted-foreground">{cardData.feedback?.text}</p>
                    )}
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
