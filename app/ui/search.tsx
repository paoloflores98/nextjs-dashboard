"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function Search({ placeholder }: { placeholder: string }) {
  const pathname = usePathname() // Lee la ruta actual, por ejemplo: /dashboard/invoices
  const searchParams = useSearchParams() // Devuelve por ejemplo: query=example&currentPage=1
  searchParams.get
  const { replace } = useRouter() // Función para reemplazar la URL actual sin recargar la página

  // Hook que retrasa la ejecución de la función hasta que el usuario deje de escribir por 300ms, evitando así múltiples llamadas a la función mientras el usuario escribe
  const handleSearch = useDebouncedCallback((term) => {
    /*
    Es una interfaz nativa de JavaScript que te permite trabajar con la parte de query string de una URL

    Métodos:
    - append: Añade un nuevo valor a un parámetro de búsqueda existente sin eliminar los valores existentes.
    - delete: Elimina un parámetro de búsqueda de la URL.
    - entries: Devuelve un iterador que permite recorrer pares clave-valor de todos los parámetros de búsqueda.
    - forEach: Ejecuta una función para cada par clave-valor de los parámetros de búsqueda.
    - get: Devuelve el valor del primer parámetro de búsqueda con el nombre especificado.
    - getAll: Devuelve todos los valores de un parámetro de búsqueda con el nombre especificado.
    - has: Devuelve un booleano indicando si existe un parámetro de búsqueda con el nombre especificado.
    - keys: Devuelve un iterador que permite recorrer los nombres de todos los parámetros de búsqueda.
    - set: Establece un nuevo valor para un parámetro de búsqueda. Si el parámetro ya existe, lo actualiza si no, lo crea.
    - sort: Ordena los parámetros de búsqueda por nombre.
    - toString: Convierte los parámetros de búsqueda en una cadena de consulta que puede ser añadida a una URL.
    - values: Devuelve un iterador que permite recorrer los valores de todos los parámetros de búsqueda.
    */
    const params = new URLSearchParams(searchParams)

    params.set("page", "1")

    if (term) {
      params.set("query", term) // Establecer o actualizar el parámetro "query" en la URL
    } else {
      params.delete("query") // Eliminar el parámetro "query" de la URL
    }

    // term ? params.set("query", term) : params.delete("query") // Forma corta

    replace(`${pathname}?${params.toString()}`) // Reemplaza la URL actual con los nuevos parámetros de búsqueda sin recargar la página
  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => { handleSearch(e.target.value) }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}
