"use client"

import { useEffect, useState } from "react"
import { KanbanColumn } from "@/components/kanban-column"
import { PostCard } from "@/components/post-card"

// Mock data - in real app, this would come from API
const initialMockPosts = [
  {
    id: "1",
    title: "Post sobre Black Friday",
    description: "Promoção especial para Black Friday com 50% de desconto",
    client: "Loja ABC",
    clientId: "client-123",
    status: "ideias",
    createdAt: "2024-01-15",
    image: "/black-friday-sale-crowd.png",
  },
  {
    id: "2",
    title: "Campanha de Natal",
    description: "Posts temáticos para a campanha de Natal",
    client: "Empresa XYZ",
    clientId: "client-456",
    status: "em-aprovacao",
    createdAt: "2024-01-14",
    image: "/festive-market-campaign.png",
  },
  {
    id: "3",
    title: "Lançamento de Produto",
    description: "Anúncio do novo produto da linha premium",
    client: "Loja ABC",
    clientId: "client-123",
    status: "aprovadas",
    createdAt: "2024-01-13",
    image: "/product-launch-excitement.png",
  },
  {
    id: "4",
    title: "Post Motivacional",
    description: "Conteúdo motivacional para segunda-feira",
    client: "Coach DEF",
    clientId: "client-789",
    status: "reprovadas",
    createdAt: "2024-01-12",
    image: "/motivational-monday.png",
  },
]

const columns = [
  { id: "ideias", title: "Ideias", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "em-aprovacao", title: "Em Aprovação", color: "bg-yellow-100 dark:bg-yellow-900" },
  { id: "aprovadas", title: "Aprovadas", color: "bg-green-100 dark:bg-green-900" },
  { id: "reprovadas", title: "Reprovadas", color: "bg-red-100 dark:bg-red-900" },
]

interface KanbanBoardProps {
  newPosts: any[]
}

export function KanbanBoard({ newPosts }: KanbanBoardProps) {
  const [posts, setPosts] = useState([...initialMockPosts, ...newPosts])

  useEffect(() => {
    setPosts((prev) => [...initialMockPosts, ...newPosts])
  }, [newPosts])

  const getPostsByStatus = (status: string) => {
    return posts.filter((post) => post.status === status)
  }

  const movePost = (postId: string, newStatus: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, status: newStatus } : post)))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          color={column.color}
          count={getPostsByStatus(column.id).length}
        >
          <div className="space-y-3">
            {getPostsByStatus(column.id).map((post) => (
              <PostCard key={post.id} post={post} onMove={movePost} />
            ))}
          </div>
        </KanbanColumn>
      ))}
    </div>
  )
}
