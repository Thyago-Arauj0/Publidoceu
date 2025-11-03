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
import { LogOut, Plus, MoreHorizontal, Edit, Trash2, User, Mail, Phone, Eye, EyeOff, Key } from "lucide-react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/services/AuthService"
import Footer from "../footer"
import Loading from "@/app/(areaSocialMedia)/dashboard/loading"
import { Client } from "@/lib/types/userType"
import useFoundBoard from "@/hooks/use-found-board"
import useFoundClients from "@/hooks/use-found-clients"
import ModalError from "../others/modal-error"
import ConfirmModal from "../others/modal-confirm"


export function ClientManagement() {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: "delete" | "toggle"
    client?: Client
  }>({ isOpen: false, action: "delete", client: undefined })

  const router = useRouter()

  const openConfirmModal = (client: Client, action: "delete" | "toggle") => {
    setConfirmModal({ isOpen: true, action, client })
  }

  const { boards, isErrorModalOpenBoard, setIsErrorModalOpenBoard, errorBoard, isLoadingBoard } = useFoundBoard()
  const { 
    clients, setClients, errorClients, setIsErrorModalOpenClients, isErrorModalOpenClients, isLoadingClients,
    handleSubmit, handleDelete, handleEdit, resetForm, togglePasswordVisibility, isCreateModalOpen, showPasswordField,
    setIsCreateModalOpen, setShowPasswordField, showPassword, editingClient, formData, setFormData
  } = useFoundClients(boards)


  const handleLogout =  async() => {
    await logoutUser()
    router.push("/login")
  }


  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <header className="bg-[#1e3a5f] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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


                  {showPasswordField || !editingClient ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha de acesso</Label>
                        {editingClient && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPasswordField(false)}
                            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            Ocultar
                          </Button>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={editingClient ? "Nova senha (deixe em branco para manter a atual)" : "Ano de nascimento"}
                          value={formData.password}
                          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      {editingClient && (
                        <p className="text-xs text-gray-500">
                          Deixe em branco para manter a senha atual
                        </p>
                      )}
                    </div>
                  ) : (
                    editingClient && (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPasswordField(true)}
                          className="w-full flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Key className="h-4 w-4" />
                          Alterar Senha
                        </Button>
                      </div>
                    )
                  )}


                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} className="bg-red-500 w-1/2 text-white hover:text-white cursor-pointer hover:bg-red-800">
                      Cancelar
                    </Button>
                    <Button type="submit" className="cursor-pointer bg-green-600 w-1/2 hover:bg-green-900">{editingClient ? "Atualizar" : "Cadastrar"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleLogout} className="cursor-pointer bg-red-500/80 border-none hover:bg-red-600/80 text-white hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>


      {isLoadingBoard ? (
        <div className="flex justify-center min-h-[400px] items-center min-h-screen">
          <p>Carregando...</p>
        </div>
        ) : (
          <main className="container mx-auto px-4 py-6 min-h-screen">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Clientes</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todos os seus clientes e suas informações</p>
            </div>
            <hr />


            {isLoadingClients ? (
              <div className="flex justify-center min-h-[400px] items-center">
                <Loading />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
                {isLoadingClients  ? (
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
                            Desde {client.created_at}
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-[#e04b19] hover:bg-[#af411c] text-white hover:text-gray-50  cursor-pointer py-5"
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
            )}
          </main>
        )}

      <Footer/>

      <ModalError
        open={isErrorModalOpenBoard}
        setIsErrorModalOpen={setIsErrorModalOpenBoard}
        error={errorBoard}
      />
      <ModalError
        open={isErrorModalOpenClients}
        setIsErrorModalOpen={setIsErrorModalOpenClients}
        error={errorClients}
      />


      <ConfirmModal
        isOpen={confirmModal.isOpen}
        setIsOpen={(open) => setConfirmModal(prev => ({ ...prev, isOpen: open }))}
        action={confirmModal.action}
        client={confirmModal.client}
        handleDelete={handleDelete}
        setClients={setClients}
      />


    </div>
  )
}
