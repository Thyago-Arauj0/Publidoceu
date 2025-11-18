import { ClientDashboard } from "@/components/client/client-dashboard"
import { getBoards } from "@/lib/services/Board"
import { getCards } from "@/lib/services/Card"
import { getUser } from "@/lib/services/User"

import { Card } from "@/lib/types/cardType"

interface ClientPageProps {
  params: {
    userId: string
  }
}


export default async function ClientPage({ params }: ClientPageProps) {

  try {
    const boards = await getBoards()
    const user = await getUser(params.userId)
    const board = boards.find(b => String(b.customer) === params.userId)
    let cards: Card[] = []
    if(board){
      cards = await getCards(String(board.id))
    }

    return <ClientDashboard user={user}  cards={cards} error={null}/>
  }catch(error:any){
    return (
      <ClientDashboard
        cards={[]}
        error={error.message ?? "Erro inesperado"}
      />
    )
  }
}
