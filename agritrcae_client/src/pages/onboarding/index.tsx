import MainLayout from "@/layouts/MainLayout";
import { NextPageWithLayout } from "@/types/Layout";

const Onboarding: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Onboarding</h1>
    </div>
  );
};
Onboarding.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Onboarding;
