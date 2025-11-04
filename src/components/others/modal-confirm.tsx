"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Client } from "@/lib/types/userType"
import { switchActiveClient } from "@/lib/actions/switchActiveClient"

interface ConfirmModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  action: "delete" | "toggle"
  /** Pode ser um cliente, card, ou outro tipo de item */
  item?: {
    id: number | string
    name?: string
    title?: string
    is_active?: boolean
  }
  /** Função de exclusão */
  handleDelete?: (id: number | string) => void
  /** Atualizador de lista (quando for caso de toggle de cliente) */
  setClients?: React.Dispatch<React.SetStateAction<Client[]>>
}

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  action,
  item,
  handleDelete,
  setClients,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    if (!item) return

    if (action === "delete" && handleDelete) {
      handleDelete(item.id)
    } else if (action === "toggle" && setClients) {
      const updatedClient = await switchActiveClient(item as Client)
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
            ? `Tem certeza que deseja excluir '${item?.name || item?.title}'? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja ${
                item?.is_active ? "desativar" : "ativar"
              } ${item?.name}?`}
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
              action === "delete"
                ? "bg-red-600 hover:bg-red-800"
                : "bg-[#d35429] hover:bg-[#83341a]"
            } text-white cursor-pointer`}
            onClick={handleConfirm}
          >
            {action === "delete"
              ? "Excluir"
              : item?.is_active
              ? "Desativar"
              : "Ativar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
