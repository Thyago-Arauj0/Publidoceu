'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarDays, Clock, MessageSquare, User, FileText, List, MoreVertical, Trash, Download } from "lucide-react"
import Footer from "../footer"
import Loading from "@/app/(areaSocialMedia)/clients/[userId]/cards/[cardId]/loading"
import { actionGetChecklists } from "@/lib/actions/checklistActions"
import AddChecklistModal from "./add-checklist-modal"
import Image from "next/image"
import AddFileModal from "./add-file-modal"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import { formatDate } from "@/lib/helpers/formatDateRange"
import ModalError from "../others/modal-error"
import useFiles from "@/hooks/use-files"
import useChecklist from "@/hooks/use-checklist"
import { getFileType } from "@/lib/helpers/getFileType"
import CloudinaryDownload from "../others/file-download"
import Link from "next/link"
import { Card as CardType } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"
import { CheckList as CheckListType } from "@/lib/types/cardType"
import { File } from "@/lib/types/cardType"
import { UserProfile } from "@/lib/types/userType"
import { useEffect, useState } from "react"


interface CardDetailsProps {
  user: UserProfile | null;
  board: Board | null;
  card: CardType | null;
  checklists: CheckListType[];
  files: File[];
  error: string | null
}


export default function CardDetails({ user, board, card, checklists, files, error }: CardDetailsProps) {

  const [isLoading, setIsLoading] = useState(true)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [err, setError] = useState<string | null>(null)

  if (!board || !card) {
    return <div>Erro: dados incompletos.</div>;
  }

  const { Files, setFiles, handleDeleteFile, refreshFiles } = useFiles(board, card)
  const { Checklists, setChecklists, handleDeleteChecklist, isChecklistCompleted, getCheckListTitle } = useChecklist(card)

  useEffect(()=>{
    setFiles(files)
    setChecklists(checklists)
  }, [])

  useEffect(() => {
    if (error) {
      setIsErrorModalOpen(true)
      setError(error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])
  

  return (
    <div className="min-h-screen bg-background">

      <header className="bg-[#1e3a5f] dark:bg-gray-800 border-b text-white border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="cursor-pointer">
                  <Link href={`/clients/${user?.id}/`} className="flex">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Link>
                </Button>
            </div>
          </div>
        </div>
      </header>

      { isLoading ? (
          <div className="flex justify-center py-20 min-h-[400px] items-center min-h-screen">
            <Loading />
          </div>
          ) : (
          <main className="container mx-auto px-4 py-6 max-w-4xl min-h-screen">
            <Card className="flex items-start justify-between border-none shadow-none">
              <CardContent className="space-y-2">
                <CardTitle className="text-2xl font-bold text-[#1e3a5f]">
                  {card.title}
                </CardTitle>

                <div className="flex gap-2 items-center">
                  <h3 className="text-[#941c26] font-medium">Status:</h3>
                  <Badge
                    className={`${getStatusColor(
                      card?.status
                    )} bg-[#d35429] text-white px-3 py-1 rounded-full`}
                  >
                    {getStatusLabel(card?.status) || "Carregando..."}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <h3 className="text-[#1e3a5f] font-medium">Cliente:</h3>
                  <User className="h-4 w-4 text-[#d35429]" />
                  <span className="text-[#941c26] font-semibold">{user?.name}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Seção de Arquivos - SEMPRE VISÍVEL */}
              <Card className="border-none shadow-none rounded-xl">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                    <FileText className="h-5 w-5 text-[#d35429]" />
                    <span>Arquivos ({Files.length})</span>
                  </CardTitle>
                  {card.id && (
                    
                    <AddFileModal
                      boardId={String(board.id)}
                      cardId={card.id.toString()}
                      onCreated={refreshFiles}
                    />
                  )}
                </CardHeader>
                <CardContent>
                  {Files.length === 0 ? (
                    <p className="text-[#1e3a5f]/80 text-center py-8">
                      Nenhum arquivo adicionado ainda.
                    </p>
                  ) : (
                    <div className={`${Files.length === 1 ? 'columns-1' : 'columns-1 md:columns-2'} gap-4 space-y-4`}>
                      {Files.map((file) => {
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
                            
 
                            <div className="absolute top-2 right-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 bg-gray-100 hover:bg-gray-200"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem asChild>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                      <Download className="h-4 w-4" />
                                      <CloudinaryDownload fileUrl={file.file} />
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-700 cursor-pointer"
                                    onClick={() => handleDeleteFile(file.id.toString())}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none rounded-xl">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-[#1e3a5f]">
                    <List className="h-5 w-5 text-[#d35429]" />
                    <span>Checklists ({Checklists.length})</span>
                  </CardTitle>
                  {card.id && (
                    <AddChecklistModal
                      cardId={card.id.toString()}
                      onCreated={async () => {
                        const res = await actionGetChecklists(card.id.toString());
                        if (res.success) setChecklists(res.data ?? []);
                      }}
                    />
                    )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Checklists.length === 0 ? (
                      <p className="text-[#1e3a5f]/80">Nenhuma checklist disponível.</p>
                    ) : (
                      Checklists.map((item) => {
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
                                cardId={card.id.toString()}
                                checklistId={item.id.toString()}
                                initialTitle={title}
                                onCreated={async () => {
                                  const res = await actionGetChecklists(card.id.toString());
                                  if (res.success) setChecklists(res.data ?? []);
                                }}
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
                        <span>{formatDate(card.created_at)}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#941c26]">
                        Última Atualização
                      </p>
                      <p className="flex items-center space-x-2 text-[#1e3a5f]">
                        <Clock className="h-4 w-4 text-[#d35429]" />
                        <span>{formatDate(card.updated_at)}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#941c26]">
                        Data de Vencimento
                      </p>
                      <p className="flex items-center space-x-2 text-[#1e3a5f]">
                        <CalendarDays className="h-4 w-4 text-[#d35429]" />
                        <span>{card.due_date?.split("-").reverse().join("/") || "Sem data para entrega"}</span>
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
                      {card.feedback?.text && (
                        <p className="text-[#1e3a5f]/80">{card.feedback?.text}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>  
        )}

     <ModalError
        open={isErrorModalOpen}
        setIsErrorModalOpen={setIsErrorModalOpen}
        error={err}
      />

      <Footer/>

    </div>
  )
}