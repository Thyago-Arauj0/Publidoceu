"use client"

import { useState } from "react"
import { KanbanCard } from "@/components/admin/kanban-card"
import { updateCardStatus, deleteCard} from "@/lib/services/Card"
import { Card, CardStatus } from "@/lib/types/cardType"
import Loading from "@/app/(areaSocialMedia)/clients/[userId]/loading"
import ModalError from "../others/modal-error"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import useFoundBoard from "@/hooks/use-found-board"
import useFoundCards from "@/hooks/use-found-cards"
import ConfirmModal from "../others/modal-confirm"

interface KanbanBoardProps {
  newPosts: Card[],
  userId: string
}

export function KanbanBoard({ newPosts, userId }: KanbanBoardProps) {
  const [activeStatus, setActiveStatus] = useState<CardStatus>("todo")
  const statusList: CardStatus[] = ["todo", "in_progress", "review", "done", "disapprove"]
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    card?: Card
  }>({ isOpen: false })

  const { boards, isErrorModalOpenBoard, setIsErrorModalOpenBoard, errorBoard, isLoadingBoard } = useFoundBoard()
  const {
    cards,
    setCards,
    isLoadingCards,
    errorCards,
    isErrorModalOpenCards,
    setIsErrorModalOpenCards,
  } = useFoundCards(boards, userId, newPosts)


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
      
      {isLoadingCards ? (
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

       <ModalError
          open={isErrorModalOpenBoard}
          setIsErrorModalOpen={setIsErrorModalOpenBoard}
          error={errorBoard}
        />
       <ModalError
          open={isErrorModalOpenCards}
          setIsErrorModalOpen={setIsErrorModalOpenCards}
          error={errorCards}
        />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        setIsOpen={(open) => setConfirmModal(prev => ({ ...prev, isOpen: open }))}
        action="delete"
        item={{  id: confirmModal.card?.id ?? 0, title: confirmModal.card?.title }}
        handleDelete={(id) => {
          const board = boards?.find(b => String(b.customer) === String(userId))
          if (!board) return
          handleDelete(Number(board.id), Number(id))
        }}
      />


    </div>
  )
}
