import { File } from "./types/cardType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { authFetch } from "./Auth";

export const getFiles = async (boardId: string, cardId: string): Promise<File[]> => {
  return authFetch<File[]>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`, {
    method: "GET",
  });
}

export const createFile = async (boardId: string, cardId: string, form: FormData): Promise<File> => {
  return authFetch<File>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`, {
    method: "POST",
    body: form, 
  });
}

export const updateFile = async (boardId: string, cardId: string, fileId: string, status: boolean, file?: string): Promise<File> => {
  return authFetch<File>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_approved: status, file }),
  });
}

export const deleteFile = async (boardId: string, cardId: string, fileId: string): Promise<string> => {
  await authFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`, {
    method: "DELETE",
  });
  return "Arquivo deletado com sucesso";
}