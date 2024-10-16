import { Controller, Delete, Get, Param, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadMulterFile } from './models/upload.model';
import { FileUploadDTO } from './dtos/file.dtos';
import { FileRecordPermission } from './schemas/file-record.schema';
import { FileService } from './services/file.service';
import { StrippedBody } from 'src/core/decorators/retain.decorator';
import { isArrayEmpty, onlyWithin } from 'src/core/helpers/utils.helper';
import { EInternalError, EUnprocessableEntity } from 'src/core/models/exception.models';

@Controller('file')
export class FileController {
    constructor(private fileService: FileService) {}
    @Post('upload')
    @UseInterceptors(FileFieldsInterceptor([
        {name: "upload", maxCount: 99}
    ]))
    async uploadFile(@StrippedBody(["filename", "_id"]) dto: FileUploadDTO, @UploadedFiles() files: UploadMulterFile) {
        try {
            if (isArrayEmpty(files.upload))
                throw new EUnprocessableEntity(undefined, "Không có file để upload trong trường upload")
            if (!dto.permission) dto.permission = FileRecordPermission.public;
            if (!onlyWithin(dto.permission, ["public", "private"]))
                throw new EUnprocessableEntity(undefined, "Trường permission chỉ chấp nhận 'public', 'private'");
            return await this.fileService.saveUploadedFiles(files.upload, dto.type, dto.permission);
        } catch (err) {
            throw new EInternalError(err);
        }
    }
    @Post('upload/images')
    @UseInterceptors(FileFieldsInterceptor([
        {name: "upload", maxCount: 99}
    ]))
    async uploadImages(@StrippedBody(["filename", "_id"]) dto: FileUploadDTO, @UploadedFiles() files: UploadMulterFile) {
        try {
            if (isArrayEmpty(files.upload))
                throw new EUnprocessableEntity(undefined, "Không có file để upload trong trường upload")
            if (!dto.permission) dto.permission = FileRecordPermission.public;
            if (!onlyWithin(dto.permission, ["public", "private"]))
                throw new EUnprocessableEntity(undefined, "Trường permission chỉ chấp nhận 'public', 'private'");
            return await this.fileService.saveUploadedImages(files.upload, dto.permission);
        } catch (err) {
            throw new EInternalError(err);
        }
    }
    @Delete('')
    async deleteFile(@Query("filename") filename: string) {
        return await this.fileService.deleteFileWithName(filename);
    }
    @Get('')
    async getFileList() {
        return await this.fileService.getAllFileRecords();
    }
    
}

@Controller('static')
export class StaticController {
    constructor(private fileService: FileService) {}
    @Get(":name")
    async getFile(@Res() res: Response, @Param() params) {
        await this.fileService.serveStaticFile(res, params.name);
    }
}
