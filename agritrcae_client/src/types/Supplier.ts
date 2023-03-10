import { Role } from "./Manufacturer";

export interface ISupplier {
  name: string;
  phoneNo: string;
  email: string;
  address: string;
  location: string;
  role: Role,
  timestamp: number;
}
export enum SupplierStatus {
  Active = "Active",
  Invited = "Invited",
  Revoked = "Revoked",
  Pending = "Pending",
}

export enum InviteTarget {
  Supplier = "Supplier",
  Manufacturer = "Manufacturer",
}

export interface IInviteBody {
  email?: string;
  name: string;
  company: string;
  link?: string;
  phoneno?: string;
  inviteCode?: string;
  target: InviteTarget;
  sender: string // wallet address of the one sending the invite
}