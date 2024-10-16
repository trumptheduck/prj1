import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { RestaurantScope } from "src/core/models/scope.model";

export type TableDocument = Table & Document;

@Schema({collection: "tables"})
export class Table extends RestaurantScope {
    _id: string;
    @Prop({required: true})
    name: string
    @Prop({required: false, default: ""})
    description: string
}

export let TableSchema = SchemaFactory.createForClass(Table);