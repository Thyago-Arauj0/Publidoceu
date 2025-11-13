"use client"

import { useState, useEffect } from "react";
import { getUsers ,deleteUser, updateUser, createUser } from "@/lib/services/User";
import { Client, UserProfile } from "@/lib/types/userType";
import { Board } from "@/lib/types/boardType";
import { getCards } from "@/lib/services/Card";
import { formatWhatsapp } from "@/lib/helpers/formatWhatsapp"


export default function useFoundClients(boards: Board[]) {

   const [confirmModalClient, setConfirmModalClient] = useState<{
      isOpen: boolean
      action: "delete" | "toggle"
      client?: Client
    }>({ isOpen: false, action: "delete", client: undefined })
  
    const [clients, setClients] = useState<Client[]>([])
    const [errorClients, setError] = useState<string | null>(null);
    const [isErrorModalOpenClients, setIsErrorModalOpenClients] = useState(false);
    const [isLoadingClients, setIsLoading] = useState(true)
    const [reload, setReload] = useState(false);

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
    const [showPasswordField, setShowPasswordField] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
      if (!boards || boards.length === 0) return; 

      async function fetchClients() {
          try {
            setIsLoading(true); 
            const users = await getUsers()

            const formattedClients = await Promise.all(
              users.map(async (user: UserProfile) => ({
                ...user,
                postsCount: await fetchPostsCount(user.id),
                phone: user.profile?.whatsapp,
                password: "",
                author: user.author,
                is_active: user.is_active,
                is_superuser: user.is_superuser,
                created_at: user.profile?.created_at
                ? new Date(user.profile.created_at).toLocaleDateString("pt-BR")
                : new Date().toLocaleDateString("pt-BR"),
              }))
            )
              
            setClients(formattedClients)
          } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message)
            } else {
              setError("Erro ao buscar usuário")
            }
            setIsErrorModalOpenClients(true)
            setClients([])
          } finally {
            setIsLoading(false)
          }
      }

      async function fetchPostsCount(userId: number | string) {
          if (!boards) return 0  
          const board = boards.find(board => String(board.customer) === String(userId))

          if (!board) {
            if (userId !== board) {
              console.log(board)
              console.warn(`Cliente ${userId} não possui board ainda.`)
            }
            return 0
          }

          try {
            const cards = await getCards(`${board.id}`)
            return cards.length
          } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message)
            } else {
              setError("Erro ao buscar número de cards")
            }
            setIsErrorModalOpenClients(true)
            return 0
          } 
      }

     fetchClients()
    }, [reload, boards])

    const handleSubmitClient = async (e: React.FormEvent) => {
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
              formData.password || undefined,
              { whatsapp: formatWhatsapp(formData.phone) },
              editingClient.is_active,
              null,
              null,
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
            setIsErrorModalOpenClients(true)
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
            setIsErrorModalOpenClients(true)
          }
        }
        setFormData({ name: "", email: "", phone: "", password: "", created_at: "", is_active: false })
        setShowPasswordField(false)
        setShowPassword(false)
        setIsCreateModalOpen(false)
      }

    const handleEditClient = (client: Client) => {
        setEditingClient(client)
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone || "",
          password: "",
          created_at: client.created_at || "",
          is_active: client.is_active 
        })
        setShowPasswordField(false) // Esconde o campo de senha ao editar
        setShowPassword(false)
        setIsCreateModalOpen(true)
      }

    const handleDeleteClient = async (clientId: string | number) => {
         try {
           await deleteUser(clientId)
           setClients(clients.filter((client) => client.id !== clientId))
         } catch (error) {
           console.error("Failed to delete user:", error)
         }
       }

    const resetForm = () => {
      setFormData({ name: "", email: "", phone: "", password: "",created_at:"", is_active: false })
      setEditingClient(null)
      setShowPasswordField(false)
      setShowPassword(false)
      setIsCreateModalOpen(false)
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const openConfirmModalClient = (client: Client, action: "delete" | "toggle") => {
      setConfirmModalClient({ isOpen: true, action, client })
    }
    
    
        
    return {
      clients, setClients, errorClients, setIsErrorModalOpenClients, isErrorModalOpenClients, isLoadingClients, setReload,
      handleSubmitClient, handleDeleteClient, handleEditClient, resetForm, togglePasswordVisibility, isCreateModalOpen, showPasswordField, setIsCreateModalOpen,
      setShowPasswordField, showPassword, editingClient, formData, setFormData, setConfirmModalClient, confirmModalClient, openConfirmModalClient
    };
}