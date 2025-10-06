"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X, Edit, FileText, List, Trash2 } from "lucide-react"
import Image from "next/image"
import { getUser } from "@/lib/User"
import { getBoards } from "@/lib/Board"
import { UserProfile } from "@/lib/types/userType"
import { CardStatus, Card } from "@/lib/types/cardType"
import { createCard, updateCard } from "@/lib/Card"
import { getFiles, createFile, updateFile, deleteFile } from "@/lib/File"
import { getCheckLists, createCheckList, updateCheckList, deleteCheckList } from "@/lib/CheckList"
import { File as FileType } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"
import { CheckList } from "@/lib/types/cardType"

interface CreatePostModalProps {
  onCreatePost: (post: any) => void
  onUpdatePost?: (post: any) => void
  userId: number | string
  editingCard?: Card | null
  isEditing?: boolean
}

interface FilePreview {
  id: string // ID temporário para identificar o arquivo antes do upload
  file: File
  previewUrl: string
  name: string
  type: string
}

// Interface simplificada para CheckList
interface CheckListItem {
  id: string // ID temporário para novos itens
  title: string
  check_list?: number // ID do checklist no servidor (para itens existentes)
}

export function CreatePostModal({ 
  onCreatePost, 
  onUpdatePost, 
  userId, 
  editingCard = null, 
  isEditing = false 
}: CreatePostModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    board: 0, 
    status: "" as CardStatus, 
    due_date: "" 
  })
  const [user, setUser] = useState<UserProfile>()
  const [boards, setBoards] = useState<Board[]>([])
  const [existingFiles, setExistingFiles] = useState<FileType[]>([]) // arquivos já existentes no servidor
  const [newFiles, setNewFiles] = useState<FilePreview[]>([]) // novos arquivos selecionados
  const [existingCheckLists, setExistingCheckLists] = useState<CheckList[]>([]) // checklists existentes no servidor
  const [newCheckListItems, setNewCheckListItems] = useState<CheckListItem[]>([]) // novos itens de checklist
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [newCheckListItemTitle, setNewCheckListItemTitle] = useState("") // título do novo item

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const boards = await getBoards()
        setBoards(boards)
      } catch (error) {
        setError(error instanceof Error ? error.message : "BoardId não encontrado")
        setIsErrorModalOpen(true)
      }
    }
    fetchBoard()
  }, [])
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(userId)
        setUser(user)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Usuario não encontrado")
        }
        setIsErrorModalOpen(true)
      }
    }

    fetchUser()
  }, [userId])

  // Carregar arquivos e checklists existentes quando estiver editando
  useEffect(() => {

    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    const fetchExistingData = async () => {
      if (isEditing && editingCard) {
        try {
          const files = await getFiles(String(board.id), String(editingCard.id))
          setExistingFiles(files)
        } catch (error) {
          console.error("Erro ao carregar arquivos:", error)
        }

        try {
          const checkLists = await getCheckLists(String(editingCard.id))
          setExistingCheckLists(checkLists)
        } catch (error) {
          console.error("Erro ao carregar checklists:", error)
        }
      }
    }

    if (open && isEditing && editingCard) {
      fetchExistingData()
    }
  }, [open, isEditing, editingCard])

  // Reset form when modal opens/closes or editingCard changes
  useEffect(() => {
    if (open && isEditing && editingCard) {
      // Pre-fill form with editing card data
      setFormData({
        title: editingCard.title || "",
        description: editingCard.description || "",
        board: editingCard.board,
        status: editingCard.status || "todo",
        due_date: editingCard.due_date || ""
      })
    } else if (!open) {
      // Reset form when modal closes
      setFormData({ 
        title: "", 
        description: "", 
        board: 0, 
        status: "todo", 
        due_date: "" 
      })
      setNewFiles([])
      setExistingFiles([])
      setNewCheckListItems([])
      setExistingCheckLists([])
      setNewCheckListItemTitle("")
    }
  }, [open, isEditing, editingCard])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.title || !formData.description) {
      setLoading(false)
      return
    }

    const board = boards?.find(board => board.customer === user?.id)
    if (board) {
      formData.board = board.id
    } else {
      console.error("Nenhum board correspondente encontrado para este cliente.")
      setLoading(false)
      return
    }

    if (!user?.id) {
      console.error("Nenhum clientId encontrado, não é possível criar/atualizar post.")
      setLoading(false)
      return
    }

    // Formata a data de vencimento
    let dueDateFormatted = formData.due_date
    if (formData.due_date) {
      const [year, month, day] = formData.due_date.split("-").map(Number)
      const dateUTC = new Date(Date.UTC(year, month - 1, day))
      dueDateFormatted = dateUTC.toISOString().split("T")[0]
    }

    const postData = {
      title: formData.title,
      description: formData.description,
      board: formData.board,
      status: formData.status || "todo",
      due_date: dueDateFormatted,
      feedback: editingCard?.feedback || {},
    }

    const form = new FormData()
    Object.entries(postData).forEach(([key, value]) => {
      // Para objetos, converte para JSON string, para outros valores usa String()
      if (typeof value === 'object' && value !== null) {
        form.append(key, JSON.stringify(value))
      } else {
        form.append(key, String(value))
      }
    })


    try {
      // Criar ou atualizar card
      let cardResult
      if (isEditing && editingCard) {
        cardResult = await updateCard(form, String(editingCard.id))
        if (onUpdatePost) onUpdatePost(cardResult)
      } else {
        cardResult = await createCard(form)
        onCreatePost(cardResult)
      }

      // Upload dos novos arquivos
      if (newFiles.length > 0) {
        for (const filePreview of newFiles) {
          const fileForm = new FormData()
          fileForm.append("file_upload", filePreview.file)
          await createFile(board.id.toString(), String(cardResult.id), fileForm)
        }
      }

      // Criar novos itens de checklist
      if (newCheckListItems.length > 0) {
        for (const item of newCheckListItems) {
          const checklistForm = new FormData();
          checklistForm.append("title", item.title);
          await createCheckList(String(cardResult.id), checklistForm);
        }
      }

      // Reset do modal
      setOpen(false)
      setFormData({ title: "", description: "", board: 0, status: "todo", due_date: "" })
      setNewFiles([])
      setNewCheckListItems([])
      setNewCheckListItemTitle("")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Erro ao criar post")
      }
      setIsErrorModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFilePreviews: FilePreview[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const previewUrl = URL.createObjectURL(file)
      
      newFilePreviews.push({
        id: `new-${Date.now()}-${i}`, // ID temporário
        file,
        previewUrl,
        name: file.name,
        type: file.type
      })
    }

    setNewFiles(prev => [...prev, ...newFilePreviews])
    
    // Reset do input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ""
  }

  const handleRemoveNewFile = (fileId: string) => {
    const fileToRemove = newFiles.find(f => f.id === fileId)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.previewUrl) // Liberar memória
    }
    setNewFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleRemoveExistingFile = async (fileId: number) => {
    if (!editingCard) return

    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    try {
      await deleteFile(String(board.id), String(editingCard.id), String(fileId))
      setExistingFiles(prev => prev.filter(file => file.id !== fileId))
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Erro ao remover arquivo")
      }
      setIsErrorModalOpen(true)
    }
  }

  // Funções para o Checklist - APENAS ADICIONAR E REMOVER
  const addCheckListItem = () => {
    if (!newCheckListItemTitle.trim()) return

    const newItem: CheckListItem = {
      id: `checklist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newCheckListItemTitle.trim(),
    }

    setNewCheckListItems(prev => [...prev, newItem])
    setNewCheckListItemTitle("") // Limpa o input
  }

  const removeNewCheckListItem = (itemId: string) => {
    setNewCheckListItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleRemoveExistingCheckList = async (checkListId: number) => {
    if (!editingCard) return

    try {
      await deleteCheckList(String(editingCard.id), String(checkListId))
      setExistingCheckLists(prev => prev.filter(item => item.id !== checkListId))
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Erro ao remover item do checklist")
      }
      setIsErrorModalOpen(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCheckListItem()
    }
  }

  const isImage = (fileType: string) => fileType.startsWith('image/')
  const isVideo = (fileType: string) => fileType.startsWith('video/')

  // Função auxiliar para obter o título do checklist
  const getCheckListTitle = (checkList: CheckList): string => {
    return 'title' in checkList ? (checkList as any).title : ''
  }

  const totalCheckListItems = existingCheckLists.length + newCheckListItems.length

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isEditing ? (
            <Button className="bg-white hover:bg-gray-100 w-full flex justify-start cursor-pointer text-foreground font-normal shadow-none px-2 py-1.5">
              <span>Editar</span>
            </Button>
          ) : (
            <Button variant="default" size="sm" className="cursor-pointer bg-[#d35429] hover:bg-[#833a21] font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Post" : "Criar Novo Post"}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="col-span-full flex justify-center py-20 items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Post</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do post..."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o conteúdo do post..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {!isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: CardStatus) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="in_progress">Em Progresso</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                      <SelectItem value="disapprove">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="due_date">Data de Vencimento</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                  required
                />
              </div>

              {/* Seção de Checklist SIMPLIFICADA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Checklist ({totalCheckListItems} itens)
                  </Label>
                </div>
                
                {/* Input para adicionar novo item */}
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Adicionar novo item ao checklist..."
                    value={newCheckListItemTitle}
                    onChange={(e) => setNewCheckListItemTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addCheckListItem}
                    className="cursor-pointer"
                    disabled={!newCheckListItemTitle.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lista de checklists existentes - SIMPLIFICADA */}
                {existingCheckLists.map(item => {
                  const title = getCheckListTitle(item)
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <List className="h-4 w-4 text-gray-500" />
                        <span className="flex-1">
                          {title}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveExistingCheckList(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}

                {/* Lista de novos itens de checklist - SIMPLIFICADA */}
                {newCheckListItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3 flex-1">
                      <List className="h-4 w-4 text-gray-500" />
                      <span className="flex-1">
                        {item.title}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeNewCheckListItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Seção de Arquivos */}
              <div className="space-y-3">
                <Label>Arquivos ({existingFiles.length + newFiles.length})</Label>
                
                {/* Input para adicionar novos arquivos */}
                <div className="flex items-center gap-2">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById("file-upload")?.click()} 
                    className="cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Arquivos
                  </Button>
                </div>

                {/* Lista de arquivos existentes */}
                {existingFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.split('/').pop()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveExistingFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Lista de novos arquivos pré-visualizados */}
                {newFiles.map(filePreview => (
                  <div key={filePreview.id} className="border rounded-lg overflow-hidden bg-white">
                    <div className="flex items-center justify-between p-3 border-b">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{filePreview.name}</p>
                          <p className="text-xs text-gray-500">
                            {(filePreview.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveNewFile(filePreview.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Preview do arquivo */}
                    <div className="relative w-full h-40 bg-gray-100">
                      {isImage(filePreview.type) ? (
                        <Image 
                          src={filePreview.previewUrl} 
                          alt="Preview" 
                          fill 
                          className="object-contain" 
                        />
                      ) : isVideo(filePreview.type) ? (
                        <video 
                          src={filePreview.previewUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        >
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-12 w-12 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">
                            {filePreview.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-red-500 w-1/2 text-white hover:text-white cursor-pointer hover:bg-red-800">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 w-1/2 hover:bg-green-900 cursor-pointer">
                  {isEditing ? "Atualizar Post" : "Criar Post"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
    </>
  )
}