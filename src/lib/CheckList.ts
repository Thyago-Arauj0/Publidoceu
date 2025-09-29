import { CheckList } from "./types/cardType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { authFetch } from "./Auth";

export const getCheckLists = async (cardId: string): Promise<CheckList[]> => {
  return authFetch<CheckList[]>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
    method: "GET",
  });
}
export const createCheckList = async (cardId: string, form: FormData): Promise<CheckList> => {
  return authFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/`, {
    method: "POST",
    body: form, 
  });
}

export const updateCheckList = async (cardId: string, checklistId: string, form: FormData): Promise<CheckList> => {
  return authFetch<CheckList>(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
    method: "PATCH",
    body: form, 
  });
}

export const deleteCheckList = async (cardId: string, checklistId: string): Promise<string> => {
  await authFetch(`${API_BASE_URL}/api/v1/card/${cardId}/checklist/${checklistId}/`, {
    method: "DELETE",
  });
  return "Checklist deletada com sucesso";
}