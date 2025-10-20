import { ClientDashboard } from "@/components/client/client-dashboard"

interface ClientPageProps {
  params: {
    userId: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  return <ClientDashboard userId={params.userId} />
}
