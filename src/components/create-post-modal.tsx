"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { getUsers } from "@/lib/UserApi"
import { UserProfile } from "@/lib/types/user"
import { Card, CardStatus } from "@/lib/types/card"
import { createCard } from "@/lib/CardApi"

interface CreatePostModalProps {
  onCreatePost: (post: any) => void
}



export function CreatePostModal({ onCreatePost }: CreatePostModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", clientId: "", image: "", status:"",  due_date: "" })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [users, setUsers] = useState<UserProfile[]>([])

  useEffect(() => {
    // Fetch users from the API (currently not used in the form)
    const fetchUsers = async () => {
      try {
        const users = await getUsers()
        setUsers(users)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.clientId) {
      return
    }

    // const selectedClient = users.find((client) => client.id === formData.clientId)

    const newPost = {
      title: formData.title,
      description: formData.description,
      clientId: formData.clientId,
      status: formData.status || "todo",
      due_date: formData.due_date,
      image: imagePreview || "https://storage.googleapis.com/star-lab/blog/OGs/image-not-found.png",
      feedback: {},
    }


    createCard(newPost.clientId, newPost.title, newPost.image || "", newPost.description,  newPost.status, newPost.due_date, newPost.feedback) 
      .then((createdCard) => {
        onCreatePost(createdCard)
      })
      .catch((error) => {
        console.error("Erro ao criar o card:", error)
      })

    // Reset form
    setFormData({ title: "", description: "", clientId: "", image: "", status:"", due_date: "" })
    setImagePreview(null)
    setOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Post</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, clientId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {users.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                Escolher Imagem
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
            <Button type="submit">Criar Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
