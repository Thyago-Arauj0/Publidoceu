import { useState} from "react";
import { Card, CheckList as CheckListType } from "@/lib/types/cardType";
import { deleteCheckList, updateCheckList } from "@/lib/services/CheckList";
import { useItemLoading } from "@/hooks/use-item-loading"

export default function useChecklist(card: Card) {

  const [Checklists, setChecklists] = useState<CheckListType[]>([])
  const { isLoadingItem: isLoadingChecklist, startLoading, stopLoading } = useItemLoading()


  const handleToggleChecklist = async (itemId: number, itemData: CheckListType) => {
    startLoading(itemId)
    try {
      const updated = await updateCheckList(
        card.id.toString(), 
        itemId.toString(), 
        !itemData.is_check, 
        itemData.title
      );

      setChecklists((prev) =>
        prev.map((chk) =>
          chk.id === itemId ? { ...chk, is_check: updated.is_check } : chk
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar checklist:", err);
    }finally {
      stopLoading(itemId)
    }
  };


  const handleDeleteChecklist = async (checklistId: string) => {
      if (!card) return;
  
      if (!confirm("Deseja realmente excluir este checklist?")) return;
  
      try {
        await deleteCheckList(card.id.toString(), checklistId);
        setChecklists((prev) => prev.filter((item) => item.id.toString() !== checklistId));
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
  

  return { Checklists, setChecklists, handleToggleChecklist, isLoadingChecklist, handleDeleteChecklist, isChecklistCompleted, getCheckListTitle};
}