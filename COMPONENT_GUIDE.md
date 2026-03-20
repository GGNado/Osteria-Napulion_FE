# Guida – Come Creare Nuovi Componenti (Design Pattern)

Questa guida spiega come creare nuovi componenti in questo progetto Angular seguendo i design pattern adottati.

---

## Struttura del Progetto

```
src/app/
├── core/                    # Logica condivisa (singleton, app-wide)
│   ├── guards/              # Functional guards (CanActivateFn)
│   ├── interceptors/        # Functional HTTP interceptors
│   ├── models/              # Interfacce e DTO tipizzati
│   ├── services/            # Servizi iniettabili (providedIn: 'root')
│   └── url/                 # URL centralizzati per le API
├── features/                # Feature modules (lazy-loaded)
│   ├── home/
│   │   ├── components/      # Componenti presentazionali della feature
│   │   ├── layout/          # Layout wrapper (navbar, footer)
│   │   ├── pages/           # Pagine routablei
│   │   └── home.routes.ts   # Routes della feature
│   ├── admin/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   └── admin.routes.ts
│   └── login/
│       ├── pages/
│       └── login.routes.ts
```

---

## Regole Fondamentali

### 1. Standalone Components
Ogni componente è **standalone** (niente NgModules):

```typescript
@Component({
    selector: 'app-nome-componente',
    standalone: true,
    imports: [/* solo ciò che serve */],
    templateUrl: './nome-componente.html',
    styleUrl: './nome-componente.css',
})
```

### 2. Signals (non variabili mutabili)
Usa **signals** per tutto lo stato reattivo:

```typescript
// ✅ Corretto
readonly items = signal<Item[]>([]);
readonly isLoading = signal(false);
readonly filteredItems = computed(() => this.items().filter(...));

// ❌ Sbagliato
items: Item[] = [];
isLoading = false;
```

### 3. Dependency Injection con `inject()`
Usa la funzione `inject()` invece del constructor injection:

```typescript
// ✅ Corretto
private readonly authService = inject(AuthService);
private readonly router = inject(Router);

// ❌ Sbagliato
constructor(
    private authService: AuthService,
    private router: Router,
) {}
```

### 4. Tipizzazione Rigorosa
Mai usare `any`. Definisci le interfacce in `core/models/`:

```typescript
// ✅ Corretto – file: core/models/auth.model.ts
export interface LoginDTO {
    usernameOrEmail: string;
    password: string;
}

// ❌ Sbagliato
login(body: any): Observable<any> { ... }
```

---

## Come Creare un Nuovo Componente

### Passo 1: Identifica dove posizionarlo

| Tipo | Cartella | Esempio |
|------|----------|---------|
| Componente UI riusabile di una feature | `features/<feature>/components/` | `stats-cards`, `reservations-table` |
| Layout wrapper | `features/<feature>/layout/` | `admin-layout`, `home-navbar` |
| Pagina routabile | `features/<feature>/pages/` | `dashboard-page`, `login-page` |
| Servizio condiviso | `core/services/` | `auth.service.ts` |
| Modello/DTO | `core/models/` | `auth.model.ts`, `reservation.model.ts` |
| Guard | `core/guards/` | `auth.guard.ts` |
| Interceptor | `core/interceptors/` | `auth.interceptor.ts` |

### Passo 2: Crea i file

Ogni componente ha **3 file** con lo stesso nome base:

```
features/admin/components/mio-componente/
├── mio-componente.ts      # Logica
├── mio-componente.html    # Template
├── mio-componente.css     # Stili (scoped)
```

### Passo 3: Struttura del componente

```typescript
import { Component, inject, signal, computed } from '@angular/core';

@Component({
    selector: 'app-mio-componente',
    standalone: true,
    imports: [],
    templateUrl: './mio-componente.html',
    styleUrl: './mio-componente.css',
})
export class MioComponenteComponent {
    // 1. Dependency Injection
    private readonly mioService = inject(MioService);

    // 2. Signals per lo stato
    readonly dati = signal<MioModello[]>([]);
    readonly isLoading = signal(false);

    // 3. Computed signals per dati derivati
    readonly conteggio = computed(() => this.dati().length);

    // 4. Metodi pubblici per il template
    onAction(): void {
        // logica...
    }
}
```

---

## Design Pattern Specifici

### Servizi con Signals

I servizi espongono lo stato come **readonly signals**:

```typescript
@Injectable({ providedIn: 'root' })
export class MioService {
    // Signal privato writable
    private readonly _dati = signal<Dato[]>([]);

    // Signal pubblico readonly
    readonly dati = this._dati.asReadonly();

    // Computed derivati
    readonly conteggio = computed(() => this._dati().length);

    // Metodi che modificano lo stato
    aggiungi(dato: Dato): void {
        this._dati.update(lista => [...lista, dato]);
    }
}
```

### Functional Guards

```typescript
// core/guards/mio.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const mioGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (/* condizione */) {
        return true;
    }
    return router.createUrlTree(['/redirect']);
};
```

Applicare nelle routes:

```typescript
export const MIE_ROUTES: Routes = [
    {
        path: '',
        component: MioLayoutComponent,
        canActivate: [mioGuard],
        children: [...]
    },
];
```

### Functional Interceptors

```typescript
// core/interceptors/mio.interceptor.ts
export const mioInterceptor: HttpInterceptorFn = (req, next) => {
    // Modifica la request se necessario
    const modifiedReq = req.clone({ ... });
    return next(modifiedReq);
};
```

Registrare in `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([authInterceptor, mioInterceptor]))
```

---

## Stili CSS

### Variabili Globali

Usa **sempre** le CSS custom properties definite in `styles.css`:

```css
/* ✅ Corretto */
color: var(--text-primary);
background: var(--bg-secondary);
border-radius: var(--radius-md);
transition: all var(--transition-fast);

/* ❌ Sbagliato */
color: #1A1A2E;
background: #F9FAFB;
border-radius: 10px;
```

### Classi Globali

| Classe | Uso |
|--------|-----|
| `.btn` | Base per tutti i bottoni |
| `.btn-primary` | Bottone primario (sfondo brand) |
| `.btn-secondary` | Bottone secondario (bordo brand) |
| `.btn-outline` | Bottone outline neutro |
| `.container` | Container con max-width |
| `.section` | Sezione con padding verticale |

### Icone SVG

Usa **SVG inline** (no emoji, no icon fonts):

```html
<!-- ✅ Corretto -->
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="..." />
</svg>

<!-- ❌ Sbagliato -->
<span>📊</span>
<i class="fa fa-chart"></i>
```

### Font

- **Admin area**: `Inter` (sans-serif) per tutto
- **Homepage**: `Playfair Display` (serif) solo per titoli decorativi, `Inter` per il resto

---

## Checklist Nuovo Componente

- [ ] File `.ts`, `.html`, `.css` creati nella cartella corretta
- [ ] Componente è `standalone: true`
- [ ] Stato gestito con `signal()` e `computed()`
- [ ] DI con `inject()` (non constructor)
- [ ] Interfacce/DTO definiti in `core/models/`
- [ ] Nessun `console.log` in codice finale
- [ ] Nessun tipo `any`
- [ ] Stili usano CSS variables da `styles.css`
- [ ] Icone in SVG inline (no emoji)
- [ ] Componente importato dove necessario
