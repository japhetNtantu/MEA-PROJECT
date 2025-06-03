import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent {
  users = [
    { id: 1, name: 'Alice Doe', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' }
  ];
}

