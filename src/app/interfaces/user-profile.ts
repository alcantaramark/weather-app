import { Address } from "./address";

export interface UserProfile {
    firstName: string,
    lastName: string,
    emailAddress: string,
    birthDate: Date,
    addresses: Address[]
}
