import { IOrganizationScope } from "../interface/scope.interfaces";

export interface IRestaurant extends IOrganizationScope {
    _id?: string;
    name: string
    description: string
}
