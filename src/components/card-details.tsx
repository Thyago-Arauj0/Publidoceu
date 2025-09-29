'use client'

import { useState, useEffect } from "react"
import { getCard } from "@/lib/Card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, CalendarDays, Clock, MessageSquare, User, CheckSquare } from "lucide-react"
import { Card as CardType } from "@/lib/types/cardType"
import { getUser } from "@/lib/User"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Footer from "./footer"
import { Board } from "@/lib/types/boardType"
import { getBoards } from "@/lib/Board"
import Loading from "@/app/(areaClient)/client/[userId]/card/[cardId]/loading"
import { createCheckList, getCheckLists } from "@/lib/CheckList"
import { CheckList as CheckListType } from "@/lib/types/cardType"
import AddChecklistModal from "./add-checklist-modal"

interface CardDetailsProps {
  userId: string
  cardId: string
}

export default function CardDetails({ userId, cardId }: CardDetailsProps) {

const [cardData, setCardData] = useState<CardType>({} as CardType)
const [checklist, setChecklist] = useState<CheckListType[]>([])
const [user, setUser] = useState<string>('')
const [boards, setBoards] = useState<Board[]>([])
const router = useRouter()
const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    const fetchBoard = async () => {
      setIsLoading(true); 
      try {
        const boards = await getBoards()
        setBoards(boards)
      } catch (error) {
        setError(error instanceof Error ? error.message : "BoardId não encontrado")
        setIsErrorModalOpen(true)
      }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
    }
    fetchBoard()
  }, [])


useEffect(() => {
  if (boards.length === 0) return; // espera boards carregarem

  const fetchUser = async () => {
    setIsLoading(true); 
    try {
      const data = await getUser(userId);
      setUser(data.name);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
  };

  const fetchCard = async () => {

    const board = boards.find(board => String(board.customer) === String(userId));

    if (!board) {
      console.error("Nenhum board correspondente encontrado para este cliente.");
      return;
    }
    setIsLoading(true); 
    try {
      const data: CardType = await getCard(board.id.toString(), cardId);
      setCardData(data);
    } catch (error) {
      console.error("Erro ao buscar card:", error);
      setCardData({} as CardType);
    }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
  };

  fetchUser();
  fetchCard();
}, [boards, userId, cardId]); 

useEffect(() => {
  if (!cardData.id) return; // só roda se cardData tiver id

  const fetchChecklists = async () => {
    setIsLoading(true);
    try {
      const data = await getCheckLists(cardData.id.toString());
      setChecklist(data);
      console.log("Checklists:", data);
    } catch (error) {
      console.error("Erro ao buscar checklists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChecklists();
}, [cardData]); // 🔹 depende só de cardData





const handleCreateCheckList = async () => {
  if (!cardData.id) {
    setError("Card ID não disponível para criar checklist.");
    setIsErrorModalOpen(true);
    return;
  }
  const formData = new FormData();
  formData.append("title", "Nova Checklist");
  formData.append("is_check", "false");
  setIsLoading(true);
  try {
    const newCheckList = await createCheckList(cardData.id.toString(), formData);
    setCardData(prev => ({
      ...prev,
      CheckLists: [...prev.CheckLists, newCheckList]
    }));
  } catch (error) {
    setError(error instanceof Error ? error.message : "Erro ao criar checklist.");
    setIsErrorModalOpen(true);
  } finally {
    setIsLoading(false);
  }
}

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

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background">

      <header className="bg-[#1e3a5f] dark:bg-gray-800 border-b text-white border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push(`/clients/${userId}/`)} className="cursor-pointer">
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <CheckSquare className="h-5 w-5 text-[#d35429]" />
                <span>Checklists</span>
              </CardTitle>
              {cardData.id && (
                <AddChecklistModal
                  cardId={cardData.id.toString()}
                  onCreated={() => {
                    getCheckLists(cardData.id.toString()).then(setChecklist);
                  }}
                />
               )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.length === 0 ? (
                  <p className="text-[#1e3a5f]/80">Nenhuma checklist disponível.</p>
                ) : (
                  checklist.map((item) => (
                    <div key={item.id} className="border-l-4 border-[#941c26] pl-4 py-2 bg-white rounded-md">
                      <p className="text-[#1e3a5f]/80">{item.title}</p>
                    </div>
                  ))
                )}
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
                    <span>{cardData.due_date?.split("-").reverse().join("/") || "Sem data para entrega"}</span>
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

    <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Erro</DialogTitle>
        </DialogHeader>
        <p className="text-red-600 mt-2">{error}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsErrorModalOpen(false)} className="cursor-pointer">Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>


    </div>
  )
}
