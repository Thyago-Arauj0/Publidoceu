import { useState } from "react";
import { Board } from "@/lib/types/boardType";
import { getFiles, deleteFile, updateFile } from "@/lib/services/File";
import { Card, File as FileType } from "@/lib/types/cardType";
import { useItemLoading } from "@/hooks/use-item-loading"

export default function useFiles(board: Board, card: Card) {
  const [Files, setFiles] = useState<FileType[]>([])
  const { isLoadingItem:isLoadingFile, startLoading, stopLoading } = useItemLoading()

  const handleDeleteFile = async (fileId: string) => {

    if (!card) return;

    if (!confirm("Deseja realmente excluir este arquivo?")) return;

    try {
      await deleteFile(board.id.toString(), card.id.toString(), fileId);
      setFiles((prev) => prev.filter((file) => file.id.toString() !== fileId));
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
    }
  };

  const refreshFiles = async () => {
    if (!card) return;
    try {
      const filesData = await getFiles(board.id.toString(), card.id.toString());
      setFiles(filesData);
    } catch (error) {
      console.error("Erro ao atualizar arquivos:", error);
    }
  };

  const handleApproveFile = async (fileId: string) => {
    if (!card.id) return;

    startLoading(parseInt(fileId))
    try {
      // Criar FormData para enviar o status de aprovação
      await updateFile(String(board.id), card.id.toString(), fileId, true);
      
      // Atualizar estado local
      setFiles(prev => prev.map(file => 
        file.id.toString() === fileId ? { ...file, is_approved: true } : file
      ));
    } catch (err) {
      console.error("Erro ao aprovar arquivo:", err);
      // setError("Erro ao aprovar arquivo");
      // setIsErrorModalOpenBoard(true);
    }finally {
      stopLoading(parseInt(fileId))
    }
  };

  const handleDisapproveFile = async (fileId: string) => {
    if (!card.id) return;

    startLoading(parseInt(fileId))
    try {
      // Criar FormData para enviar o status de aprovação
      await updateFile(String(board.id), card.id.toString(), fileId, false);
      
      // Atualizar estado local
      setFiles(prev => prev.map(file => 
        file.id.toString() === fileId ? { ...file, is_approved: false } : file
      ));
    } catch (err) {
      console.error("Erro ao reprovar arquivo:", err);
      // setError("Erro ao reprovar arquivo");
      // setIsErrorModalOpenBoard(true);
    }finally {
      stopLoading(parseInt(fileId))
    }
  };

  return { Files, setFiles, isLoadingFile, handleApproveFile, handleDisapproveFile };
}