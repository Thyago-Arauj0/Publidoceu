import { useState, useEffect, use } from "react";
import { Board } from "@/lib/types/boardType";
import { getFiles, deleteFile } from "@/lib/services/File";
import { File as FileType } from "@/lib/types/cardType";


export default function useFoundFiles(boards: Board[], cardId: number, userId?: string) {

  const [isLoadingFiles, setIsLoading] = useState(true)
  const [files, setFiles] = useState<FileType[]>([])
  const [isErrorModalOpenFiles, setIsErrorModalOpenFiles] = useState(false);
  const [errorFiles, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    if (!boards || boards.length === 0) {
      console.log("Aguardando boards...");
      console.log("file")
      return;
    }

    const board = boards[0];
  
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const filesData = await getFiles(String(board.id), cardId.toString());
        setFiles(filesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Nenhum arquivo disponível");
        setIsErrorModalOpenFiles(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFiles();
  }, [cardId]);


  const handleDeleteFile = async (fileId: string) => {
    const board = boards.find(board => String(board.customer) === String(userId));

    if (!board) {
      console.error("Nenhum board correspondente encontrado para este cliente.");
      return;
    }
    if (!cardId) return;

    if (!confirm("Deseja realmente excluir este arquivo?")) return;

    try {
      await deleteFile(board.id.toString(), cardId.toString(), fileId);
      setFiles((prev) => prev.filter((file) => file.id.toString() !== fileId));
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
    }
  };

  const refreshFiles = async () => {
    const board = boards.find(board => String(board.customer) === String(userId));

    if (!board) {
      console.error("Nenhum board correspondente encontrado para este cliente.");
      return;
    }
    if (!cardId) return;
    try {
      const filesData = await getFiles(board.id.toString(), cardId.toString());
      setFiles(filesData);
    } catch (error) {
      console.error("Erro ao atualizar arquivos:", error);
    }
  };

  return {  files, isLoadingFiles, setFiles, isErrorModalOpenFiles, errorFiles, setIsErrorModalOpenFiles,
    handleDeleteFile, refreshFiles
   };
}