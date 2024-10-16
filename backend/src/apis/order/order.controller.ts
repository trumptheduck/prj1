import { Controller, Patch, Post } from '@nestjs/common';
import { TableScopeController } from 'src/core/controllers/scope.controllers';
import { Order } from './schemas/order.schema';
import { OrderService } from './services/order.service';
import { StrippedBody } from 'src/core/decorators/retain.decorator';
import { CreateDTO, UpdateDTO } from 'src/core/dtos/global.dtos';

@Controller('order')
export class OrderController extends TableScopeController<Order> {
    constructor(private _service: OrderService) {
        super(_service);
    }

    @Post("place")
    async placeOrder(@StrippedBody(['_id']) dto: CreateDTO<Order>): Promise<Order> {
        return await this._service.create(dto)
    }

    @Patch("status")
    async updateOrderStatus(@StrippedBody([
        'paymentStatus',
        'paymentType',
        'tax',
        'subtotal',
        'total',
        'items',
        'history',
    ]) dto: UpdateDTO<Order>): Promise<Order> {
        return await this._service.finishOrder(dto);
    }
}
