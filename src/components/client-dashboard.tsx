"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Eye, ChevronLeft, ChevronRight, Calendar, Grid } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCards } from "@/lib/Card"
import { logoutUser } from "@/lib/AuthService"
import { getUser } from "@/lib/User"
import { Card as CardType} from "@/lib/types/cardType"
import NotificationsDropdown from "./notification-dropdown"
import Footer from "./footer"
import { getBoard } from "@/lib/Board"
import { Board } from "@/lib/types/boardType"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import Loading from "@/app/(areaClient)/client/[userId]/loading"

interface Props {
  userId: string;
}

interface Week {
  start: Date;
  end: Date;
  cards: CardType[];
}

export function ClientDashboard({ userId }: Props) {
  const [cards, setCards] = useState<CardType[]>([])
  const [filteredCards, setFilteredCards] = useState<CardType[]>([])
  const [user, setUser] = useState<any>({})
  const [currentWeek, setCurrentWeek] = useState<number>(0)
  const [weeks, setWeeks] = useState<Week[]>([])
  const [showAll, setShowAll] = useState<boolean>(false)
  const [boards, setBoards] = useState<Board[]>([])
  const router = useRouter()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  const handleLogout =  async() => {
    await logoutUser()
    router.push("/login")
  }

useEffect(() => {
  const fetchBoard = async () => {
    setIsLoading(true); 
    try {
      const fetchedBoards = await getBoard();
      if (fetchedBoards && fetchedBoards.length > 0) {
        setBoards(fetchedBoards);
      } else {
        console.error("Nenhum board encontrado");
        setError("Nenhum board disponível");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao buscar boards:", error);
      setError("Erro ao carregar boards");
      setIsErrorModalOpen(true);
    }finally {
      setIsLoading(false); // 🔹 sempre desliga
    }
  };
  fetchBoard();
}, []);

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
      setError("Erro ao carregar dados");
      setIsErrorModalOpen(true);
    }finally {
      setIsLoading(false); // 🔹 sempre desliga
    }
  };

  fetchData();
}, [boards, userId]);

  // Função para organizar os cards por semana
  const organizeCardsByWeek = (cards: CardType[]) => {
    if (cards.length === 0) {
      setWeeks([]);
      setFilteredCards([]);
      return;
    }
    
    // Ordenar cards por data (do mais recente para o mais antigo)
    const sortedCards = [...cards].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Criar um mapa de semanas
    const weekMap = new Map<string, CardType[]>();
    
    sortedCards.forEach(card => {
      const cardDate = new Date(card.created_at);
      // Obter o início da semana (segunda-feira)
      const weekStart = getStartOfWeek(cardDate);
      const weekKey = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      weekMap.get(weekKey)!.push(card);
    });
    
    // Converter o mapa em array de semanas ordenadas (da mais recente para a mais antiga)
    const weeksArray: Week[] = Array.from(weekMap.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([weekStartStr, weekCards]) => {
        const weekStart = new Date(weekStartStr);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        return {
          start: weekStart,
          end: weekEnd,
          cards: weekCards
        };
      });
    
    setWeeks(weeksArray);
    
    // Mostrar a semana mais recente por padrão
    if (weeksArray.length > 0) {
      setCurrentWeek(0);
      setFilteredCards(weeksArray[0].cards);
    }
  };

  // Função para obter o início da semana (segunda-feira)
  const getStartOfWeek = (date: Date): Date => {
    const result = new Date(date);
    const day = result.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // ajuste para segunda-feira
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  // Filtrar cards pela semana selecionada
  const filterCardsByWeek = (weekIndex: number) => {
    if (weekIndex >= 0 && weekIndex < weeks.length) {
      setFilteredCards(weeks[weekIndex].cards);
    }
  };

  // Mostrar todos os cards
  const showAllCards = () => {
    setShowAll(true);
    setFilteredCards(cards);
  };

  // Voltar para a visualização por semana
  const showWeeklyView = () => {
    setShowAll(false);
    if (weeks.length > 0) {
      filterCardsByWeek(currentWeek);
    }
  };

  // Navegar para a semana anterior
  const goToPreviousWeek = () => {
    if (currentWeek < weeks.length - 1) {
      const newWeek = currentWeek + 1;
      setCurrentWeek(newWeek);
      filterCardsByWeek(newWeek);
    }
  };

  // Navegar para a próxima semana
  const goToNextWeek = () => {
    if (currentWeek > 0) {
      const newWeek = currentWeek - 1;
      setCurrentWeek(newWeek);
      filterCardsByWeek(newWeek);
    }
  };

  // Formatar data para exibição
  const formatDateRange = (start: Date, end: Date) => {
    const isSameMonth = start.getMonth() === end.getMonth();
    const isSameYear = start.getFullYear() === end.getFullYear();
    
    if (isSameMonth && isSameYear) {
      return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleDateString('pt-BR', { month: 'long' })} ${isSameYear ? '' : start.getFullYear()}`;
    } else if (isSameYear) {
      return `${start.getDate()} de ${start.toLocaleDateString('pt-BR', { month: 'long' })} - ${end.getDate()} de ${end.toLocaleDateString('pt-BR', { month: 'long' })} ${start.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      todo: "A Fazer",
      in_progress: "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
      disapprove: "Reprovado",
      aprovadas: "Aprovado",
      reprovadas: "Reprovado",
    } as const;

    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      in_progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-black",
      done: "bg-green-500 text-white",
      disapprove: "bg-red-500 text-white",
      aprovadas: "bg-green-600 text-white",
      reprovadas: "bg-red-600 text-white",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  
  if (isLoading) {
    return <Loading />
  }


  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Cliente" />
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || "Carregando..."}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
              </div>
            </div>

            {/* <NotificationsDropdown></NotificationsDropdown> */}

            <Button variant="outline" onClick={handleLogout} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

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
                {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'}
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
                <div className="flex items-start justify-between gap-3">
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
                    className="w-full border-gray-200 cursor-pointer py-5 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
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