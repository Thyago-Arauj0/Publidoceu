"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { CreatePostModal } from "@/components/create-post-modal"

interface DashboardHeaderProps {
  onCreatePost: (post: any) => void,
  boardId: string
}

export function DashboardHeader({ onCreatePost, boardId }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Dashboard
              </Button>
          </div>


          <div className="flex items-center gap-4">
            <CreatePostModal onCreatePost={onCreatePost} boardId={boardId}/>
          </div>
        </div>
      </div>
    </header>
  )
}
