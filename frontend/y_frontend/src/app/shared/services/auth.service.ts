import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/auth/login', body, {headers: headers, withCredentials: true});
  }

  register(user: User) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('nickname', user.nickname);
    body.set('password', user.password);
    body.set('birthday', user.birth);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/auth/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:5000/auth/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/auth/checkAuth', {withCredentials: true})
  }
}