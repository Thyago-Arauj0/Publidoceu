'use server'

import { Card, Feedback } from "../types/cardType";
import { serverAuthFetch } from "./Auth";

import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getCards = async (boardId: string): Promise<Card[]> => {
  try{
    return serverAuthFetch<Card[]>(`${API_BASE_URL}/api/v1/board/${boardId}/card/`, {
      method: "GET",
      next: { 
        revalidate: 600,
        tags: ['cards']
       },
    });
  }catch(error){
    console.error('❌ Erro na requisição dos cards:', error);
    throw error;
  }

};

export const getCard = async (boardId: string, cardId: string): Promise<Card> => {
  try{
    return serverAuthFetch<Card>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "GET",
      next: { 
        revalidate: 600,
        tags: ['cards']
       },
    });
  }catch(error){
    console.error('❌ Erro na requisição do card:', error);
    throw error;
  }
};

export const updateCardStatus = async (
  boardId: string,
  cardId: string,
  status: string
): Promise<Card> => {
  try{
    const result = serverAuthFetch<Card>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    revalidateTag('cards');

    return result
    
  }catch(error){
    console.error('❌ Erro na atualização de status:', error);
    throw error;
  }
};

export const addFeedback = async (
  boardId: string,
  cardId: string,
  feedbackText: string
): Promise<Feedback> => {
  try{
     const result =  serverAuthFetch<Feedback>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "PATCH",
      body: JSON.stringify({ feedback: { text: feedbackText } }),
    });
    revalidateTag('cards');

    return result
  }catch(error){
    console.error('❌ Erro ao adicionar feedback:', error);
    throw error;
  }
};

export const createCard = async (form: FormData): Promise<Card> => {
  try{
     const result = serverAuthFetch<Card>(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/`, {
      method: "POST",
      body: form, 
    });
     revalidateTag('cards');
     return result
  }catch(error){
    console.error('❌ Erro ao criar card:', error);
    throw error;
  }
}


export const updateCard = async (form: FormData, cardId: string): Promise<Card> => {
  try{
     const result =  serverAuthFetch<Card>(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/${cardId}/`, {
      method: "PATCH",
      body: form, 
    });
     revalidateTag('cards');
     return result
  }catch(error){
    console.error('❌ Erro na atualização de card:', error);
    throw error;
  }
}


export const deleteCard = async (boardId: string, cardId: string): Promise<string> => {
  try{
    await serverAuthFetch<null>(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "DELETE",
    });

    revalidateTag('cards');
    return ({ message: "Card deletado com sucesso." }).message;
  }catch(error){
    console.error('❌ Erro ao deletar card:', error);
    throw error;
  }
}


