
import { getBoards } from "@/lib/services/Board"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect, useCallback } from "react";
import { logoutUser } from "@/lib/services/AuthService";
import { useRouter } from "next/navigation";

export default function useFoundBoard() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isErrorModalOpenBoard, setIsErrorModalOpenBoard] = useState(false);
  const [errorBoard, setError] = useState<string | null>(null);
  const [isLoadingBoard, setIsLoading] = useState(true)

  const router = useRouter()

  
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchBoard = async () => {
        setIsLoading(true); 
        try {
          const fetchedBoards = await getBoards();
          if (!fetchedBoards || fetchedBoards.length === 0) {
            setError("Nenhum board disponível");
            setIsErrorModalOpenBoard(true);
          } else {
            setBoards(fetchedBoards);
          }
        } catch (error) {
          console.error("Erro ao buscar boards:", error);
          setError("Erro ao carregar boards");
          setIsErrorModalOpenBoard(true);
          handleLogout()

          await handleLogout();
        }finally {
          setIsLoading(false); 
        }
    };

    fetchBoard();
  }, [handleLogout]);

  return { boards, isErrorModalOpenBoard, setIsErrorModalOpenBoard, errorBoard, isLoadingBoard };
}