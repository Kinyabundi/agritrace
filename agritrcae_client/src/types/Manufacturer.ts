export interface IManufacturer {
  address: string;
  name: string;
  products: string[];
  corporateNo: string;
  phoneNos: string[];
  location: string;
  timestamp?: number;
  suppliers?: string[];
  role: Role;
}

export enum Role {
  MANUFACTURER = 'Manufacturer',
  SUPPLIER = 'Supplier',
  DISTRIBUTOR = 'Distributor',
}
