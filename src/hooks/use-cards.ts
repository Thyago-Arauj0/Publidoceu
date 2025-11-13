import { useState, useEffect } from "react"
import { getCards, updateCardStatus, deleteCard } from "@/lib/services/Card"
import { Card as CardType, CardStatus } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"

export default function useFoundCards(
  boards: Board[],
  userId?: string,
  newPosts: CardType[] = []
) {
  const [activeStatus, setActiveStatus] = useState<CardStatus>("todo") //admin
  const statusList: CardStatus[] = ["todo", "in_progress", "review", "done", "disapprove"] //admin
  const [confirmModalCard, setConfirmModalCard] = useState<{
    isOpen: boolean
    card?: CardType
  }>({ isOpen: false }) //admin

  const [cards, setCards] = useState<CardType[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [isErrorModalOpenCards, setIsErrorModalOpenCards] = useState(false)
  const [errorCards, setErrorCards] = useState<string | null>(null)


  useEffect(() => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...")
      return
    }

    const board = boards.find(b => String(b.customer) === userId)
    if (!board) {
      console.error("Nenhum board correspondente encontrado para este cliente.")
      return
    }

    let isMounted = true

    const fetchData = async () => {
      setIsLoadingCards(true)
      try {
        const fetchedCards = await getCards(String(board.id))

        // 🔁 Combina cards do backend com newPosts (sem duplicar)
        const mergedCards = [
          ...fetchedCards,
          ...(newPosts?.filter(np => !fetchedCards.some(fc => fc.id === np.id)) || [])
        ]

        // ✅ CORREÇÃO: Comparação mais robusta para evitar re-renders desnecessários
        setCards(prev => {
          // Se os arrays têm tamanhos diferentes, definitivamente há mudanças
          if (prev.length !== mergedCards.length) {
            return mergedCards
          }

          // Verifica se todos os IDs são os mesmos e na mesma ordem
          const hasChanges = prev.some((card, index) => card.id !== mergedCards[index]?.id)
          
          return hasChanges ? mergedCards : prev
        })

      } catch (error) {
        console.error("Erro ao buscar cards:", error)
        if (isMounted) {
          setErrorCards("Nenhum Card encontrado")
          setIsErrorModalOpenCards(true)
        }
      } finally {
        if (isMounted) setIsLoadingCards(false)
      }
    }

    fetchData() 

    return () => {
      isMounted = false;
    };
  }, [boards, userId, newPosts])



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
    cards,
    setCards,
    isLoadingCards,
    errorCards,
    isErrorModalOpenCards,
    setIsErrorModalOpenCards,
    activeStatus, setActiveStatus, statusList, confirmModalCard, openDeleteModal, handleDeleteCard, handleUpdateCard, getCardsByStatus, moveCard, setConfirmModalCard
  }
}
