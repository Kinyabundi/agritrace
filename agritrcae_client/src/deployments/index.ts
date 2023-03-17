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
      address: "5FKfvzGBsmJdPcZMD1NemLs23Wb9k5eHmrwr4ECyi7JjE2PU",
    },
    {
      contractId: ContractID.Transactions,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/transactions.json"),
      address: "5C9cQeh3RLuzbsFwB48dPBYakag6Wu4VEnaPhtcNdKyiZyqH",
    },
  ];
};
