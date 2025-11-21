'use server'

import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type NextRequestInit = RequestInit & {
  next?: { revalidate?: number };
  cache?: RequestCache;
};



export const serverRefreshAccessToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
    // Limpa os cookies primeiro
    cookieStore.delete("refresh_token");
    cookieStore.delete("access_token");
    cookieStore.delete("isAdmin");
    cookieStore.delete("sessionid");
    
    // Lança um erro que será capturado no componente
    throw new Error("AUTH_REQUIRED");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store"
  });
  

  if (!res.ok) {
    // Limpa cookies
    cookieStore.delete("refresh_token");
    cookieStore.delete("access_token");
    cookieStore.delete("isAdmin");
    cookieStore.delete("sessionid");
    
    throw new Error("AUTH_REQUIRED");
  }

  const data = await res.json();
  
  // Salva novo access token em cookie HttpOnly
  cookieStore.set("access_token", data.access, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60
  });

  return data.access;
};


export const serverAuthFetch = async <R>(
  url: string,
  options: NextRequestInit = {}
): Promise<R> => {
  const cookieStore = await cookies();
  let token = cookieStore.get("access_token")?.value;

  // Sem token → tenta refresh direto
  if (!token) {
    token = await serverRefreshAccessToken();
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
    cache: options.cache,
  };

  let response = await fetch(url, fetchOptions);

  // Se token expirou → tenta refresh e retry
  if (response.status === 401 || response.status === 403) {
    token = await serverRefreshAccessToken();

    const retryHeaders: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
      (retryHeaders as Record<string, string>)["Content-Type"] = "application/json";
    }

    response = await fetch(url, { ...options, headers: retryHeaders });

    if (!response.ok) {
      throw new Error("Erro após tentativa de refresh");
    }
  }

  if (!response.ok) {
    let message = `Erro ${response.status}`;

    try {
      const cloned = response.clone();
      const errorData = await cloned.json();
      message = errorData.detail || JSON.stringify(errorData);
    } catch {
      const cloned = response.clone();
      const text = await cloned.text();
      message = text;
    }

    throw new Error(message);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return "null" as unknown as R;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as R;
  }

  return (await response.text()) as R;
};
