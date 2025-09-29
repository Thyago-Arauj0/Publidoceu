"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { CreatePostModal } from "@/components/create-post-modal"

interface DashboardHeaderProps {
  onCreatePost: (post: any) => void,
  userId: string
}

export function DashboardHeader({ onCreatePost, userId }: DashboardHeaderProps) {
  const router = useRouter()


  return (
    <header className="bg-[#1e3a5f] dark:bg-gray-800 border-b text-white border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Dashboard
              </Button>
          </div>


          <div className="flex items-center gap-4">
            <CreatePostModal onCreatePost={onCreatePost} userId={userId}/>
          </div>
        </div>
      </div>
    </header>
  )
}
