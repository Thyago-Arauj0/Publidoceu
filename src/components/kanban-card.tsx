import { Card as CardType, CardStatus, STATUS_LABELS_PT, } from "@/lib/types/cardType"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar } from "lucide-react"
import Link from "next/link"
import { CreatePostModal } from "./create-post-modal"
import { Board } from "@/lib/types/boardType"

interface KanbanCardProps {
  card: CardType
  board: Board
  onMove: (boardId: number , cardId: number, newStatus: CardStatus) => void
  onDelete: (boardId: number, cardId: number) => void
  onUpdateCard?: (updateCard: CardType ) => void
}


  const statusOptions = Object.entries(STATUS_LABELS_PT).map(([value, label]) => ({
    value: value as CardStatus,
    label,
  }))

export function KanbanCard({ card, board, onMove, onDelete, onUpdateCard }: KanbanCardProps) {
  const getStatusColor = (status: CardStatus) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "disapprove":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow shadow-none">
      <CardHeader className="pb-3 flex items-start justify-between">
        <CardTitle className="text-sm font-medium line-clamp-2">{card.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" >
              <Link href={`/clients/${board.customer}/cards/${card.id}`} className="w-full" >
               Ver detalhes
              </Link>
            </DropdownMenuItem>
            <CreatePostModal
              onCreatePost={() => {}}
              onUpdatePost={(updatedCard: any) => {
                 if (onUpdateCard) onUpdateCard(updatedCard)
              }}
              userId={String(board.customer)}
              editingCard={card}
              isEditing={true}
            />
            <DropdownMenuItem  onClick={() => onDelete(board.id, card.id)} className="text-red-600 text-center cursor-pointer">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{new Date(card.due_date || "Sem data para entrega").toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={`rounded-full px-2 py-1 ${getStatusColor(card.status)}`}>
            {STATUS_LABELS_PT[card.status as CardStatus]}
          </Badge>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Mover
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions
                .filter((opt) => opt.value !== card.status)
                .map((opt) => (
                  <DropdownMenuItem key={opt.value} onClick={() => onMove(board.id, card.id, opt.value)} className="cursor-pointer">
                    {opt.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
