export interface UserProfile {
  id: number | string;               // PK do usuário
  name: string;             // Nome de usuário (único)
  email: string;            // Email (único)
  first_name?: string | null;   // Primeiro nome
  last_name?: string | null;    // Último nome
  full_name?: string | null;    // Nome completo
  created_at: string;       // ISO datetime
  updated_at: string;       // ISO datetime
  is_active: boolean;       // Está ativo
  is_staff?: boolean;        // Moderador
  is_superuser?: boolean;    // Superusuário
  profile?: Profile | null; // Perfil relacionado (ou pode ser só o id)
  author?: string
}


export interface Profile {
  id: number;               // PK do perfil
  user: UserProfile;        // Usuário relacionado (ou pode ser só o id)
  slug: string;             // Slug único
  whatsapp?: string | null; // Número do WhatsApp (+5511999999999)
  created_at: string;       // ISO datetime
  updated_at: string;       // ISO datetime
}


export interface AuthResponse {
  user: UserProfile;
  access: string;
  refresh: string;
  message?: string;
}