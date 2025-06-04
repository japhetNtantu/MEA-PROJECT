import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/admin.service';
import { Customer } from 'src/app/models/users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: Customer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load users';
        this.loading = false;
      },
    });
  }

  editUser(userId: string): void {
    console.log('Edit user with ID:', userId);
    // Navigate to edit form or open modal
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
        },
        error: (err) => {
          this.error = err?.message || 'Failed to delete user';
        },
      });
    }
  }
}
