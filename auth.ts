import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import type { User } from "@/app/lib/definitions"
import bcrypt from "bcrypt"
import postgres from "postgres"

// Nos centraremos en utilizar únicamente el proveedor `Credentials`
// que permite a los usuarios iniciar sesión con un nombre de usuario y una contraseña

// Puedes usar la función `authorize` para manejar la lógica de autenticación.
// Al igual que con las acciones del servidor, puedes usar `zod` para validar
// el correo electrónico y la contraseña antes de verificar si el usuario existe en la base de datos

/* 
Cuando authorize devuelve null, Auth.js maneja el error de una de estas dos maneras:
- El usuario es redirigido a la página de inicio de sesión con la cadena de consulta: ?error=CredentialsSignin&code=credentials. Puedes personalizar el código utilizando las opciones del proveedor de credenciales.
- Usando acciones de formulario o manejo de errores personalizado (por ejemplo, en Remix, SvelteKit): El error se lanza como `CredentialsSignin` y debe ser capturado manualmente en tu acción de servidor. Consulta más información en la referencia de errores de Auth.js.
*/

/* 
No se aplica Route Handler porque todo corre vía Server Actions. El Route Handler es necesario cuando el flujo de login depende de peticiones HTTP reales al servidor:
- Cuando usas OAuth (Google, GitHub, etc.) — porque el proveedor externo necesita redirigir de vuelta a una URL callback real como /api/auth/callback/google.
- Cuando llamas signIn()/signOut() desde un Client Component en vez de una Server Action, porque ahí sí se dispara un fetch real al endpoint.
- Cuando usas useSession() del lado del cliente, que hace polling a /api/auth/session.
*/

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

// Obtener el usuario en la base de datos por correo electrónico
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`

    return user[0]
  } catch (error) {
    console.error("No se pudo obtener el usuario:", error)

    throw new Error("No se pudo obtener el usuario.")
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data

          const user = await getUser(email)
          if (!user) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
})