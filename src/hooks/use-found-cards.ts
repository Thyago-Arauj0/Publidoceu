
// import { getCards } from "@/lib/services/Card";
// import { Card as CardType} from "@/lib/types/cardType"
// import { Board } from "@/lib/types/boardType";
// import { useState, useEffect } from "react";

// export default function useFoundCard(boards: Board[], userId?: string) {
//   const [cards, setCards] = useState<CardType[]>([])
//   const [isLoadingCards, setIsLoadingCards] = useState(true)
//   const [isErrorModalOpenCards, setIsErrorModalOpenCards] = useState(false);
//   const [errorCards, setErrorCards] = useState<string | null>(null);

//  useEffect(() => {
//     if (!boards || boards.length === 0) {
//       console.log("Aguardando boards...");
//       return;
//     }
//     const board = boards.find(board => String(board.customer) === userId);
//     if (!board) {
//       console.error("Nenhum board correspondente encontrado para este cliente.");
//       return;
//     }
//     const fetchData = async () => {
//       setIsLoadingCards(true);
//       try {
//         const cards = await getCards(String(board.id));
//         setCards(cards);
//       } catch (error) {
//         console.error("Erro ao buscar cards:", error);
//         setErrorCards("Nenhum Card encontrado");
//         setIsErrorModalOpenCards(true);
//       }finally {
//         setIsLoadingCards(false);
//       }
//     };

//     fetchData();
//   }, [boards]);

//   return { cards, isLoadingCards, setCards, isErrorModalOpenCards, errorCards, setIsErrorModalOpenCards };
// }

import { useState, useEffect } from "react"
import { getCards } from "@/lib/services/Card"
import { Card as CardType } from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType"

export default function useFoundCards(
  boards: Board[],
  userId?: string,
  newPosts: CardType[] = []
) {
  const [cards, setCards] = useState<CardType[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [isErrorModalOpenCards, setIsErrorModalOpenCards] = useState(false)
  const [errorCards, setErrorCards] = useState<string | null>(null)

  useEffect(() => {
    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...")
      return
    }

    const board = boards.find(b => String(b.customer) === userId)
    if (!board) {
      console.error("Nenhum board correspondente encontrado para este cliente.")
      return
    }

    const fetchData = async () => {
      setIsLoadingCards(true)
      try {
        const fetchedCards = await getCards(String(board.id))

        // 🔁 Combina cards do backend com newPosts (sem duplicar)
        const mergedCards = [
          ...fetchedCards,
          ...newPosts.filter(np => !fetchedCards.some(fc => fc.id === np.id))
        ]

        setCards(mergedCards)
      } catch (error) {
        console.error("Erro ao buscar cards:", error)
        setErrorCards("Nenhum Card encontrado")
        setIsErrorModalOpenCards(true)
      } finally {
        setIsLoadingCards(false)
      }
    }

    fetchData()
  }, [boards, userId, newPosts])

  return {
    cards,
    setCards,
    isLoadingCards,
    errorCards,
    isErrorModalOpenCards,
    setIsErrorModalOpenCards,
  }
}
