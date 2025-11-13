'use server'

import { Card, Feedback } from "../types/cardType";
import { cookies } from "next/headers"
// import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getCards = async (boardId: string): Promise<Card[]> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value 
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    // next: { 
    //   revalidate: 600,
    //   tags: ['cards']
    //  },
  });

  if (!response.ok) {
    console.error("Erro ao buscar boards:", response.status)
    return []
  }
  return response.json()
};

export const getCard = async (boardId: string, cardId: string): Promise<Card> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "GET",
    // next: { 
    //   revalidate: 600,
    //   tags: ['cards']
    //  },
  });

  return response.json()
};

export const updateCardStatus = async (
  boardId: string,
  cardId: string,
  status: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  // revalidateTag('cards');
  return response.json()
};

export const addFeedback = async (
  boardId: string,
  cardId: string,
  feedbackText: string
): Promise<Feedback> => {

  // revalidateTag('cards');
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify({ feedback: { text: feedbackText } }),
  });

  return response.json()
};

export const createCard = async (form: FormData): Promise<Card> => {
  // revalidateTag('cards');
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/`, {
    method: "POST",
    body: form, 
  });

  return response.json()
}


export const updateCard = async (form: FormData, cardId: string): Promise<Card> => {
  // revalidateTag('cards');
  const response = await fetch(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/${cardId}/`, {
    method: "PATCH",
    body: form, 
  });

  return response.json()
}


export const deleteCard = async (boardId: string, cardId: string): Promise<string> => {
  await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
    method: "DELETE",
  });
  // revalidateTag('cards');
  return ({ message: "Card deletado com sucesso." }).message;
}


