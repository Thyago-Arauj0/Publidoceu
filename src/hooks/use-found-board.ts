
import { getBoard } from "@/lib/services/Board"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect, use } from "react";

export default function useFoundBoard() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

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
          setIsLoading(false); 
        }
    };

    fetchBoard();
  }, []);

  return { boards, isErrorModalOpen, setIsErrorModalOpen, error, isLoading };
}