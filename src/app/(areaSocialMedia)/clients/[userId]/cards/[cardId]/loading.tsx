import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, List, Clock, MessageSquare, CalendarDays, User } from "lucide-react"

export default function CardDetailSkeleton() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-4xl min-h-screen">
      {/* Header Card */}
      <Card className="flex items-start justify-between border-none shadow-none">
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-64" />

          <div className="flex gap-2 items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16" />
            <User className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Seção de Arquivos */}
        <Card className="border-none shadow-none rounded-xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <Skeleton className="h-9 w-32" />
          </CardHeader>
          <CardContent>
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative rounded-lg overflow-hidden break-inside-avoid">
                  <Skeleton className="w-full h-[200px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção de Descrição */}
        <Card className="border-none shadow-none rounded-xl">
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Checklists */}
        <Card className="border-none shadow-none rounded-xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <List className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <Skeleton className="h-9 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="pl-4 py-2 bg-gray-100 rounded-md flex flex-col md:flex-row justify-between gap-2"
                >
                  <Skeleton className="h-5 w-full md:w-2/3" />
                  <div className="flex justify-end gap-2 px-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção de Cronograma */}
        <Card className="border-none shadow-none rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção de Feedback */}
        <Card className="border-none shadow-none rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4 py-2 bg-white rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
