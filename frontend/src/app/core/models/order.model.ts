import { OrderStatus, PaymentStatus, PaymentType } from "../enum/global.enums";
import { ITableScope } from "../interface/scope.interfaces";
import { IItem } from "./item.model";
import { IOrderHistory } from "./order_history.model";

export interface IOrder extends ITableScope{
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentType: PaymentType;
    tax: number;
    subtotal: number;
    total: number;
    items: IItem[];
    history: IOrderHistory[];
}