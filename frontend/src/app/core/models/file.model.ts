export enum FileRecordPermission { public = "public", private = "private" }

export enum FileRecordType { video = "video", image = 'image', file = 'file' }

export interface IFileRecord {
    _id: string;
    filename: string;
    permission: FileRecordPermission;
    type: FileRecordType;
}