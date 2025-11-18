import { CardStatus, STATUS_LABELS_PT, } from "@/lib/types/cardType"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar } from "lucide-react"
import Link from "next/link"
import { CreatePostModal } from "./create-post-modal"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { Board } from "@/lib/types/boardType"
import { Card as CardType } from "@/lib/types/cardType"
import { UserProfile } from "@/lib/types/userType"

export interface KanbanCardProps {
  card: CardType;
  user: UserProfile | null
  board: Board 
  onMove: (boardId: number , cardId: number, newStatus: CardStatus) => void
  onDelete: (boardId: number, cardId: number) => void
  onUpdateCard?: (updateCard: CardType ) => void
}



const statusOptions = Object.entries(STATUS_LABELS_PT).map(([value, label]) => ({
  value: value as CardStatus,
  label,
}))

export function KanbanCard({ card, user, board, onMove, onDelete, onUpdateCard }: KanbanCardProps) {


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
              board={board}
              user={user}
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
          <span>{card.due_date?.split("-").reverse().join("/") || "Sem data para entrega"}</span>
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
