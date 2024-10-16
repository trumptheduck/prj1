import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UPLOAD_PATH } from '../enum/api_path.enums';
import { Observable } from 'rxjs';
import { IFileRecord } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) { }

  uploadFile(files: File[]): Observable<IFileRecord[]> {
    let formData = new FormData();
    files.forEach(file => formData.append("upload", file));
    console.log(files);
    return this.http.post<IFileRecord[]>(UPLOAD_PATH, formData);
  }
}
