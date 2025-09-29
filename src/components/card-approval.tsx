"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { getCard, updateCardStatus, addFeedback } from "@/lib/Card"
import { Card as CardType} from "@/lib/types/cardType"
import { getBoard } from "@/lib/Board"
import { Board } from "@/lib/types/boardType"
import Loading from "@/app/(areaClient)/client/[userId]/card/[cardId]/loading"

interface PostApprovalProps {
  userId: string
  cardId: string
}

export function PostApproval({ userId, cardId }: PostApprovalProps) {
  const [card, setCard] = useState<CardType>({} as CardType)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [boards, setBoards] = useState<Board[]>([])
  const router = useRouter()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBoard = async () => {
      setIsLoading(true); 
      try {
        const fetchedBoards = await getBoard();

        if (fetchedBoards && fetchedBoards.length > 0) {
          setBoards(fetchedBoards);
        } else {
          console.error("Nenhum board encontrado");
          setError("Nenhum board disponível");
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        console.error("Erro ao buscar boards:", error);
        setError("Erro ao carregar boards");
        setIsErrorModalOpen(true);
      }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
    };
    fetchBoard();
  }, []);

  useEffect(() => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    const fetchCard = async () => {
      setIsLoading(true); 
      try {
        const data: CardType = await getCard(String(board.id), cardId);
        setCard(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setCard({} as CardType);
      }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
    };

    fetchCard();
  }, [boards]);


  const handleFeedbackSubmit = async () => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      await addFeedback(String(board.id), cardId, feedback);
      setCard((prev) => ({ ...prev, feedback: { id: prev.feedback?.id || 0, card: prev.id, text: feedback } }));
      setFeedback("");
    } catch (error) {
      console.error("Erro ao adicionar feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleApproval = async (action: "approve" | "reject") => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    setIsSubmitting(true);
    try {
      const newStatus = action === "approve" ? "done" : "disapprove";
      await updateCardStatus(String(board.id), cardId, newStatus);
      setCard((prev) => ({ ...prev, status: newStatus }));
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      todo: "bg-gray-100 text-gray-700 border border-gray-300",
      in_progress: "bg-blue-100 text-blue-700 border border-blue-300",
      review: "bg-amber-100 text-amber-700 border border-amber-300",
      done: "bg-green-100 text-green-700 border border-green-300",
      disapprove: "bg-red-100 text-red-700 border border-red-300",
      aprovadas: "bg-green-100 text-green-700 border border-green-300",
      reprovadas: "bg-red-100 text-red-700 border border-red-300",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-300";
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push(`/client/${userId}`)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-sm text-center text-orange-500 dark:text-gray-400 mb-4">
          Revise e aprove o conteúdo
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Post Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{card.title}</h1>
                <Badge className={`${getStatusColor(card.status)} rounded-full px-3 py-1 text-xs font-medium`}>
                  {getStatusLabel(card.status)}
                </Badge>
              </div>

              <div className="space-y-6">
          
               {card.image && /\.(mp4|webm|ogg)(\?.*)?$/i.test(card.image) ? (
                  <video
                    src={card.image}
                    controls
                    className="w-full rounded-lg max-h-[90vh] shadow-none border-none"
                  />
                ) : (
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.title} 
                    className="w-full rounded-lg border-none max-h-[90vh] shadow-none"
                  />
                )}

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Descrição</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{card.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block mb-1">Data de Criação</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {card.created_at ? new Date(card.created_at).toLocaleDateString("pt-BR") : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block mb-1">Agendado para</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {card.due_date 
                        ? new Date(card.due_date).toLocaleDateString("pt-BR") 
                        : "Sem data"}
                    </p>
                  </div>
                </div>
                
                {card.feedback?.text && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-900 dark:text-white block mb-2">Feedback</span>
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      {card.feedback.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Approval Actions */}
          <div className="space-y-6">
            {/* Feedback Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Feedback</h2>
                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedback" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Deixe um comentário
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Adicione suas observações, sugestões ou comentários..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="resize-none border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600"
                  />

                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmitting || !feedback.trim()}
                    className="mt-3 w-full bg-[#d35429] hover:bg-[#ac421f] transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Ações</h2>
              
              {card.status === "done" || card.status === "disapprove" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(card.status)} rounded-full px-3 py-1 text-sm`}>
                      {card.status === "done" ? "Aprovado" : "Reprovado"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      {isEditing ? "Cancelar" : "Alterar"}
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="space-y-3 pt-2">
                      <Button
                        onClick={() => handleApproval("approve")}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processando..." : "Aprovar Post"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleApproval("reject")}
                        disabled={isSubmitting}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processando..." : "Reprovar Post"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleApproval("approve")}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Processando..." : "Aprovar Post"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleApproval("reject")}
                    disabled={isSubmitting}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Processando..." : "Reprovar Post"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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