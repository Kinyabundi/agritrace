import { ContractID } from "@/types/Contracts";
import {
  contractQuery,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useRawMaterials = () => {
  const { api, activeAccount } = useInkathon();
  const { contract: entityContract } = useRegisteredContract(
    ContractID.EntityRegistry
  );

  const getRawMaterials = useCallback(async () => {
    if (entityContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        entityContract,
        "getEntities",
        {},
        [activeAccount.address]
      );
      return unwrapResultOrError(results);
    }
  }, []);

  return { getRawMaterials };
};

export default useRawMaterials;
