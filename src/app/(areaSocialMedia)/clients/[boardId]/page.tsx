
"use client"
import React from "react"
import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { DashboardHeader } from "@/components/dashboard-header"

interface PostApprovalPageProps {
  params: Promise<{ boardId: string }>
}


export default function ClientsPage({ params }: PostApprovalPageProps) {

  const { boardId } = React.use(params)

  const [newPosts, setNewPosts] = useState<any[]>([])

  const handleCreatePost = (post: any) => {
    setNewPosts((prev) => [...prev, post])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onCreatePost={handleCreatePost} boardId={boardId} />
      <main className="container mx-auto px-4 py-6">

        <KanbanBoard newPosts={newPosts} boardId={boardId} />
      </main>
    </div>
  )
}


