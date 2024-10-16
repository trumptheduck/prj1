import { IDescribable } from "../interface/scope.interfaces";
import { ISelection } from "./selection.model";

export interface IOption extends IDescribable {
    _id?: string;
    selections: ISelection[];
    multi: boolean;
}
