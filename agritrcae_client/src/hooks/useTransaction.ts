import { ContractID, IProductSold, TransactionStatus } from "@/types/Contracts";
import { IBacktrace, IEntity, IProductSale } from "@/types/Transaction";
import { testFetchBackTrace } from "@/utils/utils";
import {
  contractQuery,
  unwrapResultOrDefault,
  unwrapResultOrError,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { Transaction } from "firebase/firestore";
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

  const getManufacturersTransactions = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getProductTransactionsBySeller",
        {},
        [activeAccount?.address]
      );
      return unwrapResultOrDefault(results, [] as IProductSale[]);
    }
  }, [activeAccount]);

  const getTransactionsByStatus = useCallback(async (status
    : TransactionStatus) => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getTransactionsByStatus",
        {},
         [status, activeAccount?.address]
      );
      return unwrapResultOrError(results);
    }
  }, [activeAccount]);


  const getBackTraceInfo = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getProductBacktrace",
        {},
        ["84383381993003"]
      );
      const res = unwrapResultOrError(results);
      console.log(res);
      return unwrapResultOrDefault(results, {} as IBacktrace);
    }
  }, [activeAccount]);

  const testBackTrace = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getAllProductTransactions",
        {}
      );

      const products_transactions = unwrapResultOrDefault(
        results,
        [] as IProductSale[]
      );

      const entity_results = await contractQuery(
        api,
        activeAccount.address,
        contract,
        "getAllTransactions",
        {}
      );

      const entity_transactions = unwrapResultOrDefault(
        entity_results,
        [] as IEntity[]
      );

      const product_serial_no = "84383381993003";

      const tests = testFetchBackTrace(
        products_transactions,
        entity_transactions,
        product_serial_no
      );

      console.log(tests);
    }
  }, []);

  return {
    getAllEntities,
    getSuppliersTransactions,
    getAllProducts,
    getBackTraceInfo,
    testBackTrace,
    getManufacturersTransactions,
    getTransactionsByStatus
  };
};

export default useTransaction;
