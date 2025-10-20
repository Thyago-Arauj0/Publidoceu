
import { getCard } from "@/lib/services/Card";
import { Card as CardType} from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect, use } from "react";

export default function useFoundCards(boards: Board[], cardId: string) {
  const [card, setCard] = useState<CardType>({} as CardType)
  const [isLoadingCard, setIsLoading] = useState(true)

  useEffect(() => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }

    const board = boards[0];

    const fetchCard = async () => {
      setIsLoading(true); 
      try {
        const data: CardType = await getCard(String(board.id), cardId);
        setCard(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setCard({} as CardType);
      }finally {
      setIsLoading(false); // 🔹 sempre desliga
      }
    };

    fetchCard();
  }, [boards]);

  return { card, isLoadingCard, setCard };
}