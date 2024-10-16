import { Item } from "src/apis/item/schemas/item.schema";
import { OrderStatus, PaymentStatus, PaymentType } from "src/core/enums/global.enums";

export interface IOrder {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentType: PaymentType;
    tax: number;
    subtotal: number;
    total: number;
    items: Item[];
}