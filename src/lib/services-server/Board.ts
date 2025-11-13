'use server'
import { Board } from "../types/boardType";
import { cookies } from "next/headers"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getBoards = async (): Promise<Board[]> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value 
  const response = await fetch(`${API_BASE_URL}/api/v1/board/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    cache: 'no-store', 
    // next: { revalidate: 1800 },
  });

  if (!response.ok) {
    console.error("Erro ao buscar boards:", response.status)
    return []
  }

  return response.json()
};

