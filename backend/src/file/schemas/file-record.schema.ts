import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export enum FileRecordPermission { public = "public", private = "private" }

export enum FileRecordType { video = "video", image = 'image', file = 'file' }

export type FileRecordDocument = FileRecord & Document;

@Schema({collection: "filerecords"})
export class FileRecord {
    _id: string;
    @Prop({required: true})
    filename: string;
    @Prop({type: String, required: true})
    permission: FileRecordPermission;
    @Prop({type: String, required: true})
    type: FileRecordType;
}

export let FileRecordSchema = SchemaFactory.createForClass(FileRecord);