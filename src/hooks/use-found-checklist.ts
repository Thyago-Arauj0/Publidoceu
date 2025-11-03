import { useState, useEffect, use } from "react";
import { CheckList as CheckListType } from "@/lib/types/cardType";
import { Board } from "@/lib/types/boardType";
import { getCheckLists, deleteCheckList } from "@/lib/services/CheckList";


export default function useFoundChecklist(boards: Board[], cardId: number) {

  const [checklist, setChecklist] = useState<CheckListType[]>([])
  const [isLoadingCheckList, setIsLoading] = useState(true)
  const [isErrorModalOpenChecklist, setIsErrorModalOpenChecklist] = useState(false);
  const [errorChecklist, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      console.log('check')
      return;
    }

    const fetchChecklists = async () => {
      setIsLoading(true);
      try {
        // Buscar checklists
        const checklistData = await getCheckLists(cardId.toString());
        setChecklist(checklistData);

      } catch (error) {
        setError("Nenhum checklist encontrado");
        setIsErrorModalOpenChecklist(true);
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchChecklists();
  }, [cardId]);

  const handleDeleteChecklist = async (checklistId: string) => {
      if (!cardId) return;
  
      if (!confirm("Deseja realmente excluir este checklist?")) return;
  
      try {
        await deleteCheckList(cardId.toString(), checklistId);
        setChecklist((prev) => prev.filter((item) => item.id.toString() !== checklistId));
      } catch (err) {
        console.error("Erro ao excluir checklist:", err);
      }
    };

      // Função auxiliar para verificar se um checklist está completo
  const isChecklistCompleted = (checkList: CheckListType): boolean => {
    return checkList.is_check ?? false;
  }


  // Função auxiliar para obter o título do checklist
  const getCheckListTitle = (checkList: CheckListType): string => {
    return 'title' in checkList ? (checkList as any).title : ''
  }
  

  return { checklist, isLoadingCheckList, setChecklist, isErrorModalOpenChecklist, setIsErrorModalOpenChecklist, errorChecklist,
    handleDeleteChecklist, isChecklistCompleted, getCheckListTitle
   };
}