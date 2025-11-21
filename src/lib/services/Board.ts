'use server'
import { Board } from "../types/boardType";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import { serverAuthFetch } from "./Auth";


export const getBoards = async (): Promise<Board[]> => {

  try{
    return serverAuthFetch(`${API_BASE_URL}/api/v1/board/`, {
      method: "GET",
      cache: 'force-cache', 
      // next: { revalidate: 1800 },
    });
  }catch(error){
    console.error('❌ Erro na requisição do Board:', error);
    throw error;
  }
};

