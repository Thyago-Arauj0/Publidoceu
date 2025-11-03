"use server"

import { Card, Feedback } from "../types/cardType";
import { authFetch } from "./Auth";
import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getCards = async (boardId: string): Promise<Card[]> => {
  return authFetch<Card[]>(`${API_BASE_URL}/api/v1/board/${boardId}/card/`, {
    method: "GET",
    next: { 
      revalidate: 600,
      tags: ['cards']
     },
  });
};

export const getCard = async (boardId: string, cardId: string): Promise<Card> => {
  return authFetch<Card>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "GET",
    next: { 
      revalidate: 600,
      tags: ['cards']
     },
  });
};

export const updateCardStatus = async (
  boardId: string,
  cardId: string,
  status: string
): Promise<void> => {
  await authFetch<void>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  revalidateTag('cards');
};

export const addFeedback = async (
  boardId: string,
  cardId: string,
  feedbackText: string
): Promise<Feedback> => {

  revalidateTag('cards');
  return authFetch<Feedback>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify({ feedback: { text: feedbackText } }),
  });
};

export const createCard = async (form: FormData): Promise<Card> => {
  revalidateTag('cards');
  return authFetch<Card>(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/`, {
    method: "POST",
    body: form, 
  });
}


export const updateCard = async (form: FormData, cardId: string): Promise<Card> => {
  revalidateTag('cards');
  return authFetch<Card>(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/${cardId}/`, {
    method: "PATCH",
    body: form, 
  });
}


export const deleteCard = async (boardId: string, cardId: string): Promise<string> => {
  await authFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "DELETE",
  });
  revalidateTag('cards');
  return ({ message: "Card deletado com sucesso." }).message;
}


