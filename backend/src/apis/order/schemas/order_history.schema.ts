import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Item } from "src/apis/item/schemas/item.schema";
import { OrderStatus, PaymentStatus, PaymentType } from "src/core/enums/global.enums";
import { TableScope } from "src/core/models/scope.model";
import { IOrder } from "../interfaces/order.interface";
import { Order } from "./order.schema";

export type OrderHistoryDocument = OrderHistory & Document;

@Schema({collection: "orderhistory"})
export class OrderHistory extends TableScope implements IOrder {
    @Prop({required: true})
    status: OrderStatus;
    @Prop({required: true})
    paymentStatus: PaymentStatus;
    @Prop({required: true})
    paymentType: PaymentType;
    @Prop({required: true})
    tax: number;
    @Prop({required: true})
    subtotal: number;
    @Prop({required: true})
    total: number;
    @Prop({required: true, type: [Item]})
    items: Item[];

    constructor(order: Order) {
        super();
        this.status = order.status;
        this.paymentStatus = order.paymentStatus;
        this.paymentType = order.paymentType;
        this.tax = order.tax;
        this.subtotal = order.subtotal;
        this.total = order.total;
        this.items = order.items;
    }

}

export let OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);