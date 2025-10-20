"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronLeft, ChevronRight, Calendar, Grid } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCards } from "@/lib/services/Card"
import { logoutUser } from "@/lib/services/AuthService"
import { getUser } from "@/lib/services/User"
import { Card as CardType} from "@/lib/types/cardType"
import Footer from "../footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import Loading from "@/app/(areaClient)/client/[userId]/loading"
import { getStatusColor } from "@/lib/helpers/getStatusColor"
import { getStatusLabel } from "@/lib/helpers/getStatusLabel"
import { formatDateRange } from "@/lib/helpers/formatDateRange"
import useCardFilters from "@/hooks/use-card-filters"
import HeaderClient from "../header-client"
import useFoundBoard from "@/hooks/use-found-board"


interface Props {
  userId: string;
}


export function ClientDashboard({ userId }: Props) {
  const [cards, setCards] = useState<CardType[]>([])
  const [user, setUser] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const handleLogout =  async() => {
    await logoutUser()
    router.push("/login")
  }


  const { boards, isErrorModalOpen, setIsErrorModalOpen, error } = useFoundBoard();


  useEffect(() => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }
    const board = boards[0];
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user
        const userData = await getUser(userId);
        setUser(userData);

        // Fetch cards
        const cardsData = await getCards(String(board.id));
        setCards(cardsData);
        organizeCardsByWeek(cardsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        // setError("Erro ao carregar dados");
        setIsErrorModalOpen(true);
      }finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [boards, userId]);
  
  const {
    filteredCards,
    currentWeek,
    weeks,
    showAll,
    organizeCardsByWeek,
    filterCardsByWeek,
    showWeeklyView,
    goToPreviousWeek,
    goToNextWeek,
    showAllCards,
    setCurrentWeek
  } = useCardFilters(cards);



  if (isLoading) {
    return <Loading />
  }


  return (
    <div className="min-h-screen dark:bg-gray-900">
      <HeaderClient
        type="client-dashboard"
        user={user}
        userId={userId}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-10 min-h-screen">
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Visualize e aprove os posts criados para você</p>
        </div>

        {/* Controles de Navegação */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base break-words max-w-full">
                {showAll ? "Todos os posts" : (weeks[currentWeek] ? formatDateRange(weeks[currentWeek].start, weeks[currentWeek].end) : '')}
              </span>
              <Badge variant="secondary" className="ml-0 sm:ml-2 mt-2 sm:mt-0">
                {
                  filteredCards.filter((card) => card.status !== "todo" && card.status !== "in_progress").length
                }{' '}
                {
                  filteredCards.filter((card) => card.status !== "todo" && card.status !== "in_progress").length === 0 || 1 ? 'Conteúdo' : 'Conteúdos'
                }
              </Badge>
            </div>
            
            <Button 
              variant={showAll ? "default" : "outline"} 
              onClick={showAll ? showWeeklyView : showAllCards}
              className="flex items-center w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
              size="sm"
            >
              <Grid className="h-4 w-4 mr-2" />
              {showAll ? "Visualizar por semana" : "Ver todos"}
            </Button>
          </div>

          {!showAll && weeks.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousWeek}
                  disabled={currentWeek >= weeks.length - 1}
                  className="flex items-center w-full sm:w-auto order-2 sm:order-1 cursor-pointer"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">Semana Anterior</span>
                  <span className="xs:hidden">Anterior</span>
                </Button>
                
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center order-1 sm:order-2">
                  Semana {weeks.length - currentWeek} de {weeks.length}
                </span>
                
                <Button 
                  variant="outline" 
                  onClick={goToNextWeek}
                  disabled={currentWeek === 0}
                  className="flex items-center w-full sm:w-auto order-3 cursor-pointer"
                  size="sm"
                >
                  <span className="hidden xs:inline">Próxima Semana</span>
                  <span className="xs:hidden">Próxima</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Seletor de Semana (Dropdown) */}
              <div className="mt-4 flex justify-center">
                <select 
                  value={currentWeek}
                  onChange={(e) => {
                    const weekIndex = parseInt(e.target.value);
                    setCurrentWeek(weekIndex);
                    filterCardsByWeek(weekIndex);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full max-w-xs text-sm"
                >
                  {weeks.map((week, index) => (
                    <option key={index} value={index}>
                      Semana {weeks.length - index}: {formatDateRange(week.start, week.end)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        {/* Grid de Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.filter((card) => card.status !== "todo" && card.status !== "in_progress").map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col items-start justify-between gap-3">
                  <CardTitle className="text-lg uppercase font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                    {card.title}
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(card.status)} px-3 py-1 rounded-full text-xs font-medium shrink-0`}
                  >
                    {getStatusLabel(card.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {card.image && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Criado em {new Date(card.created_at).toLocaleDateString("pt-BR")}
                </p>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const cardId = card.id
                      router.push(`/client/${userId}/card/${cardId}`)
                    }}
                    className="w-full bg-[#e04b19] text-white hover:text-gray-50 border-gray-200 cursor-pointer py-5 dark:border-gray-700 hover:bg-[#af411c] dark:hover:bg-gray-800 font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {showAll ? "Nenhum post encontrado" : "Nenhum post nesta semana"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {showAll 
                  ? "Não há posts disponíveis para aprovação no momento." 
                  : "Não há posts disponíveis para a semana selecionada."}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer/>

      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Erro</DialogTitle>
          </DialogHeader>
          <p className="text-red-600 mt-2">{error}</p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsErrorModalOpen(false)} className="cursor-pointer">Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}