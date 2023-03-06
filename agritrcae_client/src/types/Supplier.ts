export interface ISupplier {
  name: string;
  phoneno: string;
  email?: string;
  address?: string;
  location: string;
  invitelink: string,
  created: Date,
  updated:Date,
  manufacturer_address:string,
  id?:string,
  status: SupplierStatus,
  
}
export enum SupplierStatus {
  Active = "Active",
  Invited = "Invited",
  Revoked = "Revoked",
  Pending = "Pending",
}

export interface IInviteBody {
  email: string;
  name: string;
  company: string;
  link: string;
}