export interface ISupplier {
  name: string;
  phoneNo: string;
  email: string;
  address?: string;
  location: string;
  invitelink: string;
  invitecode?: string;
  created: Date;
  updated: Date;
  manufacturer_address: string;
  manufacturer_name: string;
  id?: string;
  status: SupplierStatus;
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
  link: string;
  phoneno?: string;
  inviteCode?: string;
  target: InviteTarget;
}