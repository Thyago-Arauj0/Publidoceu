import { PostApproval } from "@/components/card-approval"

interface PostApprovalPageProps {
  params: {
    userId: string
    cardId: string
  }
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  return <PostApproval userId={params.userId} cardId={params.cardId} />
}
