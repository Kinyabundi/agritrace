import { ContractID } from "@/types/Contracts";
import { SubstrateDeployment, alephzeroTestnet } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.EntityRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/entity_registry.json"),
      address: "5FzuZ1DiFjNkZfbbAtadbrvL1odWxKonfj3REvoYfJDcLhsk",
    },
    {
      contractId: ContractID.StakeholderRegistry,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/stakeholder_registry.json"),
      address: "5ChNmSJBnqTLk53m58UPBSWnZsNfuxUuK9iVL7jYzEui1E1T",
    },
    {
      contractId: ContractID.Transactions,
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/transactions.json"),
      address: "5Eq5QV565YesEPGSRxC8VoXGzXCjgRF3pmYhrjaFnc7PHXSA",
    },
  ];
};
