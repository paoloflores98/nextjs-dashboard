// import Form from "@/app/ui/invoices/edit-form"
// import EditInvoiceForm from "@/app/ui/invoices/edit-form"
import InvoiceForm from "@/app/ui/invoices/form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

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