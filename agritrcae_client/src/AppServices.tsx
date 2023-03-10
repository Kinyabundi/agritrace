import { FC, ReactNode } from "react";
import useAuthStateListener from "@/hooks/useAuthStateListener";

const AppServices: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  useAuthStateListener();
  return <>{children}</>;
};

export default AppServices;
