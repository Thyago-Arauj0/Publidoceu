import { PostApproval } from "@/components/card-approval"

interface PostApprovalPageProps {
  params: {
    boardId: string
    cardId: string
  }
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  return <PostApproval boardId={params.boardId} cardId={params.cardId} />
}
