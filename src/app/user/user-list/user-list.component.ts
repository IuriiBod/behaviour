import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  displayedColumns = ['name', 'surname', 'age'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.subscription = this.userService.usersChanged
      .subscribe(
        (users: User[]) => {
          this.dataSource.data = users;
        }
      );

    this.dataSource.data = this.userService.getUsers();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onNewUser() {
    const user = {
      user_id: '',
      name: '',
      surname: '',
      age: null
    };

    this.userService.setUser(user);
  }

  onSelectUser(user: User) {
    this.userService.setUser(user);
  }

}
