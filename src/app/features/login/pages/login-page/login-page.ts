import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login-page.html',
    styleUrl: './login-page.css',
})
export class LoginPageComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    email = signal('');
    password = signal('');
    showPassword = signal(false);
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    togglePasswordVisibility(): void {
        this.showPassword.update((v) => !v);
    }

    onSubmit(): void {
        if (!this.email() || !this.password()) return;

        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.authService
            .login({ usernameOrEmail: this.email(), password: this.password() })
            .subscribe((success) => {
                this.isLoading.set(false);
                if (success) {
                    this.router.navigateByUrl('/admin');
                } else {
                    this.errorMessage.set('Credenziali non valide. Riprova.');
                }
            });
    }
}
