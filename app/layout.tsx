import "@/app/ui/global.css"
import { inter } from "@/app/ui/fonts"
import { Metadata } from "next"

/* 
Puedes usar el campo `title.template` en el objeto de metadatos para definir una plantilla para los títulos de tus páginas. Esta plantilla puede incluir el título de la página y cualquier otra información que desees incluir.
El símbolo %s de la plantilla se reemplazará por el título específico de la página.
*/

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "El panel oficial del curso de Next.js, creado con App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
