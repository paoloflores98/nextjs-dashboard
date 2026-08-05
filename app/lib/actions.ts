"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import postgres from "postgres"

/* 
Conceptos:
- safeParse: Devolverá un objeto que contiene uno o ambos (success o error),
  esto ayudará a manejar la validación de manera más elegante
  sin tener que colocar esta lógica dentro del bloque try/catch.
*/

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "El formato es incorrecto.",
  }).min(1, { message: "Por favor, seleccione un cliente" }),
  amount: z.coerce.number().gt(0, { message: "Por favor, ingresa un monto mayor a S/. 0." }),
  status: z.enum(
    ["pending", "paid"],
    { invalid_type_error: "Por favor, seleccione el estado de la factura." }
  ),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

// Crear factura
export async function createInvoice(prevState: State, formData: FormData) {
  const data = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  }

  const validatedFields = CreateInvoice.safeParse(data)

  if (!validatedFields.success) { // Ej.: { success: false, error: [Getter] }
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos faltantes. No se pudo crear la factura.",
    }
  }

  // Es una buena práctica almacenar los valores monetarios en centavos en la base de datos para eliminar los errores de coma flotante de JavaScript y garantizar una mayor precisión
  const { customerId, amount, status } = validatedFields.data
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
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const data = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  }

  const validatedFields = UpdateInvoice.safeParse(data)

  if (!validatedFields.success) { // Ej.: { success: false, error: [Getter] }
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos faltantes. No se pudo editar la factura.",
    }
  }

  // Es una buena práctica almacenar los valores monetarios en centavos en la base de datos para eliminar los errores de coma flotante de JavaScript y garantizar una mayor precisión
  const { customerId, amount, status } = validatedFields.data
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
  // throw new Error("No se pudo eliminar la factura")
  await sql`DELETE FROM invoices WHERE id = ${id}`

  revalidatePath("/dashboard/invoices") // Revalidar la ruta de la lista de facturas para reflejar los cambios
}
