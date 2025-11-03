"use server";


import { UserProfile } from "../types/userType";
import { revalidateTag } from "next/cache";
import { authFetch } from "@/lib/services/Auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;



export const getUsers = async (): Promise<UserProfile[]> => {
  try {
    const response = await authFetch<UserProfile[]>(`${API_BASE_URL}/api/v1/auth/account/`, {
      method: "GET",
      next: { 
        revalidate: 600,
        tags: ['users']
       },
    });


    if (!response) {
      throw new Error(`Erro ao buscar usuários`);
    }
    return response;

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
    const response = await authFetch<UserProfile>(
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
    if (!response) {
      throw new Error("Falha ao atualizar usuário.");
    }
    revalidateTag('users');
    return response;
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
    let response = await authFetch<UserProfile>(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
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

    if (!response) {
      throw new Error("Falha ao atualizar usuário.");
    }
    revalidateTag('users');
    return response;
    }catch (err: any) {
     parseApiError(err);
  }
}


export const deleteUser = async (id: number | string): Promise<void> => {
  try{
    await authFetch<void>(`${API_BASE_URL}/api/v1/auth/account/${id}/`, {
      method: "DELETE",
    })
    revalidateTag('users');
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
