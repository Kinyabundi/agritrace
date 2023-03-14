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
import usePageReload from "./usePageReload";

const useAuthStateListener = () => {
  const { api, activeAccount, accounts, setActiveAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);

  const isPageReloaded = usePageReload();

  const { setUser, setHasAccount, setPrevAcc, user } = useAuth(
    (state) => ({
      setHasAccount: state.setHasAccount,
      setUser: state.setUser,
      setPrevAcc: state.setPrevAccount,
      user: state.user,
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

      const prevAccount = user;

      const newResult = unwrapResultOrDefault(result, null);

      console.log(Object.entries(newResult), "37");
      // @ts-ignore
      if (Object.entries(newResult)[0] === "ok") {
        setPrevAcc(prevAccount);
        // @ts-ignore
        setUser(Object.values(newResult)[0]);
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
          setPrevAcc(prevAccount);
          // @ts-ignore
          setUser(Object.values(newSupplierResult)[0]);
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
