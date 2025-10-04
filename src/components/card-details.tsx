'use client'

import { useState, useEffect } from "react"
import { getCard } from "@/lib/Card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, CalendarDays, Clock, MessageSquare, User, CheckSquare, Trash, FileText, List, Plus, Upload, X } from "lucide-react"
import { Card as CardType } from "@/lib/types/cardType"
import { getUser } from "@/lib/User"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Footer from "./footer"
import { Board } from "@/lib/types/boardType"
import { getBoards } from "@/lib/Board"
import Loading from "@/app/(areaClient)/client/[userId]/card/[cardId]/loading"
import { getCheckLists, deleteCheckList } from "@/lib/CheckList"
import { CheckList as CheckListType } from "@/lib/types/cardType"
import AddChecklistModal from "./add-checklist-modal"
import { getFiles, deleteFile, createFile } from "@/lib/File"
import { File as FileType } from "@/lib/types/cardType"
import Image from "next/image"
import AddFileModal from "./add-file-modal"

interface CardDetailsProps {
  userId: string
  cardId: string
}

export default function CardDetails({ userId, cardId }: CardDetailsProps) {

const [cardData, setCardData] = useState<CardType>({} as CardType)
const [checklist, setChecklist] = useState<CheckListType[]>([])
const [files, setFiles] = useState<FileType[]>([])
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

  const fetchChecklistsAndFiles = async () => {
    setIsLoading(true);
    try {
      // Buscar checklists
      const checklistData = await getCheckLists(cardData.id.toString());
      setChecklist(checklistData);

      // Buscar arquivos
      const filesData = await getFiles(cardData.id.toString());
      setFiles(filesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChecklistsAndFiles();
}, [cardData]); 

  const handleDeleteChecklist = async (checklistId: string) => {
    if (!cardData.id) return;

    if (!confirm("Deseja realmente excluir este checklist?")) return;

    try {
      await deleteCheckList(cardData.id.toString(), checklistId);
      setChecklist((prev) => prev.filter((item) => item.id.toString() !== checklistId));
    } catch (err) {
      console.error("Erro ao excluir checklist:", err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!cardData.id) return;

    if (!confirm("Deseja realmente excluir este arquivo?")) return;

    try {
      await deleteFile(cardData.id.toString(), fileId);
      setFiles((prev) => prev.filter((file) => file.id.toString() !== fileId));
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
    }
  };

  const refreshFiles = async () => {
    if (!cardData.id) return;
    try {
      const filesData = await getFiles(cardData.id.toString());
      setFiles(filesData);
    } catch (error) {
      console.error("Erro ao atualizar arquivos:", error);
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

  // Função auxiliar para verificar se um checklist está completo
  const isChecklistCompleted = (checkList: CheckListType): boolean => {
    return checkList.is_check ?? false;
  }


  // Função auxiliar para obter o título do checklist
  const getCheckListTitle = (checkList: CheckListType): string => {
    return 'title' in checkList ? (checkList as any).title : ''
  }

  // Função para obter o tipo de arquivo baseado na URL
  const getFileType = (fileUrl: string): string => {
    if (fileUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return 'video'
    if (fileUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) return 'image'
    return 'other'
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
          {/* Seção de Arquivos - SEMPRE VISÍVEL */}
          <Card className="border-none shadow-none rounded-xl">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                <FileText className="h-5 w-5 text-[#d35429]" />
                <span>Arquivos ({files.length})</span>
              </CardTitle>
              {cardData.id && (
                <AddFileModal
                  cardId={cardData.id.toString()}
                  onCreated={refreshFiles}
                />
              )}
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <p className="text-[#1e3a5f]/80 text-center py-8">
                  Nenhum arquivo adicionado ainda.
                </p>
              ) : (
                <div className={`${files.length === 1 ? 'columns-1' : 'columns-1 md:columns-2'} gap-4 space-y-4`}>
                  {files.map((file) => {
                    const fileType = getFileType(file.file)
                    const isCompleted = file.is_approved === true
                    
                    return (
                      <div 
                        key={file.id} 
                        className={`relative rounded-lg overflow-hidden break-inside-avoid ${
                          isCompleted ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        {/* Preview do arquivo */}
                        <div className="relative w-full min-h-[200px] flex items-center justify-center">
                          {fileType === 'image' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image
                                src={file.file}
                                alt="Arquivo"
                                width={800}
                                height={600}
                                className="max-w-full max-h-full object-contain"
                                style={{ width: 'auto', height: 'auto' }}
                              />
                            </div>
                          ) : fileType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <video
                                src={file.file}
                                controls
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 w-full">
                              <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Botão de excluir flutuante */}
                        <div className="absolute top-2 right-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer bg-black/50 hover:bg-black/70 text-white border-0 shadow-lg"
                            onClick={() => handleDeleteFile(file.id.toString())}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Indicador de aprovado */}
                        {isCompleted && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                            ✓ Aprovado
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none rounded-xl">
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
                <List className="h-5 w-5 text-[#d35429]" />
                <span>Checklists ({checklist.length})</span>
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
                  checklist.map((item) => {
                    const isCompleted = isChecklistCompleted(item)
                    const title = getCheckListTitle(item)
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`pl-4 py-2 bg-gray-100 rounded-md flex flex-col md:flex-row justify-between gap-2 ${isCompleted ? 'border-2 border-green-500' : ''}`}
                      >
                        <p className="text-[#1e3a5f]/80" >
                          {title}
                        </p>
                        <div className="flex justify-end gap-2 px-2">
                          {/* Botão editar */}
                          <AddChecklistModal
                            cardId={cardData.id.toString()}
                            checklistId={item.id.toString()}
                            initialTitle={title}
                            onCreated={() => getCheckLists(cardData.id.toString()).then(setChecklist)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteChecklist(item.id.toString())}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
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