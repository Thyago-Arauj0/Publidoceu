'use server'

import { CheckList } from "../types/cardType";
import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { serverAuthFetch } from "./Auth";

export const getCheckLists = async (cardId: string): Promise<CheckList[]> => {
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
      method: "GET",
      next: { 
        revalidate: 600,
        tags:["checklists"] 
      },
    });
  }catch(error){
    console.error('❌ Erro na requisição de checklists:', error);
    throw error;
  }
}

export const createCheckList = async (cardId: string, form: FormData): Promise<CheckList> => {
  try{
    const response = serverAuthFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
      method: "POST",
      body: form, 
    });
     revalidateTag('checklists');
     return response
  }catch(error){
    console.error('❌ Erro ao criar checklist:', error);
    throw error;
  }
}

export const updateCheckList = async (cardId: string, checklistId: string, status: boolean, text?: string): Promise<CheckList> => {

  try{
    const response = serverAuthFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_check: status, title: text }), 
    });
    revalidateTag('checklists');
    return response
  }catch(error){
    console.error('❌ Erro ao atualizar checklist:', error);
    throw error;
  }
}

export const deleteCheckList = async (cardId: string, checklistId: string): Promise<string> => {
  try{
    await serverAuthFetch<null>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
      method: "DELETE",
    });
    revalidateTag('checklists');
    return "Checklist deletada com sucesso";
  }catch(error){
    console.error('❌ Erro ao deletar checklist:', error);
    throw error;
  }
}