import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { TimestampModel } from "src/core/models/timestamp.model";

export type OrganizationDocument = Organization & Document;

@Schema({collection: "organizations"})
export class Organization extends TimestampModel {
    _id: string;
    @Prop({required: true})
    name: string
    @Prop({required: true})
    owner: string
    @Prop({required: false, default: ""})
    description: string
}

export let OrganizationSchema = SchemaFactory.createForClass(Organization);