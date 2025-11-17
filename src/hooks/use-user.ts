import { getUser } from "@/lib/services-server/User";
import { Board } from "@/lib/types/boardType";
import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types/userType";

export default function useUser( boards: Board[], userId: string | number) {
  const [user, setUser] = useState<UserProfile>()
  const [isErrorModalOpenUser, setIsErrorModalOpenUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  
 useEffect(() => {
  if (boards.length === 0) return; // espera boards carregarem

  const fetchUser = async () => {
    setIsLoadingUser(true); 
    try {
      const data = await getUser(userId);
      setUser(data);
    } catch (error) {
      setIsErrorModalOpenUser(true);
      setErrorUser("Erro ao carregar usuário");
      console.error("Erro ao buscar usuário:", error);
    }finally {
      setIsLoadingUser(false); // 🔹 sempre desliga
    }
  };

  fetchUser()
}, [boards, userId])

  return { user, isErrorModalOpenUser, setIsErrorModalOpenUser, errorUser, isLoadingUser };
}