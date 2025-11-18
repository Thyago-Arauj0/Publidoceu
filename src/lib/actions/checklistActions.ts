"use server";

import { getCheckLists, createCheckList, deleteCheckList, updateCheckList } from "@/lib/services/CheckList";


export async function actionGetChecklists(cardId: string) {
  try {
    const data = await getCheckLists(cardId);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Erro ao buscar checklists:", error);

    return {
      success: false,
      error: error.message || "Erro ao carregar as checklists.",
    };
  }
}

export async function actionCreateCheckList(cardId: string, title: string) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_check", "false");

    const result = await createCheckList(cardId, formData);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Erro ao criar checklist:", error);
    return { success: false, error: error.message || "Erro ao criar checklist." };
  }
}

export async function actionUpdateCheckList(
  cardId: string,
  itemId: string,
  isCheck: boolean,
  title: string
) {
  return await updateCheckList(cardId, itemId, isCheck, title);
}

export async function actionDeleteCheckList(
  cardId: string,
  checklistId: string
) {
  return await deleteCheckList(cardId, checklistId);
}