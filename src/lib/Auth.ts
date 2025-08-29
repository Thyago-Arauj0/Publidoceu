import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = Cookies.get("refresh_token");

  if (!refreshToken) {
    throw new Error("Refresh token não encontrado. Usuário precisa logar novamente.");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    throw new Error("Não foi possível renovar o token. Usuário precisa logar novamente.");
  }

  const data = await response.json();
  const newAccess = data.access;

  Cookies.set("access_token", newAccess, { expires: 7 });
  return newAccess;
};


export const authFetch = async <R>(
  url: string,
  options: RequestInit = {}
): Promise<R> => {
  let token = Cookies.get("access_token");

  if (!token) {
    token = await refreshAccessToken();
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  // Se o token expirou, tenta refresh e refaz a requisição
  if (response.status === 401 || response.status === 403) {
    token = await refreshAccessToken();

    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!retryResponse.ok) {
      throw new Error("Erro após tentativa de refresh");
    }

    return retryResponse.json();
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro na requisição autenticada");
  }

  return response.json();
};
