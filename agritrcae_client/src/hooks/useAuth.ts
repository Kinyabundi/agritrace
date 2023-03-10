import { IManufacturer } from "@/types/Manufacturer";
import { ISupplier } from "@/types/Supplier";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAuthStore {
  user: IManufacturer | ISupplier | null;
  setUser: (user: IManufacturer | ISupplier | null) => void;
}

export const useAuth = create(
  persist<IAuthStore>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    }
  )
);

export default useAuth;
