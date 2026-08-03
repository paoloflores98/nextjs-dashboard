"use client"

import { useEffect } from "react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

// Usa 2 props, error y reset, que son proporcionadas por Next.js cuando ocurre un error en la ruta de facturas
// reset ayuda si tienes una razón específica para borrar el estado de error y volver a renderizar los elementos hijos del límite de error sin volver a cargar el contenido
export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Si lo deseas, registra el error en un servicio de reporte de errores
    console.error(error)
  }, [error])

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">¡Algo salió mal!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Intenta recuperarlo volviendo a generar la ruta de las facturas
          () => reset()
        }
      >
        Intentar otra vez
      </button>
    </main>
  )
}