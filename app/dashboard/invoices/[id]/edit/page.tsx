import InvoiceForm from "@/app/ui/invoices/form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface Props {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "Editar factura",
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

  // Si la factura no existe en la DB, mostrar 404
  if (!invoice) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Facturas",
            href: "/dashboard/invoices"
          },
          {
            label: "Editar factura",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <EditInvoiceForm invoice={invoice} customers={customers} /> */}
      <InvoiceForm customers={customers} invoice={invoice} />
    </main>
  )
}