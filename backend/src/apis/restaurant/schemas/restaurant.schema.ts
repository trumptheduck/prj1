import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { OrganizationScope } from "src/core/models/scope.model";

export type RestaurantDocument = Restaurant & Document;

@Schema({collection: "restaurants"})
export class Restaurant extends OrganizationScope {
    _id: string;
    @Prop({required: true})
    name: string
    @Prop({required: false, default: ""})
    description: string
}

export let RestaurantSchema = SchemaFactory.createForClass(Restaurant);