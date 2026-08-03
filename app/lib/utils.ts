import { Revenue } from "./definitions"

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "es-ES",
) => {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = []
  const highestRecord = Math.max(...revenue.map((month) => month.revenue))
  const topLabel = Math.ceil(highestRecord / 1000) * 1000

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`)
  }

  return { yAxisLabels, topLabel }
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // Si el número total de páginas es 7 o menos,
  // muestra todas las páginas sin puntos suspensivos.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Si la página actual se encuentra entre las primeras tres páginas,
  // muestra las tres primeras, tres puntos suspensivos y las dos últimas páginas.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]
  }

  // Si la página actual se encuentra entre las últimas 3 páginas,
  // muestra las primeras 2, tres puntos suspensivos y las últimas 3 páginas.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  // Si la página actual se encuentra en algún punto intermedio,
  // muestra la primera página, tres puntos suspensivos, la página actual y las páginas adyacentes,
  // otros tres puntos suspensivos y la última página.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ]
}
