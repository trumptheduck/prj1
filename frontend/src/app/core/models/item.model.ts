import { IRestaurantScope } from "../interface/scope.interfaces";
import { IOption } from "./option.model";

export interface IItem extends IRestaurantScope {
    _id?: string;
    thumbnail: string;
    name: string;
    description: string;
    price: number;
    count?: number;
    options: IOption[];
}
