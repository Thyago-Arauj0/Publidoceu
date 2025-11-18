'use server'

import { Card, Feedback } from "../types/cardType";
import { serverAuthFetch } from "./Auth";

// import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getCards = async (boardId: string): Promise<Card[]> => {
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/`, {
      method: "GET",
      // next: { 
      //   revalidate: 600,
      //   tags: ['cards']
      //  },
    });
  }catch(error){
    console.error('❌ Erro na requisição dos cards:', error);
    throw error;
  }

};

export const getCard = async (boardId: string, cardId: string): Promise<Card> => {
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "GET",
      // next: { 
      //   revalidate: 600,
      //   tags: ['cards']
      //  },
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
): Promise<void> => {
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }catch(error){
    console.error('❌ Erro na atualização de status:', error);
    throw error;
  }

  // revalidateTag('cards');
};

export const addFeedback = async (
  boardId: string,
  cardId: string,
  feedbackText: string
): Promise<Feedback> => {

  // revalidateTag('cards');
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "PATCH",
      body: JSON.stringify({ feedback: { text: feedbackText } }),
    });
  }catch(error){
    console.error('❌ Erro ao adicionar feedback:', error);
    throw error;
  }
};

export const createCard = async (form: FormData): Promise<Card> => {
  // revalidateTag('cards');
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/`, {
      method: "POST",
      body: form, 
    });
  }catch(error){
    console.error('❌ Erro ao criar card:', error);
    throw error;
  }
}


export const updateCard = async (form: FormData, cardId: string): Promise<Card> => {
  // revalidateTag('cards');
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/${form.get("board")}/card/${cardId}/`, {
      method: "PATCH",
      body: form, 
    });
  }catch(error){
    console.error('❌ Erro na atualização de card:', error);
    throw error;
  }
}


export const deleteCard = async (boardId: string, cardId: string): Promise<string> => {
  try{
    serverAuthFetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/${cardId}/`, {
      method: "DELETE",
    });

    return ({ message: "Card deletado com sucesso." }).message;
  }catch(error){
    console.error('❌ Erro ao deletar card:', error);
    throw error;
  }
  // revalidateTag('cards');
}


