import { ClientDashboard } from "@/components/client/client-dashboard"
import { getBoards } from "@/lib/services-server/Board"
import { getCards } from "@/lib/services-server/Card"
import { getUser } from "@/lib/services-server/User"

import { Card } from "@/lib/types/cardType"

interface ClientPageProps {
  params: {
    userId: string
  }
}


export default async function ClientPage({ params }: ClientPageProps) {
  const boards = await getBoards()
  const user = await getUser(params.userId)
  const board = boards.find(b => String(b.customer) === params.userId)
  let cards: Card[] = []
  if(board){
    cards = await getCards(String(board.id))
  }

  return <ClientDashboard user={user} boards={boards} cards={cards}/>
}
