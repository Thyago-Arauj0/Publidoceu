import { actionGetUser } from "@/lib/actions/userActions"
import { Board } from "@/lib/types/boardType";
import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types/userType";

export default function useUser( boards: Board[], userId: string | number) {
  const [user, setUser] = useState<UserProfile>()
  const [isErrorModalOpenUser, setIsErrorModalOpenUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  
 useEffect(() => {
  if (!boards || boards.length === 0) return;

  const fetchUser = async () => {
    setIsLoadingUser(true); 
    try {
      const user = await actionGetUser(userId);
      setUser(user);
    } catch (error) {
      setIsErrorModalOpenUser(true);
      setErrorUser("Erro ao carregar usuário");
      console.error("Erro ao buscar usuário:", error);
    }finally {
      setIsLoadingUser(false); // 🔹 sempre desliga
    }
  };

  fetchUser()
}, [userId])

  return { user, isErrorModalOpenUser, setIsErrorModalOpenUser, errorUser, isLoadingUser };
}