import { ContractID } from "@/types/Contracts";
import { IEntity, IProductSale } from "@/types/Transaction";
import {
  contractQuery,
  unwrapResultOrDefault,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useTransaction = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Transactions);
  const getAllEntities = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount.address,
        contract,
        "getAllTransactions",
        {}
      );

      const finalRes = unwrapResultOrDefault(result, [] as IEntity[]);

      return finalRes;
    }
  }, [activeAccount]);
  const getAllProducts = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount.address,
        contract,
        "getAllProductTransactions",
        {}
      );

      const finalRes = unwrapResultOrDefault(result, [] as IProductSale[]);

      return finalRes;
    }
  }, [activeAccount]);

  const getSuppliersTransactions = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getTransactionsBySeller",
        {},
        [activeAccount?.address]
      );
      return unwrapResultOrDefault(results, [] as IEntity[]);
    }
  }, [activeAccount]);
  return { getAllEntities, getSuppliersTransactions, getAllProducts };
};

export default useTransaction;
