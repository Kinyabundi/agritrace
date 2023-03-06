import { ContractID, IProduct } from "@/types/Contracts";
import {
  contractQuery,
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useManufacturer = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(
    ContractID.EntityRegistry
  );

  const registerAsManufacturer = useCallback(async () => {}, []);

  const addProduct = async (product: IProduct) => {
    if (contract) {
      if (activeAccount && api) {
        const result = await contractTx(
          api,
          activeAccount?.address,
          contract,
          "addProduct",
          {},
          Object.values(product),
          ({ status }) => {
            if (status?.isInBlock) {
            }
          }
        );
      }
    }
  };
  return { addProduct };
};

export default useManufacturer;
