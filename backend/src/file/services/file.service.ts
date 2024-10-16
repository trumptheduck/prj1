import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileRecord, FileRecordDocument, FileRecordPermission, FileRecordType } from "../schemas/file-record.schema";
import { Model } from "mongoose"
import * as sharp from "sharp";
import * as fs from 'fs/promises';
import { Response } from "express";
import { extname, join } from "path";
import { EInternalError, ENotFound, EUnprocessableEntity } from "src/core/models/exception.models";

@Injectable()
export class FileService {
    constructor(@InjectModel(FileRecord.name) private fileRecordModel: Model<FileRecordDocument>) {}

    private async _resizeAndSaveImage(file: Express.Multer.File, filename: string) {
        try {
            const acceptedExts = [".jpg",".png",".jpeg",".gif",".bmp",".tif",".tiff"];
            const fileExt = extname(file.originalname);
            let isAccepted = false;
            for (let i = 0; i < acceptedExts.length; i ++) {
                if (fileExt == acceptedExts[i]) {
                    isAccepted = true;
                    break;
                }
            }
            if (!isAccepted) throw new EUnprocessableEntity(undefined, "Chỉ chấp nhận .jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff")
            await sharp(file.buffer).resize(1024, 1024, {
                fit: 'inside',
            })
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(join(process.cwd(), process.env.UPLOAD_PATH, filename));
        } catch (error) {
            console.log(error);
            throw new EInternalError(error);
        }
    }

    private async _saveUploadedFile(file: Express.Multer.File): Promise<string> {
        try {
            const fileExt = extname(file.originalname);
            const filename = `${Date.now()}-file${fileExt}`;
            await fs.writeFile(join(process.cwd(), process.env.UPLOAD_PATH, filename), file.buffer);
            return filename;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    private async _deleteFile(filename) {
        try {
                await fs.unlink(join(process.cwd(), process.env.UPLOAD_PATH, filename));
        } catch (error) {
            throw new EInternalError(error);
        }
    }

    async saveUploadedImage(file: Express.Multer.File, permission: FileRecordPermission = FileRecordPermission.public, productID: any = undefined): Promise<FileRecord> {
        try {
            const filename = `${Date.now()}-image.webp`;
            await this._resizeAndSaveImage(file, filename);
            let savedRecord: FileRecord = await (new this.fileRecordModel({
                filename: filename,
                permission: permission,
                type: FileRecordType.image,
                productId: productID
            })).save();
            return savedRecord;
        } catch (error) {
            console.log(error);
            throw new EInternalError(error);
        }
    }
    async saveUploadedImages(files: Express.Multer.File[], permission: FileRecordPermission = FileRecordPermission.public, productID: any = undefined): Promise<FileRecord[]> {
        try {
            let promises = [];
            for (let i = 0; i < files.length; i++) {
                const _file = files[i];
                const _promise: Promise<FileRecord> = this.saveUploadedImage(_file, permission, productID);
                promises.push(_promise);
            }
            let results = await Promise.all<FileRecord[]>(promises);
            return results;
        } catch (error) {
            throw new EInternalError(error);
        }
       
    }
    async deleteFile(id: string): Promise<FileRecord> {
        try {
            const record:FileRecord = await this.fileRecordModel.findByIdAndDelete(id);
            await this._deleteFile(record.filename);
            return record; 
        } catch (error) {
            throw new EInternalError(error);
        }
        
    }
    async deleteFiles(ids: string[]): Promise<FileRecord[]> {
        try {
            let results = [];
            for (let i = 0; i < ids.length; i++) {
                const _id = ids[i];
                const _record = await this.deleteFile(_id);
                results.push(_record);
            }
            return results;
        } catch (error) {
            throw new EInternalError(error);
        }
    }
    async getFileList(): Promise<FileRecord[]> {
        try {
            return await this.fileRecordModel.find();
        } catch (error) {
            throw new EInternalError(error);
        }
    }
    async getFileFromName(filename): Promise<FileRecord|null> {
        try {
            return await this.fileRecordModel.findOne({filename: filename});
        } catch (error) {
            throw new EInternalError(error);
        }
    }
    async serveStaticFile(res: Response, name: string) {
        try {
            const record = await this.fileRecordModel.findOne({
                filename: name
            });
            if (record) {
                res.sendFile(join(process.cwd(), process.env.UPLOAD_PATH, record.filename))
            } else {
                throw new ENotFound();
            }
        } catch (error) {
            throw new EInternalError(error);
        }   
    }

    async replaceFile(oldFile: string, newFile: Express.Multer.File) {
        const _oldRecord = await this.getFileFromName(oldFile);
        if (_oldRecord) {
            try {
                await this.deleteFile(_oldRecord._id);   
            } catch (error) {
                console.log(error);
            }
        }
        return await this.saveUploadedImage(newFile);
    }
    async saveUploadedFile(
        file: Express.Multer.File,
        type: FileRecordType,
        permission: FileRecordPermission = FileRecordPermission.public,
        productID: any = undefined): Promise<FileRecord> {
        try {
            const filename = await this._saveUploadedFile(file);
            let savedRecord: FileRecord = await (new this.fileRecordModel({
                filename: filename,
                permission: permission,
                type: type,
                productId: productID
            })).save();
            return savedRecord; 
        } catch (err) {
            throw new EInternalError(err);
        }
    }
    async saveUploadedFiles(
        files: Express.Multer.File[],
        type: FileRecordType,
        permission: FileRecordPermission = FileRecordPermission.public,
        productID: any = undefined): Promise<FileRecord[]>{
        try {
            let results = [];
           for (let i = 0; i < files.length; i++) {
               const _file = files[i];
               const _record: FileRecord = await this.saveUploadedFile(_file, FileRecordType.file, permission, productID);
               results.push(_record);
           }
           return results;
       } catch (error) {
           throw new EInternalError(error);
       }
    }

    async getAllFileRecords() {
        try {
            return await this.fileRecordModel.find();
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async deleteFileWithName(filename) {
        try {
            let record = await this.getFileFromName(filename);
            if (!record) {
                throw new Error("File not found");
            }
            return await this.deleteFile(record._id)
        } catch (err) {
            console.log("File not found: ", filename);
        }
    }
}