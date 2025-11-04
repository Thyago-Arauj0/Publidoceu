import { UserProfile } from "../types/userType";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "./Auth";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface JwtPayload {
  user_id: string;
  exp: number;
  iat: number;
}


export const getUser = async (id?: string | number): Promise<UserProfile> => {
  let userId = id;

  console.log("🔍 Iniciando getUser...");

  // Se não foi passado id, tenta pegar do token
  if (!userId) {
    const token = Cookies.get("access_token");
    console.log("📝 Token encontrado:", !!token);
    
    if (!token) {
      console.error("❌ Token não encontrado");
      throw new Error("Usuário não autenticado");
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.user_id;
      console.log("👤 UserID do token:", userId);
    } catch (decodeError) {
      console.error("❌ Erro ao decodificar token:", decodeError);
      throw new Error("Token inválido");
    }
  }

  console.log("🌐 Fazendo requisição para:", `${API_BASE_URL}/api/v1/auth/account/${userId}/`);

  try {
    const data = await authFetch<UserProfile>(
      `${API_BASE_URL}/api/v1/auth/account/${userId}/`,
      { method: "GET" }
    );

    console.log('✅ Data recebida:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro na requisição getUser:', error);
    throw error;
  }
};

// export const getUser = async (id?: string | number): Promise<UserProfile> => {
//   let userId = id;

//   console.log("chamando id: ", userId)
//   // Se não foi passado id, tenta pegar do token
//   if (!userId) {
//     const token = Cookies.get("access_token");
//     if (!token) {
//       throw new Error("Usuário não autenticado");
//     }

//     const decoded = jwtDecode<JwtPayload>(token);
//     userId = decoded.user_id;
//     console.log(userId)
//   }

//   const data = await authFetch<UserProfile>(
//     `${API_BASE_URL}/api/v1/auth/account/${userId}/`,
//     { method: "GET" }
//   );

//   console.log('Data: ', data)

//   return data;
// };