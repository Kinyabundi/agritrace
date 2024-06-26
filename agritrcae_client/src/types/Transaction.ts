import { IDistributor } from "./Distributor";
import { IManufacturer } from "./Manufacturer";
import { ISupplier } from "./Supplier";

export enum TransactionStatus {
  Initiated = "Initiated",
  InProgress = "InProgress",
  Completed = "Completed",
  Reverted = "Reverted",
}

// Create Array of Transaction Status
export const transactionStatusArray = Object.keys(TransactionStatus).map(
  (key) => TransactionStatus[key] as string
);

export interface IEntity {
  entityCode: string;
  quantity: number;
  quantityUnit: string;
  batchNo: number;
  createdAt: number;
  updatedAt: number;
  buyer: string;
  seller: string;
  status: TransactionStatus;
}
export interface IProductSale {
  productCode: string;
  quantity: number;
  quantityUnit: string;
  batchNo: number[];
  createdAt: number;
  buyer: string;
  seller: string;
  status: TransactionStatus;
  updatedAt: number;
  serialNo: string;
}

export interface IBacktrace {
  productTransaction: IProductSale;
  entityTransactions: IEntity[];
}

export interface IStakeholderInfo {
  supplier: ISupplier;
  manufacturer: IManufacturer;
  distributor: IDistributor;
}

export interface IProductItem {
  name: string;
  quantity: number;
  quantityUnits: string;
  batchNo: number;
  timestamp: number;
  addedby: string;
  rawMaterials: number[];
  productCode: string;
}
