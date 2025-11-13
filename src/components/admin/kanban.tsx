import { KanbanCard } from "@/components/admin/kanban-card"
import Loading from "@/app/(areaSocialMedia)/clients/[userId]/loading"
import ModalError from "../others/modal-error"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import useFoundBoard from "@/hooks/use-found-board"
import useFoundCards from "@/hooks/use-found-cards"
import ConfirmModal from "../others/modal-confirm"
import { KanbanProps } from "@/lib/types/cardType"

export function Kanban({ newPosts, userId }: KanbanProps) {

  const { boards, isErrorModalOpenBoard, setIsErrorModalOpenBoard, errorBoard, isLoadingBoard } = useFoundBoard()
  const {
    isLoadingCards,
    errorCards,
    isErrorModalOpenCards,
    setIsErrorModalOpenCards,
    activeStatus, setActiveStatus, statusList, confirmModalCard, openDeleteModal, handleDeleteCard, handleUpdateCard, getCardsByStatus, moveCard, setConfirmModalCard
  } = useFoundCards(boards, userId, newPosts)


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
      
      {isLoadingBoard && isLoadingCards ? (
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
  )
}
