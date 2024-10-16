import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Describable } from "src/core/models/describable.model";

export type SelectionDocument = Selection & Document;

@Schema({collection: "selections"})
export class Selection extends Describable {
    _id?: string;
    @Prop({required: true})
    price: number;
    @Prop({required: false})
    selected?: boolean;
}

export let SelectionSchema = SchemaFactory.createForClass(Selection);