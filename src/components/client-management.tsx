"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Edit, Trash2, User, Mail, Phone, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  password?: string
  status: "active" | "inactive"
  postsCount: number
  createdAt: string
}

const mockClients: Client[] = [
  {
    id: "2",
    name: "João Silva",
    email: "joao@lojaabc.com",
    phone: "(11) 99999-9999",
    status: "active",
    postsCount: 5,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@empresaxyz.com",
    phone: "(11) 88888-8888",
    status: "active",
    postsCount: 3,
    createdAt: "2024-01-08",
  },
  {
    id: "2",
    name: "Pedro Costa",
    email: "pedro@coachdef.com",
    phone: "(11) 77777-7777",
    status: "inactive",
    postsCount: 1,
    createdAt: "2024-01-05",
  },
]

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      return
    }

    if (editingClient) {
      // Update existing client
      setClients(clients.map((client) => (client.id === editingClient.id ? { ...client, ...formData } : client)))
      setEditingClient(null)
    } else {
      // Create new client
      const newClient: Client = {
        id: `client-${Date.now()}`,
        ...formData,
        status: "active",
        postsCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setClients([...clients, newClient])
    }

    // Reset form
    setFormData({ name: "", email: "", phone: "", password: "" })
    setIsCreateModalOpen(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      password: client.password || "",
    })
    setIsCreateModalOpen(true)
  }

  const handleDelete = (clientId: string) => {
    setClients(clients.filter((client) => client.id !== clientId))
  }

  const toggleStatus = (clientId: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, status: client.status === "active" ? "inactive" : "active" } : client,
      ),
    )
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "" })
    setEditingClient(null)
    setIsCreateModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gerenciamento de Clientes</h2>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      placeholder="Nome da empresa..."
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha de acesso</Label>
                    <Input
                      id="password"
                      placeholder="data de nascimento"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>


                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingClient ? "Atualizar" : "Cadastrar"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todos os seus clientes e suas informações</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={client.name} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{client.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={client.status === "active" ? "default" : "secondary"}
                      className={client.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(client.id)}>
                          <User className="mr-2 h-4 w-4" />
                          {client.status === "active" ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(client.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>

                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">{client.postsCount} posts</span>
                  <span className="text-sm text-gray-500">
                    Desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  Ver Área do Cliente
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhum cliente cadastrado ainda.</p>
            <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Cliente
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
