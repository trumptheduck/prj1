import { AccountType, User } from "../schemas/user.schema";

export type CreateUserDTO = Omit<User, "_id">

export type EditUserDTO = User;

export interface CreateFirebaseUserDTO {
    email: string,
    password: string,
    fullname: string,
    accountType?: AccountType,
}
export interface SelfChangePasswordDTO {
    password: string;
}

export interface ChangePasswordDTO {
    uid: string,
    password: string
}
export type EditProfileDTO = User