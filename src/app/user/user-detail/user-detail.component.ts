import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  user: User;
  editMode = false;
  private subscription: Subscription;

  constructor(
    private userService: UserService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.subscription = this.userService.userChanged
      .subscribe(
        (user: User) => {
          this.user = user;
          this.editMode = (this.user && this.user.user_id !== '');
          this.initForm();
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initForm() {
    let user_id = '';
    let name = '';
    let surname = '';
    let age = null;

    if (this.user) {
      user_id = this.user.user_id;
      name =  this.user.name;
      surname =  this.user.surname;
      age =  this.user.age;
    }

    this.userForm = this.fb.group({
      name: [name, [
        Validators.required,
        Validators.minLength(2)
      ] ],
      surname: [surname, [
        Validators.required,
        Validators.minLength(2)
      ] ],
      age: [age, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ] ]
    });
  }

  onDelete() {
    this.userService.deleteUser(this.user.user_id);
  }

  onSubmit() {
    const user = this.userForm.value;

    if (this.editMode) {
      this.userService.updateUser(this.user.user_id, user);
    } else {
      user.user_id = UUID.UUID();
      this.userService.addUser(user);
    }
  }

}
