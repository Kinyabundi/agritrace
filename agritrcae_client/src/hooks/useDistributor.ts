import {ContractID} from "@/types/Contracts";
import {contractQuery, unwrapResultOrError, useInkathon, useRegisteredContract} from "@scio-labs/use-inkathon"; 
import {useCallback} from "react";

const useDistributor = () => {
 const {api, activeAccount} = useInkathon();
 const {contract: stakeholderContract} = useRegisteredContract(ContractID.StakeholderRegistry);
 const {  contract: transactionContract } = useRegisteredContract(
    ContractID.Transactions
  );
    const getDistributors = useCallback(async () => {
        if (stakeholderContract && api && activeAccount) {
            const result = await contractQuery(
                api,
                activeAccount?.address,
                stakeholderContract,
                "getDistributors",
                {},
                // [activeAccount.address]
            );
            return unwrapResultOrError(result);
        }
    }, [activeAccount]);
  
const getIncomingProducts = useCallback(async () => {
    if (transactionContract && api && activeAccount) {
        const result = await contractQuery(
            api,
            activeAccount?.address,
            transactionContract,
            "getProductTransactionsByBuyer",
            {},
            [activeAccount.address]
        );
        return unwrapResultOrError(result);
    }
}, [activeAccount]);

return {getDistributors, getIncomingProducts}
}


export default useDistributor
