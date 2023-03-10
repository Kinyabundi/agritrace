import Head from "next/head";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
    
  return (
    <>
      <Head>
        <title>Agritrace</title>
      </Head>
      <Navbar />
      {children}
    </>
  );
};

export default HomeLayout;
