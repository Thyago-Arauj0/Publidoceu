import { PostApproval } from "@/components/post-approval"

interface PostApprovalPageProps {
  params: {
    clientId: string
    postId: string
  }
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  return <PostApproval clientId={params.clientId} postId={params.postId} />
}
