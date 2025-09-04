"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import { getCard, updateCardStatus, addFeedback } from "@/lib/CardApi"
import { Card as CardType} from "@/lib/types/card"

interface PostApprovalProps {
  boardId: string
  cardId: string
}


export function PostApproval({ boardId, cardId }: PostApprovalProps) {
  const [card, setCard] = useState<CardType>({} as CardType)
  
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data: CardType = await getCard(boardId, cardId);
        setCard(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setCard({} as CardType);
      }
    };

    fetchCard();
  }, [boardId]);

  const handleFeedbackSubmit = async () => {

    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      await addFeedback(boardId, cardId, feedback);
      setCard((prev) => ({ ...prev, feedback: { id: prev.feedback?.id || 0, card: prev.id, text: feedback } }));
      setFeedback("");
    } catch (error) {
      console.error("Erro ao adicionar feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleApproval = async (action: "approve" | "reject") => {
    setIsSubmitting(true);
    try {
      const newStatus = action === "approve" ? "done" : "disapprove";
      await updateCardStatus(boardId, cardId, newStatus);
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(`/client/${boardId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Aprovação de Post</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revise e aprove o conteúdo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Post Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">{card.title}</CardTitle>
                  <Badge className={getStatusColor(card.status)}>{getStatusLabel(card.status)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {card.image && (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Descrição:</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Data de Criação:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(card.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Agendado para:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {card.due_date 
                        ? new Date(card.due_date).toLocaleDateString("pt-BR") 
                        : "Sem data"}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Feedback:</span>
                  {card.feedback?.text && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {card.feedback.text}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approval Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Feedback (Opcional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Deixe um comentário sobre o post:</Label>
                  <Textarea
                    className="my-2"
                    id="feedback"
                    placeholder="Adicione suas observações, sugestões ou comentários..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)} // <- aqui estava faltando
                    rows={4}
                  />

                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmitting || !feedback.trim()}
                    className="mt-1"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                  
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              {card.status === "done" || card.status === "disapprove" ? (
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(card.status)} rounded-lg text-lg`}>
                      {card.status === "done" ? "Aprovado" : "Reprovado"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleApproval("approve")}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processando..." : "Aprovar Post"}
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleApproval("reject")}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processando..." : "Reprovar Post"}
                      </Button>
                    </div>
                  )}
                </CardContent>

              ) : (
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleApproval("approve")}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Processando..." : "Aprovar Post"}
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleApproval("reject")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Processando..." : "Reprovar Post"}
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
