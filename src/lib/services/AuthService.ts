

console.log('🔍 API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
console.log('🔍 Todas as env:', process.env)



import {  UserProfile, AuthResponse } from "../types/userType";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import Cookies from "js-cookie";
import { getUser } from "@/lib/services/UserClient";
import { authFetchNoAuth } from "./Auth";

export const registerUser = async (data: UserProfile) => {
  const result = await authFetchNoAuth<UserProfile, AuthResponse>(
    `${API_BASE_URL}/api/v1/auth/register/`,
    data
  );
  return result;
};

// export const loginUser = async (credentials: { email: string; password: string }) => {

//   const normaizedEmail = credentials.email.trim().toLowerCase();

//   const result: AuthResponse = await authFetchNoAuth<typeof credentials, AuthResponse>(
//     `${API_BASE_URL}/api/v1/auth/token/`,
//     { email: normaizedEmail, password: credentials.password } 
//   );

//   Cookies.set("access_token", result.access, { expires: 7 });
//   Cookies.set("refresh_token", result.refresh, { expires: 7 });

//   const user = await getUser();

//   if(!result.access || !result.refresh){
//     throw new Error("Erro ao obter tokens de autenticação.");
//   }
//   if(!user){
//     throw new Error("Erro ao obter dados do usuário.");
//   }

//   if(!user.is_active){
//     throw new Error("Usuário inativo. Contate o administrador.");
//   }

//   return {
//     userType: user.is_superuser ? "admin" : "client",
//     user
//   };
// };


export const loginUser = async (credentials: { email: string; password: string }) => {
  const normalizedEmail = credentials.email.trim().toLowerCase();

  try {
    // 1. Faz login e obtém tokens
    const result: AuthResponse = await authFetchNoAuth<typeof credentials, AuthResponse>(
      `${API_BASE_URL}/api/v1/auth/token/`,
      { email: normalizedEmail, password: credentials.password } 
    );

    // 2. Verifica se os tokens existem ANTES de salvar
    if (!result.access || !result.refresh) {
      throw new Error("Erro ao obter tokens de autenticação.");
    }

    // 3. Salva tokens nos cookies
    Cookies.set("access_token", result.access, { expires: 7 });
    Cookies.set("refresh_token", result.refresh, { expires: 7 });

    // 4. Tenta buscar o usuário (com timeout para evitar travamento)
    let user: UserProfile | null = null;
    try {
      user = await getUser();
    } catch (userError) {
      console.error("Erro ao buscar usuário:", userError);
      throw new Error("Erro ao obter dados do usuário após login.");
    }

    // 5. Verifica se o usuário foi encontrado e está ativo
    if (!user) {
      throw new Error("Erro ao obter dados do usuário.");
    }

    if (!user.is_active) {
      // Remove tokens se usuário estiver inativo
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      throw new Error("Usuário inativo. Contate o administrador.");
    }

    return {
      userType: user.is_superuser ? "admin" : "client",
      user
    };

  } catch (error) {
    // Em caso de erro, limpa os cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    throw error;
  }
};

export const logoutUser = async () =>{
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("isAdmin");
  Cookies.remove("userId");
  Cookies.remove("csrftoken")
  Cookies.remove("sessionid")
}