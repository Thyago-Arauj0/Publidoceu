"use client"

import { useEffect, useState } from "react"
import { KanbanCard } from "@/components/admin/kanban-card"
import { getCards, updateCardStatus, deleteCard} from "@/lib/services/Card"
import { Card, CardStatus } from "@/lib/types/cardType"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Loading from "@/app/(areaSocialMedia)/clients/[userId]/loading"
import ModalError from "../others/modal-error"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import useFoundBoard from "@/hooks/use-found-board"

interface KanbanBoardProps {
  newPosts: Card[],
  userId: string
}

export function KanbanBoard({ newPosts, userId }: KanbanBoardProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [activeStatus, setActiveStatus] = useState<CardStatus>("todo")
  const statusList: CardStatus[] = ["todo", "in_progress", "review", "done", "disapprove"]
   const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    card?: Card
  }>({ isOpen: false })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  const { boards, isErrorModalOpenBoard, setIsErrorModalOpenBoard, errorBoard, isLoadingBoard } = useFoundBoard()

  useEffect(() => {
  const fetchCards = async () => {
    setIsLoading(true); 
    try {
      if (boards.length === 0) return;

      const board = boards.find(board => String(board.customer) === userId);
      if (!board) {
        console.error("Nenhum board correspondente encontrado para este cliente.");
        return;
      }

      const fetchedCards: Card[] = await getCards(String(board.id));
      setCards([
        ...fetchedCards,
        ...newPosts.filter(np => !fetchedCards.some(fc => fc.id === np.id))
      ]);
    } catch (error) {
      console.error("Erro ao buscar cards:", error);
      setError("Erro ao carregar cards");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }
  fetchCards()
}, [boards, newPosts, userId])



  const openDeleteModal = (card: Card) => {
    setConfirmModal({ isOpen: true, card })
  }


  const handleDelete = async (boardId: number, cardId: number) => {
    if (!cardId) return
    try {
      await deleteCard(boardId.toString(), cardId.toString())
      setCards(prev => prev.filter(c => c.id !== cardId))
      setConfirmModal({ isOpen: false }) // Fecha o modal apenas depois da exclusão
    } catch (error) {
      console.error("Erro ao excluir o card:", error)
    }
  }

  const handleUpdateCard = (updatedCard: Card) => {
    setCards(prevCards =>
      prevCards.map(card => (card.id === updatedCard.id ? updatedCard : card))
    )
  }


  const getCardsByStatus = (status: string) => {
    return cards.filter((card) => card.status === status)
  }


  const moveCard = (cardId: number, newStatus: CardStatus) => {
    setCards(cards.map(card => card.id === cardId ? { ...card, status: newStatus } : card))
    const cId = cardId.toString()

     const board = boards.find(b => String(b.customer) === String(userId))

    if (!board) return console.error("Erro! BoardId não encontrado.")
    updateCardStatus(board.id.toString(), cId, newStatus).catch(console.error)
  }



  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {statusList.map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded cursor-pointer ${
              activeStatus === status ? `${getStatusColor(activeStatus)}` : "bg-gray-200 text-gray-800"
            }`}
          >
            {getStatusLabel(status)} ({getCardsByStatus(status).length})
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20 min-h-[400px] items-center">
          <Loading />
        </div>
        ) : (
        <div className="mt-10 grid md:grid-cols-4 gap-3">
        {getCardsByStatus(activeStatus).map(card => {
            const board = boards.find(b => String(b.customer) === String(userId))

            if (!board) return <p>Carregando cards...</p>

            return (
              <KanbanCard
                key={card.id}
                card={card}
                board={board}
                onMove={(bId, cId, status) => moveCard(cId, status)}
                onDelete={() => openDeleteModal(card)} 
                onUpdateCard={handleUpdateCard} 
              />
            )
          })}
        </div>
      )}

      <Dialog
        open={confirmModal.isOpen}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-gray-700">
            Tem certeza que deseja excluir {confirmModal.card?.title}? Esta ação não pode ser desfeita.
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
                className="bg-red-600 hover:bg-red-800 text-white cursor-pointer"
                onClick={() => {
                  const board = boards?.find(b => String(b.customer) === String(userId))
                  if (!board) return null
                  if (confirmModal.card) handleDelete(Number(board.id), confirmModal.card.id)
                }}
              >
                Excluir
              </Button>
          </div>
        </DialogContent>
      </Dialog>

       <ModalError
          open={isErrorModalOpenBoard}
          setIsErrorModalOpen={setIsErrorModalOpenBoard}
          error={errorBoard}
        />
        <ModalError
          open={isErrorModalOpen}
          setIsErrorModalOpen={setIsErrorModalOpen}
          error={error}
        />
    </div>
  )
}
