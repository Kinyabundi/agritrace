import { ContractID } from "@/types/Contracts";
import { SubstrateDeployment, alephzeroTestnet } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.EntityRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/entity_registry.json"),
      address: "5FfoDEP2BHhXMTrpF3TvuP7cCq2yEzDabr2wveaoGytMP7Ah",
    },
    {
      contractId: ContractID.StakeholderRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/stakeholder_registry.json"),
      address: "5F1S7kjzX1pQkR5aTHMQkHA7LFV7wMBkmQYjL8AgbvCR6YTM",
    },
    {
      contractId: ContractID.Transactions,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/transactions.json"),
      address: "5DgxvFo6ET56pRfhZYKr2gw5JhsUKKp154iq4KSjs5L1xa6b",
    },
  ];
};
