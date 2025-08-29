"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import Image from "next/image"

interface PostApprovalProps {
  clientId: string
  postId: string
}

// Mock post data
const mockPost = {
  id: "1",
  title: "Post sobre Black Friday",
  description:
    "Promoção especial para Black Friday com 50% de desconto em todos os produtos da loja. Não perca essa oportunidade única! Válido até 30/11/2024.",
  status: "em-aprovacao",
  createdAt: "2024-01-15",
  image: "/black-friday-sale-promotion.png",
  content: "Texto completo do post que será publicado nas redes sociais...",
  hashtags: ["#BlackFriday", "#Promoção", "#Desconto", "#LojaABC"],
  scheduledDate: "2024-11-25",
}

export function PostApproval({ clientId, postId }: PostApprovalProps) {
  const [post] = useState(mockPost)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleApproval = async (action: "approve" | "reject") => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, send approval/rejection to API
    console.log(`Post ${action}d with feedback:`, feedback)

    setIsSubmitting(false)
    router.push(`/client/${clientId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em-aprovacao":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "aprovadas":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "reprovadas":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(`/client/${clientId}`)}>
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
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <Badge className={getStatusColor(post.status)}>Aguardando Aprovação</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {post.image && (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Descrição:</h3>
                  <p className="text-gray-600 dark:text-gray-400">{post.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Conteúdo do Post:</h3>
                  <p className="text-gray-600 dark:text-gray-400">{post.content}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Hashtags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Data de Criação:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Agendado para:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(post.scheduledDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
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
                    id="feedback"
                    placeholder="Adicione suas observações, sugestões ou comentários..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
