import { ITimestampModel } from "../interface/scope.interfaces";

export interface IOrganization extends ITimestampModel {
    _id?: string;
    name: string;
    description: string
}