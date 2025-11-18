'use server'

import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function serverLogin(credentials: { email: string; password: string }) {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  
  try {
    // 1. Fazer login na API externa
    const loginResponse = await fetch(`${API_BASE_URL}/api/v1/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: credentials.password
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Credenciais inválidas');
    }

    const tokens = await loginResponse.json();

    if (!tokens.access || !tokens.refresh) {
      throw new Error('Erro ao obter tokens de autenticação');
    }

    // 2. Decodificar token para pegar user_id
    const decoded = jwtDecode<{ user_id: string }>(tokens.access);
    const userId = decoded.user_id;

    // 3. Buscar dados do usuário
    const userResponse = await fetch(`${API_BASE_URL}/api/v1/auth/account/${userId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    const user = await userResponse.json();

    // 4. Configurar cookies
    const cookieStore = await cookies();
    
    cookieStore.set('access_token', tokens.access, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });
    
    cookieStore.set('refresh_token', tokens.refresh, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    if (user.is_superuser) {
      cookieStore.set('isAdmin', 'true', { maxAge: 60 * 60 * 24 * 7 });
    } else {
      cookieStore.set('isAdmin', 'false', { maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('userId', String(user.id), { maxAge: 60 * 60 * 24 * 7 });
    }

    return {
      userType: user.is_superuser ? "admin" : "client",
      user
    };

  } catch (error) {
    // Limpar cookies em caso de erro
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('isAdmin');
    cookieStore.delete('userId');
    
    throw error;
  }
}

export const logoutUser = async () =>{
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('isAdmin');
    cookieStore.delete('userId');
    cookieStore.delete("csrftoken")
    cookieStore.delete("sessionid")
}