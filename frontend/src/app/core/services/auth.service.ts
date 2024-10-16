import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { AccountType, IUser, LoginType } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIHost } from '../enum/api_path.enums';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  _user: IUser|null = null;
  private authSubject: BehaviorSubject<boolean>;
  authObs: Observable<boolean>;
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private http: HttpClient
  ) {
    this.authSubject = new BehaviorSubject<boolean>(false);
    this.authObs = this.authSubject.asObservable();
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        user.getIdToken(true)
        localStorage.setItem('firebaseuser', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('firebaseuser')!);
      } else {
        localStorage.setItem('firebaseuser', 'null');
        JSON.parse(localStorage.getItem('firebaseuser')!);
      }
    });
    setInterval(()=>{
      if (this.userData) {
        this.userData.getIdToken(true).then((token:any) => {
          console.log(token);
          localStorage.setItem('token', token);
        });
      }
    },5*60000)
  }

  getAuth() {
    var token = localStorage.getItem('token');
    if (token === null) {
      return "";
    } else {
      return token;
    }
  }

  getUser(callback: (user:IUser)=>any) {
    if (this._user) {
      callback(this._user)
    } else {
      this.getUserData(callback);
    }
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((data)=>{
          data.user?.getIdToken(true).then(token => {
            localStorage.setItem("token", token);
            this.loginWithToken();
          })
      })
      .catch((error) => {
        window.alert("Thông tin đăng nhập sai!");
        this.authSubject.next(false);
      });
  }

  loginWithGoogle() {
    this.loginWithProvider(new firebase.default.auth.GoogleAuthProvider());
  }
  loginWithProvider(provider: any) {
    return this.afAuth
    .signInWithPopup(provider)
    .then((data)=>{
        console.log(data);
        data.user?.getIdToken(true).then(token => {
          localStorage.setItem("token", token);
          console.log(token);
          this.loginWithToken();
        })
    })
    .catch((error) => {
      window.alert("Thông tin đăng nhập sai!");
      this.authSubject.next(false);
    });
  }

  getUserData(success:(user:IUser)=>any, failure:()=>any = ()=>{}) {
    var headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this.getAuth())
    this.http.get(APIHost.uri + "auth", {headers: headers}).subscribe({next: (data:any)=>{
      this._user = data;
      success(data);
    }, error: ()=>{
      failure();
    }})
  }

  loginWithToken() {
    return new Promise<boolean>((resolve, reject) => {
        if (this._user) {
            resolve(true);
        } else {
            this.getUserData((data)=>{
                this._user = data;
                console.log(data);
                this.authSubject.next(true);
                resolve(true);
            }, () => {
                if (localStorage.getItem('token')) {
                    this.signOut();
                    alert("Bạn đã hết phiên đăng nhập!");
                }
                this.authSubject.next(false);
                resolve(false);
            })
        }
    })
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('firebaseuser')!);
    return user !== null;
  }
  signOut() {
    this.afAuth.signOut().then(() => {
      localStorage.setItem('firebaseuser', "");
      localStorage.setItem('token', "");
      this.userData = null;
      this._user = null;
      this.authSubject.next(false);
      this.router.navigate(['/admin/login']);
    });
  }
  changePassword(oldPassword: string, newPassword: string) {
    let _sub = new Subject<boolean>();
    let auth = firebase.default.auth;
    const cred = auth.EmailAuthProvider.credential(
      this.userData.email, oldPassword);
      this.userData.reauthenticateWithCredential(cred)
    .then(() => {
      _sub.next(true);
      return this.userData.updatePassword(newPassword);
    })
    .catch((error:any) => {
      _sub.next(false);
    });
    return _sub.asObservable();
  }
  validatePassword(password: string, callback: (state: boolean)=>any) {
    if (this._user&&this._user.loginType  == LoginType.google) return callback(false);
    this.afAuth.user.subscribe(user => {
      if (user) {
        if (!user.email) return callback(false);
        const _creds = firebase.default.auth.EmailAuthProvider.credential(user.email, password);
        user.reauthenticateWithCredential(_creds).then(_ => {
          return callback(true);
        }).catch((err)=> {
          console.log(err);
          return callback(false);
        })
      }
    })
  }
  
}