import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { UsersService } from 'src/app/core/users.service';
import  { Customer } from 'src/app/models/users.model'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  registerForm!: FormGroup; 
  isLoading: boolean = false; 
  errorMessage: string | null = null; 
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      name: ['', Validators.maxLength(50)],
      firstname: ['', Validators.maxLength(50)],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.maxLength(50)],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.isLoading = false;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.markAllFieldsAsTouched(this.registerForm); 
      return;
    }

    const { confirmPassword, ...customerData } = this.registerForm.value;

    const customerToRegister: Customer = {
        username: customerData.username,
        name: customerData.name || null,
        firstname: customerData.firstname || null,
        phone: customerData.phone,
        address: customerData.address || null,
        password: customerData.password
    };


    this.usersService.registerCustomer(customerToRegister).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 400 && error.error && error.error.detail) {
          this.errorMessage = error.error.detail;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        }
        console.error('Erreur d\'inscription :', error);
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
