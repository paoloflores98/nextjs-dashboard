import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

// Aquí estás inicializando NextAuth.js con el objeto authConfig y exportando la propiedad auth.
// También estás utilizando la opción matcher de Proxy para especificar que debe ejecutarse en rutas específicas.
// La ventaja de emplear Proxy para esta tarea es que
// las rutas protegidas ni siquiera comenzarán a renderizarse
// hasta que Proxy verifique la autenticación,
// lo que mejora tanto la seguridad como el rendimiento de tu aplicación.

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}