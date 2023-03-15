import { ContractID, IRawMaterial } from "@/types/Contracts";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";
import useAuth from "./store/useAuth";

const useRawMaterials = () => {
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract: entityContract } = useRegisteredContract(
    ContractID.EntityRegistry
  );
  const { contract: transactionsContract } = useRegisteredContract(ContractID.Transactions);

  const getRawMaterials = useCallback(async () => {
    if (entityContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        entityContract,
        "getEntitiesByAddedBy",
        {},
        [activeAccount?.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);

  const getRawMaterialsByBuyer = useCallback(async () => {
    if (entityContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        entityContract,
        "getEntitiesByBuyer",
        {},
        [activeAccount?.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);
  
  const getSuppliersTransactions = useCallback(async () => {
    if (transactionsContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        transactionsContract,
        "getTransactionsBySeller",
        {},
        [activeAccount?.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);
  

  return { getRawMaterials, getRawMaterialsByBuyer, getSuppliersTransactions };
};

export default useRawMaterials;
