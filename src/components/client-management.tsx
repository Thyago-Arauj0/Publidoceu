"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus, MoreHorizontal, Edit, Trash2, User, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/User"
import { getCards } from "@/lib/Card"
import { UserProfile } from "@/lib/types/userType"
import { logoutUser } from "@/lib/AuthService"
import Footer from "./footer"

export interface Client extends UserProfile {
  phone?: string | null
  password?: string
  postsCount?: number
}


export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    created_at: "",
    is_active: true
  })
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: "delete" | "toggle"
    client?: Client
  }>({ isOpen: false, action: "delete", client: undefined })

  const router = useRouter()

  const formatWhatsapp = (phone: string) => {
    if (!phone) return null;

    let digits = phone.replace(/\D/g, ""); // remove tudo que não é número
    if (digits.length === 11) {
      return `+55${digits}`; // adiciona DDD + país
    }
    if (digits.length === 13 && digits.startsWith("55")) {
      return `+${digits}`; // já tem o código do país
    }
    return `+${digits}`; // fallback
  }

  const openConfirmModal = (client: Client, action: "delete" | "toggle") => {
    setConfirmModal({ isOpen: true, action, client })
  }


  useEffect(() => {
    async function fetchClients() {
      setLoading(true) 
      try {
        const users = await getUsers()

        console.log(users)

        const formattedClients = await Promise.all(
          users.map(async (user: UserProfile) => ({
            ...user,
            postsCount: await fetchPostsCount(user.id), 
            phone: user.profile?.whatsapp,
            password: "",
            author: user.author,
            is_active: user.is_active,
            is_superuser: user.is_superuser,
            created_at: user.created_at
              ? new Date(user.created_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          }))
        );
        setClients(formattedClients)
      } catch (error: unknown) {
          if (error instanceof Error) {
          setError(error.message)
            } else {
          setError("Erro ao buscar usuário")
          }
         setIsErrorModalOpen(true)
         setClients([])
      }finally{
        setLoading(false)
      }
    }

    async function fetchPostsCount(boardId: number | string) {
      const id = boardId.toString();
      try {
        const cards = await getCards(`${id}`)
        return cards.length
      } catch (error: unknown) {
        if (error instanceof Error) {
        setError(error.message)
          } else {
        setError("Erro ao buscar número de cards")
        }
        setIsErrorModalOpen(true)
        return 0
      } 
    }

    fetchClients()
  }, [reload])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      return
    }
    if (editingClient) {
      try {
        const updatedUser = await updateUser(
          editingClient.id,
          formData.name,
          formData.email,
          formData.password,
          { whatsapp: formatWhatsapp(formData.phone) },
          editingClient.is_active,
          null,
          null
        )
        setClients(
          clients.map((client) =>
            client.id === editingClient.id ? { ...client, ...updatedUser, phone: formData.phone } : client,
          ),
        )
        setEditingClient(null)
      } catch (error: unknown) {
        if (error instanceof Error) {
        setError(error.message)
          } else {
        setError("Erro ao editar usuário")
        }
        setIsErrorModalOpen(true)
      }
    } else {
      try {
        const newUser = await createUser(
          formData.name,
          formData.email,
          formData.password,
          null,
          null
        )
        const newClient: Client = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: formData.phone,
          password: formData.password,
          is_active: true, // padrão ativo
          postsCount: 0,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
        };
        setClients([...clients, newClient])
        setReload((prev) => !prev);
      } catch (error: unknown) {
        if (error instanceof Error) {
        setError(error.message)
          } else {
        setError("Erro ao criar usuário")
        }
        setIsErrorModalOpen(true)
      }
    }
    setFormData({ name: "", email: "", phone: "", password: "", created_at: "", is_active: false })
    setIsCreateModalOpen(false)
  }


  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      password: client.password || "",
      created_at: client.created_at || "",
      is_active: client.is_active 
    })
    setIsCreateModalOpen(true)
  }

  const handleDelete = async (clientId: string | number) => {
    try {
      await deleteUser(clientId)
      setClients(clients.filter((client) => client.id !== clientId))
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }


  const toggleis_active = async (clientId: string | number) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const updatedClient = { ...client, is_active: !client.is_active };
    
    try {
      await updateUser(
        client.id,
        updatedClient.name,
        updatedClient.email,
        undefined, // Não alteramos a senha aqui
        { whatsapp: client.profile?.whatsapp ?? null }, 
        updatedClient.is_active, // Novo status
        undefined,
        undefined
      );
      
      // Atualiza o estado local
      setClients(
        clients.map(c => 
          c.id === clientId 
            ? { ...c, is_active: !c.is_active } 
            : c
        )
      );
    } catch (error) {
      console.error("Failed to update client status:", error);
    }
  };

  
  const handleLogout =  async() => {
    await logoutUser()
    router.push("/login")
  }

 
  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "",created_at:"", is_active: false })
    setEditingClient(null)
    setIsCreateModalOpen(false)
  }


  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="cursor-pointer bg-[#d35429] hover:bg-[#83341a] font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
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

                  {editingClient && (
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    ) }

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha de acesso</Label>
                    <Input
                      id="password"
                      placeholder="Ano de nascimento"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>


                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} className="bg-red-500 w-1/2 text-white hover:text-white cursor-pointer hover:bg-red-800">
                      Cancelar
                    </Button>
                    <Button type="submit" className="cursor-pointer bg-green-600 w-1/2 hover:bg-green-900">{editingClient ? "Atualizar" : "Cadastrar"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleLogout} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todos os seus clientes e suas informações</p>
        </div>
        <hr />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
         {loading ? (
            <div className="col-span-full flex justify-center py-20 min-h-screen items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : clients.length <= 1 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Nenhum cliente cadastrado ainda.</p>
              <Button className="mt-4 cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
            </div>
          ) : (
          clients.map((client, index) => (
            !client.is_superuser ? (
              <Card key={client.id ?? `client-${index}`} className="overflow-hidden">
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
                        variant={client.is_active === true ? "default" : "secondary"}
                        className={client.is_active === true ? "bg-green-100 text-green-800" : ""}
                      >
                        {client.is_active === true ? "Ativo" : "Inativo"}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(client)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem  onClick={() => openConfirmModal(client, "toggle")} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            {client.is_active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => openConfirmModal(client, "delete")}>
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
                      Desde {new Date(client.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent cursor-pointer py-5"
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    Ver Área do Cliente
                  </Button>
                </CardContent>
              </Card>
                ) : null
              ))
            )}
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

      <Dialog open={confirmModal.isOpen} onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {confirmModal.action === "delete" ? "Confirmar exclusão" : "Confirmar alteração de status"}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-gray-700">
            {confirmModal.action === "delete"
              ? `Tem certeza que deseja excluir ${confirmModal.client?.name}? Esta ação não pode ser desfeita.`
              : `Tem certeza que deseja ${confirmModal.client?.is_active ? "desativar" : "ativar"} ${confirmModal.client?.name}?`}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              className={`${
                confirmModal.action === "delete" ? "bg-red-600 hover:bg-red-800" : "bg-[#d35429] hover:bg-[#83341a]"
              } text-white cursor-pointer`}
              onClick={() => {
                if (confirmModal.client) {
                  if (confirmModal.action === "delete") handleDelete(confirmModal.client.id)
                  else toggleis_active(confirmModal.client.id)
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }))
              }}
            >
              {confirmModal.action === "delete" ? "Excluir" : confirmModal.client?.is_active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
