import { PostApproval } from "@/components/client/card-approval"
import { getBoards } from "@/lib/services-server/Board"
import { getCard } from "@/lib/services-server/Card"
import { getUser } from "@/lib/services-server/User"
import { getFiles } from "@/lib/services-server/File"
import { getCheckLists } from "@/lib/services-server/CheckList"
import { File } from "@/lib/types/cardType"
import { CheckList } from "@/lib/types/cardType"

interface PostApprovalPageProps {
  params: {
    userId: string
    cardId: string
  }
}

export default async function PostApprovalPage({ params }: PostApprovalPageProps) {

  try{
    const boards = await getBoards()
    const board = boards.find(b => String(b.customer) === params.userId)
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

    return <PostApproval board={board} card={card} checklists={checklists} files={files} error={null}/>
  }catch(error:any){
     return <PostApproval board={null} card={null} checklists={[]} files={[]} error={error.message ?? "Erro inesperado"}/>
  }

  // return <PostApproval userId={params.userId} cardId={params.cardId} />
}
