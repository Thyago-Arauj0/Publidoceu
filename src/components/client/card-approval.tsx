"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, MessageSquare, FileText, Check, X, Download } from "lucide-react"
import Loading from "@/app/(areaClient)/client/[userId]/card/[cardId]/loading"
import { CheckList as CheckListType } from "@/lib/types/cardType"
import Footer from "../footer"
import Image from "next/image"
import SmallLoading from "../others/small-loading"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import HeaderClient from "../header-client"
import { getFileType } from "@/lib/helpers/getFileType"
import ModalError from "../others/modal-error"
import CloudinaryDownload from "../others/file-download"
import { Card as CardType } from "@/lib/types/cardType"
import { File } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"
import useCard from "@/hooks/use-card"
import useChecklist from "@/hooks/use-checklist"
import useFiles from "@/hooks/use-files"

interface Props {
  board: Board | null;
  card: CardType | null;
  checklists: CheckListType[];
  files: File[];
  error: string | null
}

export function PostApproval({ board, card, checklists, files, error }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [err, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!board || !card) {
    return <div>Erro: dados incompletos.</div>;
  }

  const { Card, setCard, handleApproval, isLoadingCard, isEditingCard, setIsEditingCard, handleFeedbackSubmit, isLoadingFeedback, feedback, setFeedback } = useCard(board)
  const { Checklists, setChecklists, handleToggleChecklist, isLoadingChecklist } = useChecklist(Card)
  const { Files, setFiles, isLoadingFile, handleApproveFile, handleDisapproveFile } = useFiles(board, Card) 

  useEffect(()=>{
    setCard(card)
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
  
  if(isLoading){
    return <Loading/>
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <HeaderClient type="card-approval" userId={board.customer} user={null} onLogout={() => router.push('/client/logout')} />

      <main className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
        <div className="text-sm text-center text-orange-500 dark:text-gray-400 mb-4">
          Revise e aprove o conteúdo
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Post Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col gap-2 items-start justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{Card.title}</h1>
                <Badge className={`${getStatusColor(Card.status)} rounded-full px-3 py-1 text-xs font-medium`}>
                  {getStatusLabel(Card.status)}
                </Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Descrição</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{Card.description}</p>
                </div>

                {/* Seção de Arquivos */}
                {Files.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Arquivos ({Files.length})</h3>
                    <div className={`${Files.length === 1 ? 'columns-1' : 'columns-1 md:columns-2'} gap-4 space-y-4`}>
                      {Files.map((file) => {
                        const fileType = getFileType(file.file)
                        const isApproved = file.is_approved === true
                        
                        return (
                          <div 
                            key={file.id} 
                            className={`relative rounded-lg overflow-hidden break-inside-avoid ${
                              isApproved ? 'ring-2 ring-green-500' : ''
                            }`}
                          >
                            {/* Preview do arquivo */}
                            <div className="relative w-full min-h-[200px] flex items-center justify-center bg-gray-100">
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
                                  >
                                    Seu navegador não suporta o elemento de vídeo.
                                  </video>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-40 w-full">
                                  <FileText className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Botões de ação flutuantes */}
                            <div className="absolute top-2 right-2 flex gap-1 items-center">
                              {!isApproved ? (
                                <Button
                                  size="sm"
                                  disabled={isLoadingFile(file.id)}
                                  className="cursor-pointer bg-black/50 hover:bg-black/70 text-white border-0 shadow-lg"
                                  onClick={() => handleApproveFile(file.id.toString())}
                                  title="Aprovar arquivo"
                                >
                                {isLoadingFile(file.id) ? (
                                    <SmallLoading />
                                  ) : (
                                      <Check className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={isLoadingFile(file.id)}
                                  className="cursor-pointer bg-black/50 hover:bg-black/70 text-white border-0 shadow-lg"
                                  onClick={() => handleDisapproveFile(file.id.toString())}
                                  title="Desaprovar arquivo"
                                >
                                {isLoadingFile(file.id) ? (
                                    <SmallLoading />
                                  ) : (
                                  <X className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                                <div className="flex ml-2 bg-black text-white p-1 px-2 rounded items-center justify-center gap-1 cursor-pointer">
                                  <Download className="h-4 w-4" />
                                  <CloudinaryDownload fileUrl={file.file} />
                                </div>
                            </div>

                            {/* Indicador de aprovado */}
                            {isApproved && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                                ✓ Aprovado
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {/* Checklist Section */}
                {Checklists.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Lista de tarefas</h3>
                    <ul className="space-y-3">
                      {Checklists.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 p-2 rounded bg-gray-100">
                            <button
                              onClick={() => handleToggleChecklist(item.id, item)}
                              disabled={isLoadingChecklist(item.id)}
                              className={`w-6 h-6 flex items-center justify-center rounded border transition-colors ${
                                item.is_check
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "bg-white border-gray-400 dark:bg-gray-800"
                              }`}
                            >
                              {isLoadingChecklist(item.id) ? (
                                <SmallLoading />
                              ) : (
                                item.is_check && <CheckCircle className="h-4 w-4" />
                              )}
                            </button>

                            <span
                              className={`text-gray-700 dark:text-gray-300 ${
                                item.is_check ? "line-through opacity-70" : ""
                              }`}
                            >
                              {item.title}
                            </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block mb-1">Data de Criação</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {Card.created_at ? new Date(Card.created_at).toLocaleDateString("pt-BR") : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block mb-1">Agendado para</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {Card.due_date 
                        ? new Date(Card.due_date).toLocaleDateString("pt-BR") 
                        : "Sem data"}
                    </p>
                  </div>
                </div>
                
                {Card.feedback?.text && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-900 dark:text-white block mb-2">Feedback</span>
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      {Card.feedback.text}
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
                    disabled={isLoadingFeedback || !feedback.trim()}
                    className="mt-3 w-full bg-[#d35429] hover:bg-[#ac421f] transition-colors cursor-pointer"
                  >
                    {isLoadingFeedback ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Ações</h2>
              
              {Card.status === "done" || Card.status === "disapprove" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(Card.status)} rounded-full px-3 py-1 text-sm`}>
                      {Card.status === "done" ? "Aprovado" : "Reprovado"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingCard(!isEditingCard)}
                      className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      {isEditingCard ? "Cancelar" : "Alterar"}
                    </Button>
                  </div>

                  {isEditingCard && (
                    <div className="space-y-3 pt-2">
                      <Button
                        onClick={() => handleApproval("approve")}
                        disabled={isLoadingCard}
                        className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isLoadingCard? "Processando..." : "Aprovar Post"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleApproval("reject")}
                        disabled={isLoadingCard}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isLoadingCard ? "Processando..." : "Reprovar Post"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleApproval("approve")}
                    disabled={isLoadingCard}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoadingCard ? "Processando..." : "Aprovar Post"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleApproval("reject")}
                    disabled={isLoadingCard}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isLoadingCard ? "Processando..." : "Reprovar Post"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ModalError
        open={isErrorModalOpen}
        setIsErrorModalOpen={setIsErrorModalOpen}
        error={err}
      />
    </div>
  )
}