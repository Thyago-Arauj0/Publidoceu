import { UserProfile } from "./types/user";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "./Auth";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface JwtPayload {
  user_id: string;
  exp: number;
  iat: number;
}

export const getUser = async (): Promise<UserProfile> => {
  // 🔑 O token só é necessário aqui para decodificar o user_id
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const decoded = jwtDecode<JwtPayload>(token);
  const id = decoded.user_id;

  console.log("ID do usuário logado:", id);

  // ✅ Agora usando authFetch (com refresh automático se precisar)
  const data = await authFetch<UserProfile>(
    `${API_BASE_URL}/api/v1/auth/account/${id}/`,
    { method: "GET" }
  );

  console.log("Profile data:", data);
  return data;
};

export const getUsers = async (): Promise<UserProfile[]> => {
  return authFetch<UserProfile[]>(`${API_BASE_URL}/api/v1/auth/account/`, {
    method: "GET",
  });
}

export const createUser = async (
  name: string,
  email: string,
  password: string,
  first_name?: string,
  last_name?: string
): Promise<UserProfile> => {
  return authFetch<UserProfile>(`${API_BASE_URL}/api/v1/auth/account/`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, first_name, last_name }),
  });
}