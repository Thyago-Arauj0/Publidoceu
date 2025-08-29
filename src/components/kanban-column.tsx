import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KanbanColumnProps {
  title: string
  color: string
  count: number
  children: ReactNode
}

export function KanbanColumn({ title, color, count, children }: KanbanColumnProps) {
  return (
    <Card className="h-fit">
      <CardHeader className={`${color} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="text-gray-800 dark:text-gray-200">{title}</span>
          <Badge variant="secondary" className="bg-white/80 text-gray-800">
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 min-h-[400px]">{children}</CardContent>
    </Card>
  )
}
