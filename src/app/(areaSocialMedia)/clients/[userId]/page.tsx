"use client"

import React from "react"
import { useState } from "react"
import { KanbanBoard } from "@/components/admin/kanban-board"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import Footer from "@/components/footer"

interface PostApprovalPageProps {
  params: Promise<{ userId: string }>
}


export default function ClientsPage({ params }: PostApprovalPageProps) {

  const { userId } = React.use(params)

  const [newPosts, setNewPosts] = useState<any[]>([])

  const handleCreatePost = (post: any) => {
    setNewPosts((prev) => [...prev, post])
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <DashboardHeader onCreatePost={handleCreatePost} userId={userId} />
      <main className="container mx-auto px-4 py-6 min-h-screen">
        <KanbanBoard newPosts={newPosts} userId={userId} />
      </main>
      <Footer/>
    </div>
  )
}


