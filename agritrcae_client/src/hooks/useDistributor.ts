import {ContractID} from "@/types/Contracts";
import {contractQuery, unwrapResultOrError, useInkathon, useRegisteredContract} from "@scio-labs/use-inkathon"; 
import {useCallback} from "react";

const useDistributor = () => {
 const {api, activeAccount} = useInkathon();
 const {contract: stakeholderContract} = useRegisteredContract(ContractID.StakeholderRegistry);

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
    return {getDistributors}
}

export default useDistributor
