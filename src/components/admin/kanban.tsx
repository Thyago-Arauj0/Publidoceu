'use client'

import { KanbanCard } from "@/components/admin/kanban-card"
import Loading from "@/app/(areaSocialMedia)/clients/[userId]/loading"
import ModalError from "../others/modal-error"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import useCards from "@/hooks/use-cards"
import ConfirmModal from "../others/modal-confirm"
import { Card } from "@/lib/types/cardType"
import { useState, useEffect } from "react"
import { Board } from "@/lib/types/boardType"
import { DashboardHeader } from "./dashboard-header"

interface KanbanProps {
  cards: Card[],
  userId: string | '',
  boards: Board[],
  error: string | null
}


export function Kanban({ cards, userId, boards, error }: KanbanProps) {

  const [isLoading, setIsLoading] = useState(true)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [err, setError] = useState<string | null>(null)
  
  const {
    setCards, activeStatus, setActiveStatus, statusList, confirmModalCard, 
    openDeleteModal, handleDeleteCard, handleUpdateCard, getCardsByStatus, moveCard, setConfirmModalCard
  } = useCards(boards, userId)

  useEffect(()=>{
    setCards(cards)
  }, [])

  const [newPosts, setNewPosts] = useState<any[]>([])

  useEffect(() => {
    if (error) {
      setIsErrorModalOpen(true)
      setError(error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])
  
 const handleCreatePost = (post: any) => {
  setNewPosts(prev => [...prev, post])
}

  useEffect(() => {
    if (newPosts.length > 0) {
      setCards(prev => [...prev, ...newPosts])
    }
  }, [newPosts])


  return (
    <>
      <DashboardHeader onCreatePost={handleCreatePost} boards={boards} userId={userId} />
      <div className="container mx-auto px-4 py-6 min-h-screen">
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

        <ModalError
          open={isErrorModalOpen}
          setIsErrorModalOpen={setIsErrorModalOpen}
          error={err}
        />

        <ConfirmModal
          isOpen={confirmModalCard.isOpen}
          setIsOpen={(open) => setConfirmModalCard(prev => ({ ...prev, isOpen: open }))}
          action="delete"
          item={{  id: confirmModalCard.card?.id ?? 0, title: confirmModalCard.card?.title }}
          handleDelete={(id) => {
            const board = boards?.find(b => String(b.customer) === String(userId))
            if (!board) return
            handleDeleteCard(Number(board.id), Number(id))
          }}
        />


      </div>
    </>
  )
}
