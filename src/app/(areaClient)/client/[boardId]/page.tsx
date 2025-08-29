import { ClientDashboard } from "@/components/client-dashboard"

interface ClientPageProps {
  params: {
    boardId: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  return <ClientDashboard boardId={params.boardId} />
}
