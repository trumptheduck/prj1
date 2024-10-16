export enum LoginType {
    email = "email",
    google = "google"
}

export enum AccountType {
    organization = "organization",
    employee = "employee",
}

export interface IUser {
    _id: string;
    userId: string;
    loginType: LoginType
    accountType: AccountType;
    fullname: string;
    email?: string
    phoneNumber?: string
    identifier?: string
}