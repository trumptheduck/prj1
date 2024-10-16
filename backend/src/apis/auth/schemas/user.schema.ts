import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum LoginType {
    email = "email",
    google = "google"
}

export enum AccountType {
    organization = "organization",
    employee = "employee",
}

export type UserDocument = User & Document;

@Schema({collection: "users"})
export class User {
    _id: string;
    @Prop({required: true})
    userId: string;
    @Prop({required: true})
    loginType: LoginType
    @Prop({required: true, default: AccountType.employee, enum: [AccountType.employee, AccountType.organization]})
    accountType: AccountType;
    @Prop({required: true})
    fullname: string;
    @Prop({required: false})
    email?: string
    @Prop({required: false})
    phoneNumber?: string
    @Prop({required: false})
    identifier?: string
}

export let UserSchema = SchemaFactory.createForClass(User);