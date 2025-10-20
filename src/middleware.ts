import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//Rotas
const publicPaths = ["/", "/login", "/home", "/Questions"];
const blockedWhenLoggedIn = ["/login"];
const adminPaths = ["/dashboard", "/clients"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("access_token")?.value;
  const isAdmin = req.cookies.get("isAdmin")?.value === "true";
  const userId = req.cookies.get("userId")?.value || "";
  const pathname = url.pathname;

  // Evitar processar requisições de API e assets
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.startsWith('/static/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Se usuário está logado e tenta acessar rota bloqueada quando logado
  if (token && blockedWhenLoggedIn.includes(pathname)) {
    const redirectPath = isAdmin ? "/dashboard" : `/client/${userId}`;
    if (redirectPath !== pathname) {
      url.pathname = redirectPath;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Se usuário NÃO está logado e tenta acessar rota não pública
  if (!token && !publicPaths.includes(pathname)) {
    if (pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Se usuário comum tenta acessar rota de admin
  if (token && !isAdmin && adminPaths.includes(pathname)) {
    const clientPath = `/client/${userId}`;
    if (clientPath !== pathname) {
      url.pathname = clientPath;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Se admin tenta acessar rota de cliente
  if (token && isAdmin && (pathname.startsWith("/client/") || pathname === "/client")) {
    if (pathname !== "/dashboard") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};