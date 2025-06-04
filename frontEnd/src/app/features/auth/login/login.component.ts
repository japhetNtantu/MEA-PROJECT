import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { UsersService } from 'src/app/core/users.service';
import { LoginRequest } from 'src/app/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.isLoading = false;
      this.errorMessage = 'Veuillez entrer votre nom d\'utilisateur et votre mot de passe.';
      this.markAllFieldsAsTouched(this.loginForm); 
      return;
    }

    const credentials: LoginRequest = this.loginForm.value;

    this.usersService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Connexion réussie ! Token :', response.access_token);
        this.router.navigate(['/public/home']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
        } else if (error.error && error.error.detail) {
          this.errorMessage = error.error.detail;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }
        console.error('Erreur de connexion :', error);
      }
    });
  }

  private markAllFieldsAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
