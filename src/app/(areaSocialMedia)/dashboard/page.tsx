'use server'

import { ClientManagement } from "@/components/admin/admin-dashboard"
import { getBoards } from "@/lib/services/Board"
import { getUsers } from "@/lib/services/User"
import { getCards } from "@/lib/services/Card"
import { UserProfile } from "@/lib/types/userType"

export default async function DashboardPage() {

  try{
    const boards = await getBoards()
    const users = await getUsers()

    // Busca os cards de cada board (1 requisição por board), em paralelo
    const cardsPerBoardArray = await Promise.all(
      (boards ?? []).map(async (board) => {
        try {
          const cards = await getCards(String(board.id)) // <-- passando board id
          return { boardId: board.id, cards }
        } catch (err) {
          console.error(`Erro ao buscar cards do board ${board.id}`, err)
          return { boardId: board.id, cards: [] as any[] }
        }
      })
    )

    // Agrupa em um mapa { boardId: quantidadeDeCards }
    const cardsByBoard = cardsPerBoardArray.reduce((acc: Record<number, number>, item) => {
      acc[item.boardId] = item.cards.length
      return acc
    }, {})

    // Monta os clients sem fazer fetch por usuário
    const Clients = (users ?? []).map((user: UserProfile) => {
      const board = (boards ?? []).find(b => String(b.customer) === String(user.id))
      const postsCount = board ? (cardsByBoard[board.id] ?? 0) : 0

      return {
        ...user,
        postsCount,
        phone: user.profile?.whatsapp,
        password: "",
        author: user.author,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        created_at: user.profile?.created_at
          ? new Date(user.profile.created_at).toLocaleDateString("pt-BR")
          : new Date().toLocaleDateString("pt-BR"),
      }
    })

    return <ClientManagement users={Clients} error={null}/>
  }catch(error:any){
    return <ClientManagement users={null} error={error}/>
  }
}
