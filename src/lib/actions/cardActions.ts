"use server";

import { createCard, updateCard, updateCardStatus, deleteCard, addFeedback } from "@/lib/services/Card";


export async function actionCreateCard(formData: FormData) {
  return await createCard(formData);
}
export async function actionUpdateCard( formData: FormData, cardId: string) {
  return await updateCard(formData, cardId);
}


export async function actionUpdateCardStatus(
  boardId: string,
  cardId: string,
  newStatus: string
) {
  return await updateCardStatus(boardId, cardId, newStatus);
}


export async function actionDeleteCard(
  boardId: string,
  cardId: string,
) {
  return await deleteCard(boardId, cardId);
}

export async function actionAddFeedback(
  boardId: string,
  cardId: string,
  feedback: string
) {
  return await addFeedback(boardId, cardId, feedback)
  
}