import { File } from "../types/cardType";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { authFetch } from "./Auth";

export const getFiles = async (boardId: string, cardId: string): Promise<File[]> => {
  try {
    return await authFetch<File[]>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`,
      { method: "GET"}
    );
  } catch (error: any) {
    console.error("Erro ao buscar arquivos:", error);
    throw new Error(error?.message || "Não foi possível buscar os arquivos.");
  }
};

export async function createFile(boardId: string, cardId: string, fileData: { file: string }) {
  const token = Cookies.get("access_token");
  
  console.log("📤 Enviando para backend:", {
    boardId,
    cardId, 
    fileUrl: fileData.file
  });

  const payload = {
    file: fileData.file
  };

  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  console.log("📥 Status da resposta:", response.status);

  // ✅ CORREÇÃO: Clone a resposta ANTES de ler o corpo
  const responseClone = response.clone();
  
  if (!response.ok) {
    let errorMessage = "Erro ao criar arquivo";
    
    try {
      // Use a resposta clonada para ler o corpo
      const errorData = await responseClone.json();
      console.error("❌ Erro detalhado:", errorData);
      errorMessage = errorData.error || errorData.detail || JSON.stringify(errorData);
    } catch {
      // Se não for JSON, leia como texto da resposta clonada
      const text = await responseClone.text();
      errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }

  try {
    // Use a resposta original para o caso de sucesso
    const data = await response.json();
    console.log("✅ Arquivo criado com sucesso:", data);
    return data;
  } catch (e) {
    console.error("❌ Erro ao parsear resposta:", e);
    throw new Error("Resposta inválida do servidor");
  }
}


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
