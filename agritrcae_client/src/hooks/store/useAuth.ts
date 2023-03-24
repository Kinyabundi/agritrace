import { IManufacturer, Role } from "@/types/Manufacturer";
import { ISupplier } from "@/types/Supplier";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";
import { IDistributor } from "@/types/Distributor";

export interface IAuthStore {
  hasAccount: boolean;
  setHasAccount: (status: boolean) => void;
  user: IManufacturer | ISupplier | IDistributor | null;
  setUser: (user: IManufacturer | ISupplier | IDistributor | null) => void;
  prevAccount: IManufacturer | ISupplier | null;
  setPrevAccount: (user: IManufacturer | ISupplier | null) => void;
  getSpecificUser: (userType: Role) => IManufacturer | ISupplier;
  whichAccount: () => Role;
  logout: () => void;
}

const useAuth = create(
  persist<IAuthStore>(
    (set, get) => ({
      user: null,
      prevAccount: null,
      hasAccount: false,
      setHasAccount: (status) => {
        set({ hasAccount: status });
      },
      setUser: (user) => {
        set({ user });
      },
      getSpecificUser: (userType) => {
        if (userType === Role.SUPPLIER) {
          // check user role
          if (get().user.role === Role.SUPPLIER) {
            return get().user as ISupplier;
          }
        }
        if (userType === Role.MANUFACTURER) {
          // check user role
          if (get().user.role === Role.MANUFACTURER) {
            return get().user as IManufacturer;
          }
        }
      },
      whichAccount: () => {
        if (get().user) {
          return get().user.role;
        }
      },
      logout: () => {
        set((state) => _.omit(state, ["user"]), true);
      },
      setPrevAccount: (user) => {
        set({ prevAccount: user });
      },
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    }
  )
);

export default useAuth;
