import { Card } from "./types/card";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getCards = async (boardId: string): Promise<Card[]> => {
  const token = Cookies.get("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/board/${boardId}/card/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar perfil");
  }

  const data = await response.json();
  console.log("Cards data:", data);
  return data;
};