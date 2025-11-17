import { useState } from "react"
import { updateCardStatus, deleteCard } from "@/lib/services/Card"
import { Card as CardType, CardStatus } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"

export default function useCards(
  boards: Board[],
  userId?: string | null
) {
  const [activeStatus, setActiveStatus] = useState<CardStatus>("todo") //admin
  const statusList: CardStatus[] = ["todo", "in_progress", "review", "done", "disapprove"] //admin
  const [confirmModalCard, setConfirmModalCard] = useState<{
    isOpen: boolean
    card?: CardType
  }>({ isOpen: false })

  const [cards, setCards] = useState<CardType[]>([])

  const openDeleteModal = (card: CardType) => {
    setConfirmModalCard({ isOpen: true, card })
  }
  
  
  const handleDeleteCard = async (boardId: number, cardId: number) => {
    if (!cardId) return
    try {
      await deleteCard(boardId.toString(), cardId.toString())
      setCards(prev => prev.filter(c => c.id !== cardId))
      setConfirmModalCard({ isOpen: false }) // Fecha o modal apenas depois da exclusão
    } catch (error) {
      console.error("Erro ao excluir o card:", error)
    }
  }
  
  const handleUpdateCard = (updatedCard: CardType) => {
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
  
  
  return {
    cards, setCards, activeStatus, setActiveStatus, statusList, 
    confirmModalCard, openDeleteModal, handleDeleteCard, handleUpdateCard, 
    getCardsByStatus, moveCard, setConfirmModalCard
  }
}
