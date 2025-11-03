import { UserProfile } from "../types/userType";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "./Auth";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface JwtPayload {
  user_id: string;
  exp: number;
  iat: number;
}



export const getUser = async (id?: string | number): Promise<UserProfile> => {
  let userId = id;

  // Se não foi passado id, tenta pegar do token
  if (!userId) {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const decoded = jwtDecode<JwtPayload>(token);
    userId = decoded.user_id;
  }

  const data = await authFetch<UserProfile>(
    `${API_BASE_URL}/api/v1/auth/account/${userId}/`,
    { method: "GET" }
  );

  return data;
};