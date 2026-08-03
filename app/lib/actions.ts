"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import postgres from "postgres"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

// Crear factura
export async function createInvoice(formData: FormData) {
  // Validar los datos del formulario
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  })

  // Es una buena práctica almacenar los valores monetarios en centavos en la base de datos para eliminar los errores de coma flotante de JavaScript y garantizar una mayor precisión
  const amountInCents = amount * 100
  const date = new Date().toISOString().split("T")[0] // Ej.: "2023-07-15"

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `

  } catch (error) {
    console.error("Error al crear la factura:", error)

    return {
      message: "Error de base de datos: No se pudo crear la factura.",
    }
  }

  revalidatePath("/dashboard/invoices") // Revalidar la ruta de la lista de facturas para reflejar los cambios
  redirect("/dashboard/invoices") // Redirigir al usuario de vuelta a la página
}

// Actualizar factura
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  })

  // Es una buena práctica almacenar los valores monetarios en centavos en la base de datos para eliminar los errores de coma flotante de JavaScript y garantizar una mayor precisión
  const amountInCents = amount * 100

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `

  } catch (error) {
    console.error("Error al actualizar la factura:", error)

    return {
      message: "Error de base de datos: No se pudo actualizar la factura.",
    }
  }

  revalidatePath("/dashboard/invoices") // Revalidar la ruta de la lista de facturas para reflejar los cambios
  redirect("/dashboard/invoices") // Redirigir al usuario de vuelta a la página
}

// Eliminar factura
export async function deleteInvoice(id: string) {
  throw new Error("No se pudo eliminar la factura")

  await sql`DELETE FROM invoices WHERE id = ${id}`

  revalidatePath("/dashboard/invoices") // Revalidar la ruta de la lista de facturas para reflejar los cambios
}
