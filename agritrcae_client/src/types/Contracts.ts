export enum ContractID {
  EntityRegistry = "entity_registry",
  StakeholderRegistry = "stakeholder_registry",
}

export interface IProduct {
  name: string;
  productCode: string;
  quantity: number;
  quantityUnits: string;
  batchNo: number;
  raw_materials: number[];
}
export interface IRawMaterial {
  name: string,
  entityCode: string,
  quantity: number,
  quantityUnits: string,
  batchNo: number,
}
