"use client"

import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

interface HeaderClientProps {
  type: "client-dashboard" | "card-approval";
  user?:{ name?: string} | null;
  userId?: string;
  onLogout?: () => void;
}

export default function HeaderClient({ type, user, userId, onLogout }: HeaderClientProps) {

  const router = useRouter();


  if (type === "client-dashboard") {
    return (
      <header className="bg-[#1e3a5f] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Cliente" className="rounded-full" />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-orange-500 dark:text-white">{user?.name || "Carregando..."}</h2>
                <p className="text-sm text-gray-300 dark:text-gray-400">Cliente</p>
              </div>
            </div>


            <Button variant="outline" onClick={onLogout} className="cursor-pointer bg-red-500/80 border-none hover:bg-red-600/80 text-white hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-[#1e3a5f] text-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/client/${userId}`)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

        </div>
      </div>
    </header>
  )
}
