"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X, Edit } from "lucide-react"
import Image from "next/image"
import { getUser } from "@/lib/UserApi"
import { UserProfile } from "@/lib/types/user"
import { CardStatus, Card } from "@/lib/types/card"
import { createCard, updateCard } from "@/lib/CardApi"

interface CreatePostModalProps {
  onCreatePost: (post: any) => void
  onUpdatePost?: (post: any) => void
  boardId: number | string
  editingCard?: Card | null
  isEditing?: boolean
}

export function CreatePostModal({ 
  onCreatePost, 
  onUpdatePost, 
  boardId, 
  editingCard = null, 
  isEditing = false 
}: CreatePostModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    board: 0, 
    image: "", 
    status: "" as CardStatus, 
    due_date: "" 
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile>()
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(boardId)
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [boardId])

  // Reset form when modal opens/closes or editingCard changes
  useEffect(() => {
    if (open && isEditing && editingCard) {
      // Pre-fill form with editing card data
      setFormData({
        title: editingCard.title || "",
        description: editingCard.description || "",
        board: editingCard.board,
        image: editingCard.image || "",
        status: editingCard.status || "todo",
        due_date: editingCard.due_date || ""
      })
      setImagePreview(editingCard.image || null)
    } else if (!open) {
      // Reset form when modal closes
      setFormData({ 
        title: "", 
        description: "", 
        board: 0, 
        image: "", 
        status: "todo", 
        due_date: "" 
      })
      setImagePreview(null)
    }
  }, [open, isEditing, editingCard])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      return
    }

    const clientId = user?.id || formData.board
    if (!clientId) {
      console.error("Nenhum clientId encontrado, não é possível criar/atualizar post.")
      return
    }

    const postData = {
      title: formData.title,
      description: formData.description,
      board: String(clientId),
      status: formData.status || "todo",
      due_date: formData.due_date,
      feedback: editingCard?.feedback || {},
    }

    const form = new FormData()
    Object.entries(postData).forEach(([key, value]) => {
      form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value))
    })
    if (file) form.append("image_upload", file)


    try {
      if (isEditing && editingCard) {
        const updatedCard = await updateCard(form, String(editingCard.id))
        if (onUpdatePost) onUpdatePost(updatedCard)
      } else {
        const createdCard = await createCard(form)
        onCreatePost(createdCard)
      }

      // Reset form and close modal
      setFormData({ title: "", description: "", board: 0, image: "", status: "todo", due_date: "" })
      setImagePreview(null)
      setOpen(false)
    } catch (error) {
      console.error("Erro ao processar o card:", error)
    }
  }


  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile);

      // Para preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button className="bg-white text-foreground font-normal shadow-none px-2 py-1.5">
            Editar
          </Button>
        ) : (
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Post" : "Criar Novo Post"}</DialogTitle>
        </DialogHeader>
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
          ): null}

          
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

          <div className="space-y-2">
            <Label htmlFor="image">Imagem (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button type="button" variant="outline" onClick={() => document.getElementById("image")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {imagePreview ? "Alterar Imagem" : "Escolher Imagem"}
              </Button>
            </div>

            {imagePreview && (
              <div className="relative w-full h-32 rounded-md overflow-hidden border">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar Post" : "Criar Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}