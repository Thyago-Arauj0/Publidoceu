"use server";

import { getFiles, createFile, deleteFile, updateFile } from "@/lib/services/File";

export async function actionGetFiles(boardId: string, cardId: string) {
  return await getFiles(boardId, cardId);
}

export async function actionCreateFile(
  boardId: string,
  cardId: string,
  fileUrl: string
) {
  try {
    const payload = { file: fileUrl };

    const result = await createFile(boardId, cardId, payload as any);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Erro ao criar arquivo:", error);
    return {
      success: false,
      error: error.message || "Erro ao salvar arquivo no servidor.",
    };
  }
}

export async function actionDeleteFile(boardId: string, cardId: string, fileId: string) {
  return await deleteFile(boardId, cardId, fileId);
}

export async function actionUpdateFile(
  boardId: string,
  cardId: string,
  fileId: string,
  isApproved: boolean
) {
  return await updateFile(boardId, cardId, fileId, isApproved);
}
