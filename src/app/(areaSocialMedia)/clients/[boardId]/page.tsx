
"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { DashboardHeader } from "@/components/dashboard-header"

interface PostApprovalPageProps {
  params: {
    boardId: string
  }
}


export default function ClientsPage({ params }: PostApprovalPageProps) {
  const [newPosts, setNewPosts] = useState<any[]>([])

  const handleCreatePost = (post: any) => {
    setNewPosts((prev) => [...prev, post])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onCreatePost={handleCreatePost} />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard - Gerenciamento de Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Organize e gerencie todos os posts dos seus clientes</p>
        </div>
        <KanbanBoard newPosts={newPosts} boardId={params.boardId} />
      </main>
    </div>
  )
}


