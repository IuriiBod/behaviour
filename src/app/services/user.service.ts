import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AsyncLocalStorage } from 'angular-async-local-storage';

import { User } from '../models/user.model';

@Injectable()
export class UserService {
  userChanged = new Subject<any>();
  usersChanged = new Subject<User[]>();

  private user = null;
  private users: User[] = [];

  constructor(private localStorage: AsyncLocalStorage) { }

  setUser(user: User) {
    this.user = user;
    this.userChanged.next(this.user);
  }

  getUsers() {
    this.localStorage.getItem<User>('users').subscribe((users) => {
      if (users) {
        this.users = users;
        this.usersChanged.next(this.users.slice());
      }
    });
    // this.localStorage.clear().subscribe(() => {});
    return this.users.slice();
  }

  updateUser(user_id: string, user: User) {
    this.users.forEach((item, i, arr) => {
      if (item['user_id'] === user_id) {
        arr[i] = Object.assign(item, user);
      }
    });

    this.setStorage();
  }

  addUser(user: User) {
    this.users.push(user);
    this.setStorage();
  }

  deleteUser(user_id: string) {
    let index = 0;
    this.users.forEach((item, i, arr) => {
      if (item['user_id'] === user_id) {
        index = i;
      }
    });

    this.users.splice(index, 1);
    this.setStorage();
  }

  setStorage() {
    this.localStorage.setItem('users', this.users).subscribe(() => {
      this.user = null;
      this.usersChanged.next(this.users.slice());
      this.userChanged.next(this.user);
    });
  }

}
