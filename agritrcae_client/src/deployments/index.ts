import { ContractID } from "@/types/Contracts";
import { SubstrateDeployment, alephzeroTestnet } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.EntityRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/entity_registry.json"),
      address: "5CdD9w7Fpd9P3ehzT7y458fujw1y4sjqYEpeUVbPznHAnsE1",
    },
    {
      contractId: ContractID.StakeholderRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/stakeholder_registry.json"),
      address: "5CjL6yjepSYPKtw3VsKtj4SUcKzvqDyACxJsjJA1sxNxwLQN",
    },
    {
      contractId: ContractID.Transactions,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/transactions.json"),
      address: "5DgxvFo6ET56pRfhZYKr2gw5JhsUKKp154iq4KSjs5L1xa6b",
    },
  ];
};
