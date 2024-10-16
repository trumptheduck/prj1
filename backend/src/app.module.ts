import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import { ApisModule } from './apis/apis.module';
import * as admin from 'firebase-admin'
import { HttpModule } from '@nestjs/axios';
import { FileModule } from './file/file.module';
import { FileService } from './file/services/file.service';
import { FileRecord, FileRecordSchema } from './file/schemas/file-record.schema';
import { UserService } from './apis/auth/services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './core/guards/user.guard';
import { User, UserSchema } from './apis/auth/schemas/user.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule.forRoot({
      googleApplicationCredential: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as admin.ServiceAccount,
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URI),
    MongooseModule.forFeatureAsync([
      { name: FileRecord.name, useFactory: () => FileRecordSchema},
      { name: User.name, useFactory: () => {
        const schema = UserSchema;
        schema.plugin(require('mongoose-unique-validator'));
        return schema;
      }},]),
    ApisModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FileService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
  exports: [FileService, UserService]
})
export class AppModule {}
