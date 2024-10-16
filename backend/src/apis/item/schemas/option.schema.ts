import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Describable } from "src/core/models/describable.model";
import { SelectionSchema } from "./selection.schema";

export type OptionDocument = Option & Document;

@Schema({collection: "options"})
export class Option extends Describable {
    _id?: string;
    @Prop({required: true, type: [SelectionSchema]})
    selections: Selection[];
    @Prop({required: false, default: false})
    multi: boolean;
}

export let OptionSchema = SchemaFactory.createForClass(Option);