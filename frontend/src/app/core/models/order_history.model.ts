import { OrderStatus, PaymentStatus, PaymentType } from "../enum/global.enums";
import { ITableScope } from "../interface/scope.interfaces";
import { IItem } from "./item.model";

export interface IOrderHistory extends ITableScope  {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentType: PaymentType;
    tax: number;
    subtotal: number;
    total: number;
    items: IItem[];
}