import MainLayout from "@/layouts/MainLayout";
import { NextPageWithLayout } from "@/types/Layout";

const Home: NextPageWithLayout = () => {
  return <div>Home</div>;
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Home;
