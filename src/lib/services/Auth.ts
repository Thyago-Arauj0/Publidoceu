// import Cookies from "js-cookie";
'use server'

import { cookies } from "next/headers";
import { AuthResponse } from "../types/userType";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
type ApiError = { message?: string };

type NextRequestInit = RequestInit & {
  next?: { revalidate?: number };
  cache?: RequestCache;
};



// export const refreshAccessToken = async (): Promise<string> => {
//   const refreshToken = Cookies.get("refresh_token");

//   if (!refreshToken) {
//     throw new Error("Refresh token não encontrado. Usuário precisa logar novamente.");
//   }

//   const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ refresh: refreshToken }),
//   });

//   if (!response.ok) {
//     Cookies.remove("access_token");
//     Cookies.remove("refresh_token");
//     throw new Error("Não foi possível renovar o token. Usuário precisa logar novamente.");
//   }

//   const data = await response.json();
//   const newAccess = data.access;

//   Cookies.set("access_token", newAccess, { expires: 7 });
//   return newAccess;
// };

export const refreshAccessToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) throw new Error("Refresh token não encontrado");

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) throw new Error("Não foi possível renovar o token");

  const data = await res.json();
  cookieStore.set("access_token", data.access, { path: "/", maxAge: 60 * 60 * 24 * 7 });

  return data.access;
};

export const authFetch = async <R>(url: string, options: NextRequestInit = {}): Promise<R> => {
  // let token = Cookies.get("access_token");
  const cookieStore = await cookies();
  let token = cookieStore.get("access_token")?.value;

  if (!token) {
    token = await refreshAccessToken();
  }

  const headers: HeadersInit = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    cache: options.cache, // ← Isso estava faltando
  };

  const response = await fetch(url, fetchOptions);

  if (response.status === 401 || response.status === 403) {
    token = await refreshAccessToken();

    const retryHeaders: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
      (retryHeaders as Record<string, string>)["Content-Type"] = "application/json";
    }

    const retryResponse = await fetch(url, { ...options, headers: retryHeaders });

    if (!retryResponse.ok) {
      throw new Error("Erro após tentativa de refresh");
    }

    if (retryResponse.status === 204 || retryResponse.headers.get("content-length") === "0") {
      return "null" as unknown as R;
    }

    const contentType = retryResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return retryResponse.json();
    } else {
      return (await retryResponse.text()) as unknown as R;
    }
  }

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const cloned = response.clone(); // 👈 clona a resposta
      const errorData = await cloned.json();
      console.error("Resposta de erro da API:", errorData);
      message = errorData.detail || JSON.stringify(errorData);
    } catch {
      const cloned = response.clone();
      const text = await cloned.text();
      console.error("Erro não-JSON da API:", text);
      message = text;
    }

    throw new Error(message);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return "null" as unknown as R;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return (await response.text()) as unknown as R;
  }
};


export const authFetchNoAuth = async <T, R = AuthResponse>(
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
      (responseData as ApiError).message ?? "Erro na requisição: Usuário Inativo ou Credenciais incorretas."
    );
  }

  return responseData as R;
};

