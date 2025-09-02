import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas
const publicPaths = ["/login"];
const blockedWhenLoggedIn = ["/login"];
const adminPaths = ["/dashboard", "/clients"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("access_token")?.value;
  const isAdmin = req.cookies.get("isAdmin")?.value === "true";

  const pathname = url.pathname;


  if (token && blockedWhenLoggedIn.includes(url.pathname)) {
    console.log("Redirecionando usuário logado")
    if(isAdmin) url.pathname = "/dashboard";
    else url.pathname = `/client/${req.cookies.get("userId")?.value || ""}`;
    return NextResponse.redirect(url);
  }

  if (!token && !publicPaths.includes(pathname)) {
    console.log("Redirecionando para login")
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if(token && !isAdmin && adminPaths.includes(pathname)){
    console.log("Redirecionando usuário não admin")
    url.pathname = `/client/${req.cookies.get("userId")?.value || ""}`;
    return NextResponse.redirect(url);
  }

  if (token && isAdmin && pathname.startsWith("/client/") || pathname === "/client") {
    console.log("Redirecionando admin")
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
