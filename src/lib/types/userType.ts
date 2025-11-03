export interface UserProfile {
  id: number | string;   
  name: string;     
  email: string;   
  first_name?: string | null;  
  last_name?: string | null;    
  full_name?: string | null;   
  created_at: string;    
  updated_at: string;    
  is_active: boolean;     
  is_staff?: boolean;      
  is_superuser?: boolean;    
  profile?: Profile | null; 
  author?: string;  
}

export interface Client extends UserProfile {
  phone?: string | null
  password?: string
  postsCount?: number
}


export interface Profile {
  id: number;    
  user: UserProfile;   
  slug: string;       
  whatsapp?: string | null; 
  created_at: string;    
  updated_at: string;      
}


export interface AuthResponse {
  user: UserProfile;
  access: string;
  refresh: string;
  message?: string;
}