import { ContractID, IRawMaterial } from "@/types/Contracts";
import {
  contractQuery,
  contractTx,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useRawMaterials = () => {
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract: entityContract } = useRegisteredContract(
    ContractID.EntityRegistry
  );
  const { contract } = useRegisteredContract(ContractID.Transactions);

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

  return { getRawMaterials, getRawMaterialsByBuyer };
};

export default useRawMaterials;
