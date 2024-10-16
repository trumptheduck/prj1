import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Item } from "src/apis/item/schemas/item.schema";
import { OrderStatus, PaymentStatus, PaymentType } from "src/core/enums/global.enums";
import { TableScope } from "src/core/models/scope.model";
import { IOrder } from "../interfaces/order.interface";
import { OrderHistory } from "./order_history.schema";

export type OrderDocument = Order & Document;

@Schema({collection: "orders"})
export class Order extends TableScope implements IOrder {
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
    @Prop({required: false, default: [], type: [OrderHistory]})
    history: OrderHistory[];
}

export let OrderSchema = SchemaFactory.createForClass(Order);