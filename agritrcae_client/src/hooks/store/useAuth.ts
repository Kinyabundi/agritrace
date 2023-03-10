import { IManufacturer } from "@/types/Manufacturer";
import { ISupplier } from "@/types/Supplier";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAuthStore {
  hasAccount: boolean;
  setHasAccount: (status: boolean) => void;
  user: IManufacturer | ISupplier | null;
  setUser: (user: IManufacturer | ISupplier | null) => void;
}

export const useAuth = create(
  persist<IAuthStore>(
    (set) => ({
      user: null,
      hasAccount: false,
      setHasAccount: (status) => {
        set({ hasAccount: status });
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    }
  )
);

export default useAuth;
