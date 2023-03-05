import { ContractID, IProduct } from "@/types/Contracts";
import {
  contractQuery,
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";

const useManufacturer = () => {
  const { api, activeAccount } = useInkathon();
  const { contract, address: contractAddress } = useRegisteredContract(
    ContractID.EntityRegistry
  );

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
          ({status}) => {
            if (status?.isInBlock){
                
            }
          }
        );
      }
    }
  };
  return {};
};

export default useManufacturer;
