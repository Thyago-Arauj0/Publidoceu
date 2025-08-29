import {  UserProfile, AuthResponse } from "./types/user";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
import Cookies from "js-cookie";
import { getUser } from "./UserApi";

type ApiError = { message?: string };

const authFetchNoAuth = async <T, R = AuthResponse>(
  url: string,
  data: T
): Promise<R> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: R | ApiError = await response.json();

  if (!response.ok) {
    throw new Error(
      (responseData as ApiError).message ?? "Erro na requisição"
    );
  }

  return responseData as R;
};



export const registerUser = async (data: UserProfile) => {
  const result = await authFetchNoAuth<UserProfile, AuthResponse>(
    `${API_BASE_URL}/api/v1/auth/register/`,
    data
  );
  return result;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const result: AuthResponse = await authFetchNoAuth<typeof credentials, AuthResponse>(
    `${API_BASE_URL}/api/v1/auth/token/`,
    credentials
  );

  Cookies.set("access_token", result.access, { expires: 7 });
  Cookies.set("refresh_token", result.refresh, { expires: 7 });

  const user = await getUser();

  if(!user.is_active){
    throw new Error("Usuário inativo. Contate o administrador.");
  }
  if(!result.access || !result.refresh){
    throw new Error("Erro ao obter tokens de autenticação.");
  }
  if(!user){
    throw new Error("Erro ao obter dados do usuário.");
  }

  return {
    userType: user.is_superuser ? "admin" : "client",
    user
  };
};


export const logoutUser = async () =>{
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
}