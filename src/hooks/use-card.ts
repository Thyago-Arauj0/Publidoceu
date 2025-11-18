
import { actionUpdateCardStatus, actionAddFeedback } from "@/lib/actions/cardActions";
import { Card as CardType} from "@/lib/types/cardType"
import { Board } from "@/lib/types/boardType";
import { useState } from "react";

export default function useCard(board: Board) {
  const [Card, setCard] = useState<CardType>({} as CardType)
  const [isLoadingCard, setIsLoadingCard] = useState(false)
  const [isEditingCard, setIsEditingCard] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)

  const handleApproval = async (action: "approve" | "reject") => {
      setIsLoadingCard(true);
      try {
        const newStatus = action === "approve" ? "done" : "disapprove";
        await actionUpdateCardStatus(String(board.id), String(Card.id), newStatus);
        setCard((prev) => ({ ...prev, status: newStatus }));
        setIsEditingCard(false);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      } finally {
        setIsLoadingCard(false);
      }
  };
  
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setIsLoadingFeedback(true);
    try {
      await actionAddFeedback(String(board.id), String(Card.id), feedback);
      setCard((prev) => ({ ...prev, feedback: { id: prev.feedback?.id || 0, card: prev.id, text: feedback } }));
      setFeedback("");
    } catch (error) {
      console.error("Erro ao adicionar feedback:", error);
    } finally {
      setIsLoadingFeedback(false);
    }
  }

  return { Card, setCard, handleApproval, isLoadingCard, isEditingCard, setIsEditingCard, handleFeedbackSubmit, isLoadingFeedback, feedback, setFeedback };
}