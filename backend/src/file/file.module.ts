import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController, StaticController } from './file.controller';
import { FileRecordSchema } from './schemas/file-record.schema';
import { FileService } from './services/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FileRecord', schema: FileRecordSchema }])
  ],
  controllers: [StaticController, FileController],

})
export class FileModule {}
