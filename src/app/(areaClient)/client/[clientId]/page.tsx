import { ClientDashboard } from "@/components/client-dashboard"

interface ClientPageProps {
  params: {
    clientId: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  return <ClientDashboard boardId={params.clientId} />
}
