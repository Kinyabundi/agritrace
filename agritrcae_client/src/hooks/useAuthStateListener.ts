import useAuth from "./store/useAuth";
import { shallow } from "zustand/shallow";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { useEffect } from "react";

const useAuthStateListener = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);

  const { setUser, setHasAccount } = useAuth(
    (state) => ({
      setHasAccount: state.setHasAccount,
      setUser: state.setUser,
    }),
    shallow
  );

  const fetchAccountDetails = async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getManufacturer",
        {},
        [activeAccount.address]
      );

      const newResult = unwrapResultOrDefault(result, null);

      if (newResult) {
        setUser(newResult);
        setHasAccount(true);
        return;
      } else {
        // if not found, confirm if the account is created as supplier
        const supplierResult = await contractQuery(
          api,
          activeAccount?.address,
          contract,
          "getSupplier",
          {},
          [activeAccount.address]
        );

        const newSupplierResult = unwrapResultOrDefault(supplierResult, null);

        if (newSupplierResult) {
          setUser(newSupplierResult);
          setHasAccount(true);
          return;
        } else {
          setUser(null);
          setHasAccount(false);
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (activeAccount) {
      fetchAccountDetails();
    }
  }, [activeAccount]);
};

export default useAuthStateListener;
