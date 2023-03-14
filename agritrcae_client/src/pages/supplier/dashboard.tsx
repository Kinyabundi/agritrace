import SupplierLayout from "@/layouts/SupplierLayout"
import { NextPageWithLayout } from "@/types/Layout"

const Dashboard: NextPageWithLayout = () => {
  return (
    <div>Dashboard</div>
  )
}

Dashboard.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>


export default Dashboard