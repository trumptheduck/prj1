import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Option, OptionSchema } from "./option.schema";
import { Describable } from "src/core/models/describable.model";
import { RestaurantScope } from "src/core/models/scope.model";

export type ItemDocument = Item & Document;

@Schema({collection: "items"})
export class Item extends RestaurantScope {
    _id: string;
    @Prop({required: true})
    name: string
    @Prop({required: true})
    thumbnail: string
    @Prop({required: false, default: ""})
    description: string
    @Prop({required: true})
    price: number;
    @Prop({required: false, default: 0})
    count?: number;
    @Prop({required: true, type: [OptionSchema]})
    options: Option[]
}

export let ItemSchema = SchemaFactory.createForClass(Item);