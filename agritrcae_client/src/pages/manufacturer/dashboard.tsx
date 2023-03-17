import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
    <Head>
      <title>AgriTrace | Manufacturer | Dashboard</title>
    </Head>
    <div>Dashboard</div>
    </>
  )
};

Dashboard.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default Dashboard;
