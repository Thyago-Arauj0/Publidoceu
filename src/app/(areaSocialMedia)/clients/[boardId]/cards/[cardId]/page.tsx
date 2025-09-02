import CardDetails from "@/components/card-details"


interface PostApprovalPageProps {
  params: {
    boardId: string
    cardId: string
  }
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  console.log("Params:", params.boardId, params.cardId)
  return <CardDetails boardId={params.boardId} cardId={params.cardId} />
}
