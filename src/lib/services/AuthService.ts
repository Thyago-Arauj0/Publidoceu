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

export const loginUser = async (credentials: { email: string; password: string }) => {

  const normaizedEmail = credentials.email.trim().toLowerCase();
  console.log("Normalized Email:", normaizedEmail);

  const result: AuthResponse = await authFetchNoAuth<typeof credentials, AuthResponse>(
    `${API_BASE_URL}/api/v1/auth/token/`,
    { email: normaizedEmail, password: credentials.password } 
  );

  Cookies.set("access_token", result.access, { expires: 7 });
  Cookies.set("refresh_token", result.refresh, { expires: 7 });

  const user = await getUser();

  if(!result.access || !result.refresh){
    throw new Error("Erro ao obter tokens de autenticação.");
  }
  if(!user){
    throw new Error("Erro ao obter dados do usuário.");
  }

  if(!user.is_active){
    throw new Error("Usuário inativo. Contate o administrador.");
  }

  return {
    userType: user.is_superuser ? "admin" : "client",
    user
  };
};


export const logoutUser = async () =>{
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("isAdmin");
  Cookies.remove("userId");
  Cookies.remove("csrftoken")
  Cookies.remove("sessionid")
}