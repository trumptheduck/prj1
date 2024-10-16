import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { APIHost } from '../enum/api_path.enums';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends HttpService {
  userData: any;
  constructor(http: HttpClient, private afAuth: AngularFireAuth) {
    super(http)
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
      } else {
        this.userData = null;
      }
    });
  }

  getAuth() {
    var token = localStorage.getItem('token');
    if (token === null) {
      return "";
    } else {
      return token;
    }
  }

  override get<T>(path: string, params: any = {}): Observable<T> {
    return super.get(`${path}`, params, this.getAuth());
  }

  override put<T>(path: string, body: Object = {}): Observable<T> {
    return super.put(`${path}`, body, this.getAuth());
  }

  override patch<T>(path: string, body: Object = {}): Observable<T> {
    return super.patch(`${path}`, body, this.getAuth());
  }

  override post<T>(path: string, body: Object = {}): Observable<T> {
    return super.post(`${path}`, body, this.getAuth());
  }

  override delete<T>(path: string, params: any = {}): Observable<T> {
    return super.delete(`${path}`, params, this.getAuth());
  }
  override uploadMultipart(path: string, formdata: FormData): Observable<any> {
    return super.uploadMultipart(`${path}`, formdata, this.getAuth());
  }

}