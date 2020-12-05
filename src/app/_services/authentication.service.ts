import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public clietnIPAddress;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    getIPAddress() {
        return this.http.get<any>('http://api.ipify.org/?format=json')
    }

    login(username, password) {
        const clietnIPAddress = this.clietnIPAddress;
        return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password, clietnIPAddress})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        return this.http.post<any>(`${config.apiUrl}/users/logout`, { id: this.currentUserSubject.value.auditorId })
    }
}