"use client"

import { useEffect, useState } from "react"
import { KanbanCard } from "@/components/kanban-card"
import { getCards, updateCardStatus, deleteCard} from "@/lib/CardApi"
import { Card, CardStatus } from "@/lib/types/card"


interface KanbanBoardProps {
  newPosts: Card[],
  boardId: string

}

export function KanbanBoard({ newPosts, boardId }: KanbanBoardProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [activeStatus, setActiveStatus] = useState<CardStatus>("todo")
  const statusList: CardStatus[] = ["todo", "in_progress", "review", "done", "disapprove"]
  const bId = boardId

  useEffect(() => {
    const fetchCards = async () => {
      const fetchedCards: Card[] = await getCards(bId)
      console.log("Fetched cards from API:", fetchedCards)

      // junta os novos posts (se existirem) com os do backend
      setCards([
        ...fetchedCards,
        ...newPosts.filter(np => !fetchedCards.some(fc => fc.id === np.id))
      ])

    }

    fetchCards()
  }, [newPosts])

  const handleDelete = (boardId: number, cardId: number) => {
    if (confirm("Tem certeza que deseja excluir este card?")) {
      const bId = boardId.toString()
      const cId = cardId.toString()
      deleteCard(bId, cId)
        .then(() => {
          console.log("Card excluído com sucesso")
          // Atualiza o estado removendo o card
          setCards(cards.filter(c => c.id !== cardId))
        })
        .catch((error) => {
          console.error("Erro ao excluir o card:", error)
        })
    }
  }


  const getCardsByStatus = (status: string) => {
    return cards.filter((card) => card.status === status)
  }


  const moveCard = (cardId: number, newStatus: CardStatus) => {
    setCards(cards.map(card => card.id === cardId ? { ...card, status: newStatus } : card))
    
      const bId = boardId.toString()
      const cId = cardId.toString()

    updateCardStatus(bId, cId, newStatus).catch(console.error)
  }


  const getStatusLabel = (status: string) => {
    const labels = {
      todo: "A Fazer",
      in_progress: "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
      disapprove: "Reprovado",
      aprovadas: "Aprovado",
      reprovadas: "Reprovado",
    } as const

    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      in_progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-black",
      done: "bg-green-500 text-white",
      disapprove: "bg-red-500 text-white",
      aprovadas: "bg-green-600 text-white",
      reprovadas: "bg-red-600 text-white",
    } as const

    return colors[status as keyof typeof colors] || "bg-gray-500 text-white"
  }

  return (
 <div>
      {/* Botões para navegar entre "páginas" */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusList.map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded ${
              activeStatus === status ? `${getStatusColor(activeStatus)}` : "bg-gray-200 text-gray-800"
            }`}
          >
            {getStatusLabel(status)} ({getCardsByStatus(status).length})
          </button>
        ))}
      </div>
      

      {/* Página atual */}
      <div>
        {getCardsByStatus(activeStatus).length === 0 ? (
          <p className="text-gray-500">Nenhum card nesta categoria.</p>
        ) : (
          <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCardsByStatus(activeStatus).map(card => (
              <KanbanCard
                key={card.id}
                card={card}
                onMove={(bId, cId, status) => moveCard(cId, status)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
