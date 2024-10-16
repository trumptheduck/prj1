import { IRestaurantScope } from "../interface/scope.interfaces";

export interface ITable extends IRestaurantScope {
    _id: string;
    name: string
    description: string
}
