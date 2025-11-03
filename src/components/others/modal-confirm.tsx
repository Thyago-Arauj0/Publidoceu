"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Client } from "@/lib/types/userType"
import { switchActiveClient } from "@/lib/actions/switchActiveClient"

interface ConfirmModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  action: "delete" | "toggle"
  client?: Client
  handleDelete: (id: number) => void
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  action,
  client,
  handleDelete,
  setClients
}: ConfirmModalProps) {

  const handleConfirm = async () => {
    if (!client) return

    if (action === "delete") {

      handleDelete(Number(client.id))
    } else {
      const updatedClient = await switchActiveClient(client)
      setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)))
    }

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {action === "delete" ? "Confirmar exclusão" : "Confirmar alteração de status"}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2 text-gray-700">
          {action === "delete"
            ? `Tem certeza que deseja excluir ${client?.name}? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja ${client?.is_active ? "desativar" : "ativar"} ${client?.name}?`}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            className={`${
              action === "delete" ? "bg-red-600 hover:bg-red-800" : "bg-[#d35429] hover:bg-[#83341a]"
            } text-white cursor-pointer`}
            onClick={handleConfirm}
          >
            {action === "delete" ? "Excluir" : client?.is_active ? "Desativar" : "Ativar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
