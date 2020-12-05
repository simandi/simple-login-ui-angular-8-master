import { Component, OnInit, ViewChild } from '@angular/core';
// import { first } from 'rxjs/operators';
import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { first } from 'rxjs/operators';
export interface auditorData {
    firstName: string;
    lastName: string;
    userName: string;
    role: string;
    IP: string;
    logIn: Date;
    logOut: Date;
  }
@Component({ templateUrl: 'auditor.component.html'})
export class AuditorComponent implements OnInit {
    currentUser: User;
    displayedColumns: string[] = ['position', 'name', 'user name', 'role', 'IP address', 'logIn', 'logOut'];
    dataSource = new MatTableDataSource<auditorData>([])
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    private loadAllUsers() {
        this.userService.getAuditors(this.currentUser.username).subscribe(users => {
                this.dataSource = new MatTableDataSource<auditorData>(users);
                this.dataSource.paginator = this.paginator;
            },error => {
            });
    }
}