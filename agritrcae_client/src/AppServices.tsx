import { FC, ReactNode } from "react";
import useAuthStateListener from "@/hooks/useAuthStateListener";
import { useAsPathInitializer } from "@/hooks/store/useAsPath";

const AppServices: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  useAuthStateListener();
  useAsPathInitializer();
  return <>{children}</>;
};

export default AppServices;
