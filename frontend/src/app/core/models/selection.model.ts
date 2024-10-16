import { IDescribable } from "../interface/scope.interfaces";

export interface ISelection extends IDescribable {
    _id?: string;
    price: number;
    selected?: boolean;
}
