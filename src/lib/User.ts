import { UserProfile } from "./types/userType";
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

export const getUsers = async (): Promise<UserProfile[]> => {
  return authFetch<UserProfile[]>(`${API_BASE_URL}/api/v1/auth/account/`, {
    method: "GET",
  });
}



export const createUser = async (
  name: string,
  email: string,
  password?: string,
  first_name?: string | null,
  last_name?: string | null
): Promise<UserProfile> => {

  return authFetch<UserProfile>(`${API_BASE_URL}/api/v1/auth/register/`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password: password || null,
      first_name: first_name ?? null,
      last_name: last_name ?? null,
    }),
  })
}


export const updateUser = async (
  id: number | string,
  name: string, 
  email: string,
  password?: string,
  profile: {
    whatsapp?: string | null;
  } | null = null,
  is_active?: boolean,
  first_name?: string | null,
  last_name?: string | null
): Promise<UserProfile> => {


  return authFetch<UserProfile>(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      email,
      password,
      profile: profile || { whatsapp: null },
      is_active,
      first_name: first_name ?? null,
      last_name: last_name ?? null,
    }),
  })
}

export const deleteUser = async (id: number | string): Promise<void> => {
  await authFetch<void>(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
    method: "DELETE",
  })
}
