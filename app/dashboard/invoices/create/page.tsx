import InvoiceForm from "@/app/ui/invoices/form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchCustomers } from "@/app/lib/data"

export default async function Page() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Facturas",
            href: "/dashboard/invoices"
          },
          {
            label: "Crear factura",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />

      {/* <CreateInvoiceForm customers={customers} /> */}
      <InvoiceForm customers={customers} />
    </main>
  )
}