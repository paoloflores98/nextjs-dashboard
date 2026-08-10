import type { NextAuthConfig } from "next-auth"

// Puedes usar la opción `pages` para especificar la ruta de las
// páginas personalizadas de inicio de sesión, cierre de sesión y error,
// esto no es obligatorio, pero al agregar `signIn: "/login"` a nuestra opción `pages`,
// el usuario será redirigido a nuestra página de inicio de sesión personalizada,
// en lugar de a la página predeterminada de NextAuth.js.

// Se agrega la lógica para proteger tus rutas.
// Esto impedirá que los usuarios accedan a las páginas del tablero
// a menos que hayan iniciado sesión.

// La función "authorized" de la propiedad callbacks se utiliza para verificar
// si la solicitud está autorizada para acceder a una página con Next.js Proxy.
// Se invoca antes de que se complete una solicitud y recibe un objeto con las propiedades `auth` y `request`.
// La propiedad `auth` contiene la sesión del usuario, y la propiedad `request` contiene la solicitud entrante.

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") // Verificar si la ruta solicitada es la página dashboard
      
      if (isOnDashboard) {
        if (isLoggedIn) return true

        return false // Redirigir a los usuarios no autenticados a la página de inicio de sesión
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig