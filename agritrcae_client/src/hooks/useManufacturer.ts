import { ContractID } from "@/types/Contracts";
import {
  contractQuery,
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

  const { contract: transactionContract } = useRegisteredContract(
    ContractID.Transactions
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
  const getProductsByAddedBy = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getProductsByAddedBy",
        {},
        [activeAccount.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);
  const getProducts = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getProducts",
        {}
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);

  const getManufacturers = useCallback(async () => {
    if (stakeholderContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        stakeholderContract,
        "getManufacturers",
        {}
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);

  const getIncomingEntities = useCallback(async () => {
    if (transactionContract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        transactionContract,
        "getTransactionsByBuyer",
        {},
        [activeAccount.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);
  return {
    getManufacturerAcccount,
    getManufacturers,
    getProducts,
    getProductsByAddedBy,
    getIncomingEntities,
  };
};

export default useManufacturer;
