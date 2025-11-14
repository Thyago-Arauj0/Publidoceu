
import { updateCardStatus } from "@/lib/services/Card";
import { Card as CardType} from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect } from "react";

export default function useCard(board: Board) {
  const [Card, setCard] = useState<CardType>({} as CardType)
  const [isLoadingCard, setIsLoadingCard] = useState(false)
  const [isEditingCard, setIsEditingCard] = useState(false)

  const handleApproval = async (action: "approve" | "reject") => {
      setIsLoadingCard(true);
      try {
        const newStatus = action === "approve" ? "done" : "disapprove";
        await updateCardStatus(String(board.id), String(Card.id), newStatus);
        setCard((prev) => ({ ...prev, status: newStatus }));
        setIsEditingCard(false);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      } finally {
        setIsLoadingCard(false);
      }
  };
  

  return { Card, setCard, handleApproval, isLoadingCard, isEditingCard, setIsEditingCard };
}