import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AllUrl } from '../url/all.url';
import { JwtPayload, LoginDTO, RegisterDTO, UserDTO } from '../models/auth.model';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this._token.asReadonly();

  readonly isAuthenticated = computed(() => {
    const t = this._token();
    if (!t) return false;
    try {
      const payload = jwtDecode<JwtPayload>(t);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  });

  readonly currentUser = computed<string | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      return jwtDecode<JwtPayload>(t).sub;
    } catch {
      return null;
    }
  });

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) { }

  login(body: LoginDTO): Observable<boolean> {
    return this.http
      .post<UserDTO>(AllUrl.login(), body, { observe: 'response' })
      .pipe(
        map((response) => {
          const token = response.headers.get('Authorization');
          if (!token) return false;
          this._token.set(token);
          localStorage.setItem(TOKEN_KEY, token);
          return true;
        }),
        catchError((err: HttpErrorResponse) => of(false)),
      );
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }
}
