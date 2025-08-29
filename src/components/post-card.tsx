"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, User, Calendar } from "lucide-react"
import Image from "next/image"

interface Post {
  id: string
  title: string
  description: string
  client: string
  clientId: string
  status: string
  createdAt: string
  image?: string
}

interface PostCardProps {
  post: Post
  onMove: (postId: string, newStatus: string) => void
}

const statusOptions = [
  { value: "ideias", label: "Ideias" },
  { value: "em-aprovacao", label: "Em Aprovação" },
  { value: "aprovadas", label: "Aprovadas" },
  { value: "reprovadas", label: "Reprovadas" },
]

export function PostCard({ post, onMove }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ideias":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "em-aprovacao":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "aprovadas":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "reprovadas":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">{post.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {post.image && (
          <div className="relative h-32 w-full rounded-md overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <p className={`text-sm text-gray-600 dark:text-gray-400 ${isExpanded ? "" : "line-clamp-2"}`}>
          {post.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User className="h-3 w-3" />
          <span>{post.client}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(post.status)}>
            {statusOptions.find((opt) => opt.value === post.status)?.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Mover
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions
                .filter((option) => option.value !== post.status)
                .map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => onMove(post.id, option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
