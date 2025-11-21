'use server'

import { File } from "../types/cardType";
import { revalidateTag } from "next/cache";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { serverAuthFetch } from "./Auth";

export const getFiles = async (boardId: string, cardId: string): Promise<File[]> => {
  try {
    return serverAuthFetch(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`,
      { method: "GET",
        next:{
          revalidate: 600,
          tags: ['files']
        }
      }
    );
  } catch (error: any) {
    console.error("Erro ao buscar arquivos:", error);
    throw new Error(error?.message || "Não foi possível buscar os arquivos.");
  }
};

export async function createFile(boardId: string, cardId: string, fileData: { file: string }) {
  const payload = {
    file: fileData.file
  };

  try{
    const response = serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidateTag('files');
    return response
  }catch(error){
    console.error('❌ Erro ao criar arquivo:', error);
    throw error;
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
    const response =  serverAuthFetch<File>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: status, file }),
      }
    );
    revalidateTag('files');
    return response
  } catch (error: any) {
    console.error("Erro ao atualizar arquivo:", error);
    throw new Error(error?.message || "Não foi possível atualizar o arquivo.");
  }
};

export const deleteFile = async (boardId: string, cardId: string, fileId: string): Promise<string> => {
  try {
    await serverAuthFetch<null>(
      `${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/files/${fileId}/`,
      { method: "DELETE" }
    );
    revalidateTag('files');
    return "Arquivo deletado com sucesso";
  } catch (error: any) {
    console.error("Erro ao deletar arquivo:", error);
    throw new Error(error?.message || "Não foi possível deletar o arquivo.");
  }
};
