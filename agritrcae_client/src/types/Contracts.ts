export enum ContractID {
  EntityRegistry = "entity_registry",
  StakeholderRegistry = "stakeholder_registry",
  Transactions = "Transactions"
}

export interface IProduct {
  name: string;
  productCode: string;
  quantity: number;
  quantityUnits: string;
  batchNo: number;
  raw_materials: number[];
}
export interface IProductSold {
  productCode: string;
  quantity: number;
  quantityUnits: string;
  batchNo: number;
  buyer: string,
  serialNo: number,
}
export interface IRawMaterial {
  name: string,
  entityCode: string,
  quantity: number,
  quantityUnit: string,
  batchNo: number,
  buyer: string,
}
export enum TransactionStatus {
 Initiated = "Initiated",
 InProgress = "InProgress",
 Completed = "Completed",
 Reverted = "Reverted",
}
