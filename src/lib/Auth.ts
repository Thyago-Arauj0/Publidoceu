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

    if (retryResponse.status === 204 || retryResponse.headers.get("content-length") === "0") {
      return "null" as unknown as R;
    }
    
    return retryResponse.json();
  }

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      console.error("Erro da API:", errorData);

      if (errorData.detail) {
        message = errorData.detail;
      } else {
        // Pega a primeira mensagem de erro do serializer
        const firstKey = Object.keys(errorData)[0];
        if (firstKey) {
          message = `${firstKey}: ${errorData[firstKey]}`;
        }
      }
    } catch {
      console.error("Erro ao parsear resposta de erro");
    // mantém a mensagem genérica
    }

    throw new Error(message);
  }

    // se for status sem conteúdo, não tenta parsear
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return "null" as unknown as R;
  }


  return response.json();
};
