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

export const authFetch = async <R>(url: string, options: RequestInit = {}): Promise<R> => {
  let token = Cookies.get("access_token");

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

  const response = await fetch(url, { ...options, headers });

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
      const errorData = await response.json();
      if (errorData.detail) {
        message = errorData.detail;
      } else {
        const flatError = Object.entries(errorData)
          .map(([key, value]) =>
            typeof value === "object" ? `${key}: ${JSON.stringify(value)}` : `${key}: ${value}`
          )
          .join(" | ");
        if (flatError) message = flatError;
      }
    } catch {}

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
