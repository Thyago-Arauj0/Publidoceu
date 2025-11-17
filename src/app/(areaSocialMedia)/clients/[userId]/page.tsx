"use server"

import React from "react"
import { Kanban } from "@/components/admin/kanban"
import Footer from "@/components/footer"
import { getBoards } from "@/lib/services-server/Board"
import { getCards } from "@/lib/services-server/Card"
import { Card } from "@/lib/types/cardType"


interface ClientPageProps {
  params: {
    userId: string
  }
}

export default async function ClientsPage({ params }: ClientPageProps) {

  try{
    const boards = await getBoards()
    const board = boards.find(b => String(b.customer) === params.userId)
    let cards: Card[] = []
    if(board){
      cards = await getCards(String(board.id))
    }

    return (
      <div className="min-h-screen dark:bg-gray-900">
        <main>
          <Kanban cards={cards} userId={params.userId} boards={boards} error={null} />
        </main>
        <Footer/>
      </div>
    )
  }catch(error: any){

    return (
      <div className="min-h-screen dark:bg-gray-900">
        <main>
          <Kanban cards={[]} userId={''} boards={[]} error={error}/>
        </main>
        <Footer/>
      </div>
    )
  }
}


