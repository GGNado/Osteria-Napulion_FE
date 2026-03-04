import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login-page.html',
    styleUrl: './login-page.css',
})
export class LoginPageComponent {
    email = signal('');
    password = signal('');
    rememberMe = signal(false);
    showPassword = signal(false);
    isLoading = signal(false);

    togglePasswordVisibility(): void {
        this.showPassword.update((v) => !v);
    }

    onSubmit(): void {
        if (!this.email() || !this.password()) return;
        this.isLoading.set(true);
        // TODO: Implement actual authentication logic
        console.log('Login attempt:', { email: this.email(), rememberMe: this.rememberMe() });
        setTimeout(() => this.isLoading.set(false), 1500);
    }
}
