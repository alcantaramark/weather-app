import { Address } from "./address";

export interface UserProfile {
    id:number,
    firstName: string,
    lastName: string,
    emailAddress: string,
    birthDate: Date,
    addresses: Address[]
}
