import Navbar from "@/components/Navbar";
import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <Box>{children}</Box>
    </>
  );
};

export default AuthLayout;
