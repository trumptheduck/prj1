import { FileRecord } from "../schemas/file-record.schema";

export type FileUploadDTO = Omit<FileRecord, "filename"|"_id">