import { File } from "./types/cardType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { authFetch } from "./Auth";

export const getFiles = async (boardId: string, cardId: string): Promise<File[]> => {
  try {
    return await authFetch<File[]>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`,
      { method: "GET" }
    );
  } catch (error: any) {
    console.error("Erro ao buscar arquivos:", error);
    throw new Error(error?.message || "Não foi possível buscar os arquivos.");
  }
};

export const createFile = async (boardId: string, cardId: string, form: FormData): Promise<File> => {
  try {
    return await authFetch<File>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`,
      {
        method: "POST",
        body: form,
      }
    );
  } catch (error: any) {
    console.error("Erro ao criar arquivo:", error);
    if (error?.message?.includes("413")) {
      throw new Error("O arquivo é muito grande. O limite é 50MB.");
    }
    throw new Error(error?.message || "Não foi possível criar o arquivo.");
  }
};

export const updateFile = async (
  boardId: string,
  cardId: string,
  fileId: string,
  status: boolean,
  file?: string
): Promise<File> => {
  try {
    return await authFetch<File>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: status, file }),
      }
    );
  } catch (error: any) {
    console.error("Erro ao atualizar arquivo:", error);
    throw new Error(error?.message || "Não foi possível atualizar o arquivo.");
  }
};

export const deleteFile = async (boardId: string, cardId: string, fileId: string): Promise<string> => {
  try {
    await authFetch(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`,
      { method: "DELETE" }
    );
    return "Arquivo deletado com sucesso";
  } catch (error: any) {
    console.error("Erro ao deletar arquivo:", error);
    throw new Error(error?.message || "Não foi possível deletar o arquivo.");
  }
};
