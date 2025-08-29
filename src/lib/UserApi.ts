import { UserProfile } from "./types/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface JwtPayload {
  user_id: string;
  exp: number;
  iat: number;
}

export const getUser = async (): Promise<UserProfile> => {
  const token = Cookies.get("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const decoded = jwtDecode<JwtPayload>(token);
  const id = decoded.user_id;
  console.log("ID do usuário logado:", id);
  console.log(`${API_BASE_URL}/api/v1/auth/account//${id}/`);

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
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
  console.log("Profile data:", data);
  return data;
};

