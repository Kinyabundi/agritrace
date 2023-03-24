import { Role } from "./Manufacturer";

export interface IDistributor {
    name: string;
    phoneNo: string;
    email: string;
    address: string;
    location: string;
    role: Role;
}