import CardDetails from "@/components/admin/card-details"
import React from "react";

interface PostApprovalPageProps {
  params: Promise<{ userId: string; cardId: string }>
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  const { userId, cardId } = React.use(params)
  return <CardDetails userId={userId} cardId={cardId} />
}
