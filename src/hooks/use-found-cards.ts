
import { getCard } from "@/lib/services/Card";
import { Card as CardType} from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect } from "react";

export default function useFoundCards(boards: Board[], cardId: string, userId?: string) {
  const [card, setCard] = useState<CardType>({} as CardType)
  const [isLoadingCard, setIsLoadingCard] = useState(true)
  const [isErrorModalOpenCard, setIsErrorModalOpenCard] = useState(false);
  const [errorCard, setErrorCard] = useState<string | null>(null);

  useEffect(() => {

    if (!boards  || boards.length === 0) {
      console.log("Aguardando boards...");
      return;
    }
  
    let board;

    if (userId) {
      board = boards.find(board => String(board.customer) === String(userId));
    } else {
      board = boards[0];
    }

    if (!board) {
      console.warn("Nenhum board encontrado para o usuário:", userId);
      setErrorCard("Nenhum board encontrado");
      setIsErrorModalOpenCard(true);
      setIsLoadingCard(false);
      return;
    }

    

    const fetchCard = async () => {
      setIsLoadingCard(true); 
      try {
        const data: CardType = await getCard(String(board.id), cardId);
        setCard(data);
      } catch (error) {
        console.error("Erro ao buscar card:", error);
        setErrorCard("Nenhum Card encontrado");
        setIsErrorModalOpenCard(true);
        setCard({} as CardType);
      }finally {
       setIsLoadingCard(false); // 🔹 sempre desliga
      }
    };

    fetchCard();
  }, [boards, cardId]);

  return { card, isLoadingCard, setCard, isErrorModalOpenCard, errorCard, setIsErrorModalOpenCard };
}