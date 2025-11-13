import { CheckList } from "../types/cardType";
// import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { authFetch } from "./Auth";

export const getCheckLists = async (cardId: string): Promise<CheckList[]> => {
  return authFetch<CheckList[]>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
    method: "GET",
    // next: { 
    //   revalidate: 600,
    //   tags:["checklists"] 
    // },
  });
}

export const createCheckList = async (cardId: string, form: FormData): Promise<CheckList> => {
  // revalidateTag('checklists');
  return authFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
    method: "POST",
    body: form, 
  });
}

export const updateCheckList = async (cardId: string, checklistId: string, status: boolean, text?: string): Promise<CheckList> => {
  // revalidateTag('checklists');
  return authFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_check: status, title: text }), 
  });
}

export const deleteCheckList = async (cardId: string, checklistId: string): Promise<string> => {
  // revalidateTag('checklists');
  await authFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
    method: "DELETE",
  });
  return "Checklist deletada com sucesso";
}