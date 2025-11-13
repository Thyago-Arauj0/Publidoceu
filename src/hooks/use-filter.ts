
import { useState, useEffect } from "react";
import { Card as CardType } from "@/lib/types/cardType";

interface Week {
  start: Date;
  end: Date;
  cards: CardType[];
}


export default function useCardFilters(cards: CardType[]) {

  const [filteredCards, setFilteredCards] = useState<CardType[]>([])
  const [currentWeek, setCurrentWeek] = useState<number>(0)
  const [weeks, setWeeks] = useState<Week[]>([])
  const [showAll, setShowAll] = useState<boolean>(false)


  useEffect(() => {
    organizeCardsByWeek(cards);
  }, [cards]);

  // Função para obter o início da semana (segunda-feira)
  const getStartOfWeek = (date: Date): Date => {
      const result = new Date(date);
      const day = result.getDay(); // 0 (domingo) a 6 (sábado)
      const diff = result.getDate() - day + (day === 0 ? -6 : 1); // ajuste para segunda-feira
      result.setDate(diff);
      result.setHours(0, 0, 0, 0);
      return result;
  };



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

    
  // Filtrar cards pela semana selecionada
  const filterCardsByWeek = (weekIndex: number) => {
      if (weekIndex >= 0 && weekIndex < weeks.length) {
        setFilteredCards(weeks[weekIndex].cards);
      }
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

      // Mostrar todos os cards
  const showAllCards = () => {
    setShowAll(true);
    setFilteredCards(cards);
  };



  return {
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
  };
}