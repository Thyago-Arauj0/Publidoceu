import CardDetails from "@/components/admin/card-details"
import React from "react";
import { getBoards } from "@/lib/services-server/Board";
import { getCard } from "@/lib/services-server/Card";
import { getFiles } from "@/lib/services-server/File";
import { getCheckLists } from "@/lib/services-server/CheckList";
import { CheckList } from "@/lib/types/cardType";
import { File } from "@/lib/types/cardType"
import { getUser } from "@/lib/services-server/User"

interface ClientPageProps {
  params: {
    userId: string
    cardId: string
  }
}



export default async function PostApprovalPage({ params }: ClientPageProps) {
  try{
      const boards = await getBoards()
      const board = boards.find(b => String(b.customer) === params.userId)
      const user = await getUser(params.userId)
      const card = await getCard(String(board?.id), params.cardId )
      let files: File[] = []
      let checklists: CheckList[] = []
      if(board && card){
        files = await getFiles(String(board?.id), params.cardId)
        checklists = await getCheckLists(params.cardId)
      }
  
      if(!board){
        return <div>Nenhum board encontrado</div>
      }
    
      return <CardDetails user={user} board={board} card={card} checklists={checklists} files={files} error={null}/>
  }catch(error:any){
     return <CardDetails user={null} board={null} card={null} checklists={[]} files={[]} error={null}/>
  }

}
