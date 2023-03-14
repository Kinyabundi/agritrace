import { ContractID, IProduct } from "@/types/Contracts";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useManufacturer = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.EntityRegistry);
  const { contract: stakeholderContract } = useRegisteredContract(
    ContractID.StakeholderRegistry
  );
 

  const getManufacturerAcccount = async () => {
    if (stakeholderContract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        stakeholderContract,
        "getManufacturer",
        {},
        [activeAccount.address]
      );
      return unwrapResultOrError(result);
    }
  };

  // const addProduct = async (product: IProduct) => {
  //   if (contract) {
  //     if (activeAccount && api) {
  //       const result = await contractTx(
  //         api,
  //         activeAccount?.address,
  //         contract,
  //         "addProduct",
  //         {},
  //         Object.values(product),
  //         ({ status }) => {
  //           if (status?.isInBlock) {
  //           }
  //         }
  //       );
  //     }
  //   }
  // };

  const getManufacturers = useCallback(async () => {
    if(stakeholderContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        stakeholderContract,
        "getManufacturers",
        {},
      );
      return unwrapResultOrError(results);
    }
  },[activeAccount])
  return { getManufacturerAcccount, getManufacturers };
};

export default useManufacturer;
