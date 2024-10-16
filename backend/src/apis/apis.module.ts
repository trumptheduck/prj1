import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controllers';
import { ItemController } from './item/item.controller';
import { OrderController } from './order/order.controller';
import { OrganizationController } from './organization/organization.controller';
import { RestaurantController } from './restaurant/restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item/schemas/item.schema';
import { User, UserSchema } from './auth/schemas/user.schema';
import { ItemService } from './item/services/item.service';
import { UserService } from './auth/services/user.service';
import { TableController } from './table/table.controller';
import { OrderService } from './order/services/order.service';
import { Order, OrderSchema } from './order/schemas/order.schema';
import { OrganizationService } from './organization/services/organization.service';
import { Organization, OrganizationSchema } from './organization/schemas/organization.schema';
import { RestaurantService } from './restaurant/services/restaurant.service';
import { TableService } from './table/services/table.service';
import { Restaurant, RestaurantSchema } from './restaurant/schemas/restaurant.schema';
import { Table, TableSchema } from './table/schemas/table.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            {name: Item.name, schema: ItemSchema},
            {name: Order.name, schema: OrderSchema},
            {name: Organization.name, schema: OrganizationSchema},
            {name: Restaurant.name, schema: RestaurantSchema},
            {name: Table.name, schema: TableSchema},
            {name: User.name, schema: UserSchema},
        ])
    ],
    providers: [
        ItemService,
        OrderService,
        OrganizationService,
        RestaurantService,
        TableService,
        UserService
    ],
    controllers: [AuthController, OrderController, OrganizationController, RestaurantController, ItemController, TableController]
})
export class ApisModule {}
