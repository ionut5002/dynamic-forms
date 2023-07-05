import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  selectedFile: File | null = null;
  
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
  });

  constructor(private authService: AuthService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const { email, password, displayName, phoneNumber } = this.registerForm.value;
      this.authService.register(email!, password!, displayName!, phoneNumber!, this.selectedFile);
    }
  }
}
