import CardDetails from "@/components/card-details"
import React from "react";

interface PostApprovalPageProps {
  params: Promise<{ boardId: string; cardId: string }>
}

export default function PostApprovalPage({ params }: PostApprovalPageProps) {
  const { boardId, cardId } = React.use(params)
  return <CardDetails boardId={boardId} cardId={cardId} />
}
