import { authFetch } from "./Auth";
import { Board } from "./types/boardType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export const getBoards = async (): Promise<Board[]> => {

  return authFetch<Board[]>(`${API_BASE_URL}/api/v1/board/`, {
    method: "GET",
  });
};

export const getBoard = async (): Promise<Board[]> => {

  return authFetch<Board[]>(`${API_BASE_URL}/api/v1/board/`, {
    method: "GET",
  });
};
