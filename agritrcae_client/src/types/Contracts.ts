export enum ContractID {
  EntityRegistry = "entity_registry",
  StakeholderRegistry = "stakeholder_registry",
  Transactions = "Transactions",
}

export interface IProduct {
  name: string;
  productCode: string;
  quantity: number;
  quantityUnits: string;
  batchNo: number;
  rawMaterials: number[];
  addedby?: string;
  timestamp?: number;
}
export interface IProductSold {
  productCode: string;
  quantity: number;
  quantityUnits: string;
  buyer: string;
  serialNo: number;
  batchNo: number[];
  createdAt: number;
  updatedAt: number;
  status: TransactionStatus;
  seller: string;
}
export interface IRawMaterial {
  name: string;
  entityCode: string;
  quantity: number;
  quantityUnit: string;
  batchNo: number;
  buyer: string;
  timestamp?: number;
  addedby?: string;
}
export enum TransactionStatus {
  Initiated = "Initiated",
  InProgress = "InProgress",
  Completed = "Completed",
  Reverted = "Reverted",
}
