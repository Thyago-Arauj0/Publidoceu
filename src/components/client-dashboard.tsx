"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCards } from "@/lib/CardApi"
import { logoutUser } from "@/lib/AuthApi"
import { getUser } from "@/lib/UserApi"
import { Card as CardType} from "@/lib/types/card"


interface Props {
  boardId: string; // id do board do client
}


export function ClientDashboard({ boardId }: Props) {
  const [cards, setCards] = useState<CardType[]>([])
  const [user, setUser] = useState<any>({})
  const router = useRouter()

  const handleLogout =  async() => {
    await logoutUser()
    router.push("/login")
  }

   useEffect(() => {
    const fetchCards = async () => {
      try {
        const data: CardType[] = await getCards(boardId);
        setCards(data);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
        setCards([]);
      }
    };

    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchCards();
    fetchUser();
  }, [boardId]);



    const getStatusLabel = (status: string) => {
      const labels = {
        todo: "A Fazer",
        in_progress: "Em Progresso",
        review: "Em Revisão",
        done: "Concluído",
        disapprove: "Reprovado",
        aprovadas: "Aprovado",
        reprovadas: "Reprovado",
      } as const;

      return labels[status as keyof typeof labels] || status;
    };


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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Cliente" />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize e aprove os posts criados para você</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <Badge className={`${getStatusColor(card.status)} px-2 py-1 rounded`}>
                    {getStatusLabel(card.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {card.image && (
                  <div className="relative h-48 w-full rounded-md overflow-hidden">
                    <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Criado em: {new Date(card.created_at).toLocaleDateString("pt-BR")}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const cardId = card.id;
                      router.push(`/client/${boardId}/card/${cardId}`)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhum post encontrado para aprovação.</p>
          </div>
        )}
      </main>
    </div>
  )
}
