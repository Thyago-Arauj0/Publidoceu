"use client"


import { useCallback } from "react";
import { logoutUser } from "@/lib/services/Login";
import { useRouter } from "next/navigation";

export default function useLogout() {

  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      router.push("/login");
    }
  }, [router]);


  return { handleLogout };
}