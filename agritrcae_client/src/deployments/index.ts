import { SubstrateDeployment, alephzeroTestnet } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: "entity_registry",
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/entity_registry.json"),
      address: "5EVihWZ5PBqJLhJS49gWRuW4ugTu9t5K56CvVhGWkwW5rg1k",
    },
    {
      contractId: "stakeholder_registry",
      networkId: alephzeroTestnet.network,
      abi: await import("./metadatas/stakeholder_registry.json"),
      address: "5Eyty7TYWqjheaoFu72tjT1F2edah8a1oshUEiQZxH1WZnsX",
    },
  ];
};
