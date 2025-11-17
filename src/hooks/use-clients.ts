"use client"

import { useState} from "react";
import { deleteUser, updateUser, createUser } from "@/lib/services/User";
import { Client } from "@/lib/types/userType";
import { formatWhatsapp } from "@/lib/helpers/formatWhatsapp"


export default function useClients() {
    const [clients, setClients] = useState<Client[]>([])
    const [errorClients, setErrorClients] = useState<string | null>(null);
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
            setErrorClients(error.message)
              } else {
            setErrorClients("Erro ao editar usuário")
            }
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
          } catch (error: unknown) {
            if (error instanceof Error) {
            setErrorClients(error.message)
              } else {
            setErrorClients("Erro ao criar usuário")
            }
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


    return { 
      clients, setClients, errorClients,
      handleSubmitClient, handleDeleteClient, handleEditClient, 
      resetForm, togglePasswordVisibility, isCreateModalOpen, 
      showPasswordField, setIsCreateModalOpen, setShowPasswordField, 
      showPassword, editingClient, formData, setFormData,
    } 
}