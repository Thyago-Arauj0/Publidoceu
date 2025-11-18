'use server'

import { CheckList } from "../types/cardType";
// import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { serverAuthFetch } from "./Auth";

export const getCheckLists = async (cardId: string): Promise<CheckList[]> => {
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
      method: "GET",
      // next: { 
      //   revalidate: 600,
      //   tags:["checklists"] 
      // },
    });
  }catch(error){
    console.error('❌ Erro na requisição de checklists:', error);
    throw error;
  }
}

export const createCheckList = async (cardId: string, form: FormData): Promise<CheckList> => {
  // revalidateTag('checklists');
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
      method: "POST",
      body: form, 
    });
  }catch(error){
    console.error('❌ Erro ao criar checklist:', error);
    throw error;
  }
}

export const updateCheckList = async (cardId: string, checklistId: string, status: boolean, text?: string): Promise<CheckList> => {
  // revalidateTag('checklists');
  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_check: status, title: text }), 
    });
  }catch(error){
    console.error('❌ Erro ao atualizar checklist:', error);
    throw error;
  }
}

export const deleteCheckList = async (cardId: string, checklistId: string): Promise<string> => {
  // revalidateTag('checklists');
  try{
    await serverAuthFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
      method: "DELETE",
    });
    return "Checklist deletada com sucesso";
  }catch(error){
    console.error('❌ Erro ao deletar checklist:', error);
    throw error;
  }
}