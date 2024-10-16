import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../schemas/order.schema";
import { TableScopeService } from "src/core/services/scope.services";
import { OrderHistory } from "../schemas/order_history.schema";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { OrderStatus } from "src/core/enums/global.enums";

const SocketEvents = {
    SUBSCRIBE_TO_TABLE: "table:subscribe",
    UPDATE_ORDER_DATA: "order:update"
}

@Injectable()
export class OrderService extends TableScopeService<Order> {
    constructor(
        @InjectModel(Order.name) private _model: Model<OrderDocument>,
        private readonly httpService: HttpService,
    ) {
        super(_model);
    }

    override sendRealtimeUpdate(data: Order): Promise<any> {
        return firstValueFrom(this.httpService.post("localhost:3001/emit/table", {
            tableId: data.tableId,
            event: SocketEvents.UPDATE_ORDER_DATA,
            data: data
        }));
    }
    
    async update(dto: Order): Promise<Order> {
        const order = await this._model.findById(dto._id);
        dto.history = [...order.history, new OrderHistory(order)];
        return super.update(dto);
    }

    async finishOrder(dto: Order): Promise<Order> {
        const oldOrder = await this._model.findById(dto._id);
        dto.history = [...oldOrder.history, new OrderHistory(oldOrder)];
        const order = await this._model.findByIdAndUpdate(dto._id, {status: OrderStatus.completed}, {new: true});
        return order;
    }
}