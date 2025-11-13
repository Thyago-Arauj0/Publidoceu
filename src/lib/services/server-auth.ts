// lib/services/server-auth.ts
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value || null;
}

export async function refreshServerToken(): Promise<string> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) throw new Error("Refresh token não encontrado");

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) throw new Error("Não foi possível renovar o token");

  const data = await res.json();
  
  // Aqui você precisaria atualizar o cookie no servidor
  // Isso pode ser feito via actions ou middleware
  return data.access;
}

export const serverAuthFetch = async <R>(
  url: string, 
  options: RequestInit = {}
): Promise<R> => {
  let token = await getServerToken();

  if (!token) {
    token = await refreshServerToken();
  }

  const headers: HeadersInit = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    token = await refreshServerToken();
    
    const retryHeaders: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const retryResponse = await fetch(url, { 
      ...options, 
      headers: retryHeaders 
    });

    if (!retryResponse.ok) {
      throw new Error("Erro após tentativa de refresh");
    }

    return handleResponse<R>(retryResponse);
  }

  if (!response.ok) {
    await handleError(response);
  }

  return handleResponse<R>(response);
};

async function handleResponse<R>(response: Response): Promise<R> {
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as R;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return (await response.text()) as unknown as R;
  }
}

async function handleError(response: Response): Promise<never> {
  let message = `Erro ${response.status}`;
  try {
    const errorData = await response.json();
    console.error("Resposta de erro da API:", errorData);
    message = errorData.detail || JSON.stringify(errorData);
  } catch {
    const text = await response.text();
    console.error("Erro não-JSON da API:", text);
    message = text;
  }
  throw new Error(message);
}