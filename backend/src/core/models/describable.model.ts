import { Prop } from "@nestjs/mongoose"
import { TimestampModel } from "./timestamp.model"
import { RestaurantScope } from "./scope.model"

export abstract class Describable {
    @Prop({required: true})
    name: string
    @Prop({required: false, default: ""})
    description: string
}