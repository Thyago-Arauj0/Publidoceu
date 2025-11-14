'use server'

import { UserProfile } from "../types/userType";
// import { revalidateTag } from "next/cache";

import { serverAuthFetch } from "./Auth";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface JwtPayload {
  user_id: string;
  exp: number;
  iat: number;
}


export const getUser = async (id?: string | number): Promise<UserProfile> => {
  let userId = id;
  const cookiesStore = await cookies()
  const token = cookiesStore.get("access_token")?.value ?? null;

  // Se não foi passado id, tenta pegar do token
  if (!userId) {

    
    if (!token) {
      console.error("❌ Token não encontrado");
      throw new Error("Usuário não autenticado");
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.user_id;
    } catch (decodeError) {
      console.error("❌ Erro ao decodificar token:", decodeError);
      throw new Error("Token inválido");
    }
  }

  try {
    return serverAuthFetch(
      `${API_BASE_URL}/api/v1/auth/account/${userId}/`,
      { method: "GET",
        cache: 'no-store'
       }
    );

  } catch (error) {
    console.error('❌ Erro na requisição getUser:', error);
    throw error;
  }
};



export const getUsers = async (): Promise<UserProfile[]> => {
  try {
    return serverAuthFetch(`${API_BASE_URL}/api/v1/auth/account/`, {
      method: "GET",
      cache: 'no-store'
      // next: { 
      //   revalidate: 600,
      //   tags: ['users']
      //  },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
    throw error;
  }
};


export const createUser = async (
  name: string,
  email: string,
  password?: string,
  first_name?: string | null,
  last_name?: string | null
): Promise<UserProfile> => {
  try {
    return serverAuthFetch(
      `${API_BASE_URL}/api/v1/auth/register/`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password: password || null,
          first_name: first_name ?? null,
          last_name: last_name ?? null,
        }),
      }
    );
  }catch (err: any) {
     parseApiError(err);
  }
};

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
  last_name?: string | null,
): Promise<UserProfile> => {
   try {
    return serverAuthFetch(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
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
    }catch (err: any) {
     parseApiError(err);
  }
}


export const deleteUser = async (id: number | string): Promise<void> => {
  try{
    serverAuthFetch(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
      method: "DELETE",
    })
    // revalidateTag('users');
  }catch(err:any){
    throw new Error("Falha ao excluir cliente.");
  }
}

function parseApiError(err: any): never {
  const message = err?.message || "";

  if (message.includes("unique") || message.includes("email"))
    throw new Error("Este e-mail já está cadastrado. Tente outro.");

  if (message.includes("password"))
    throw new Error("A senha não é válida. Verifique e tente novamente.");

  throw new Error("Erro ao processar requisição. Verifique os dados e tente novamente.");
}
