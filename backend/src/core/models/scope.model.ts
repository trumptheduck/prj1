import { Prop } from "@nestjs/mongoose"
import { TimestampModel } from "./timestamp.model";

export abstract class OrganizationScope extends TimestampModel {
    @Prop({required: true})
    orgId: string
}

export abstract class RestaurantScope extends OrganizationScope {
    @Prop({required: true})
    restoId: string
}

export abstract class TableScope extends RestaurantScope {
    @Prop({required: true})
    tableId: string
}