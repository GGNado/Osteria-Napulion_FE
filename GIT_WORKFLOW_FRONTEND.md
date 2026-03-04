# GIT_WORKFLOW_FRONTEND.md
Guida rapida ai comandi Git per il repo Frontend (branching + flusso di lavoro)

## Branch usati
- `main`    = stabile / produzione (prod-ready)
- `develop` = integrazione continua / dev-staging
- `feature/*` = lavoro su singole funzionalità

---

## 0) Setup iniziale (una sola volta): creare `develop` da `main`

### Comandi
```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

### Perché (in breve)
- Vai su `main` e lo aggiorni per partire dall’ultima versione.
- Crei `develop` copiando lo stato di `main`.
- Pubblichi `develop` su GitHub e imposti il tracking.

---

## 1) Iniziare una nuova feature (sempre)

### Comandi
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-feature
```

### Perché
- Parti sempre da `develop` aggiornato, così la feature nasce sulla base corretta.
- `feature/...` isola il lavoro (non sporchi `develop` e non rompi `main`).

Esempi nomi:
- `feature/login-ui`
- `feature/dashboard`
- `feature/vehicle-form`

---

## 2) Lavorare durante la feature (loop quotidiano)

### Vedere stato
```bash
git status
```

### Vedere differenze
```bash
git diff
```

### Aggiungere file allo staging
```bash
git add .
# oppure singolo file:
git add src/qualcosa.tsx
```

### Commit
```bash
git commit -m "feat: aggiunta form veicolo"
```

### Push (salvare sul remoto)
```bash
git push
# (la prima volta su un branch nuovo)
git push -u origin feature/nome-feature
```

### Perché
- `add` prepara cosa includere nel commit.
- `commit` crea uno “snapshot” salvato.
- `push` carica su GitHub (utile anche come backup + Actions su PR).

---

## 3) Aggiornare la tua feature con le ultime modifiche di `develop`

Quando qualcun altro ha messo roba su develop (o tu da un altro PC) e vuoi aggiornarti.

### Opzione A (semplice): merge develop dentro la feature
```bash
git checkout develop
git pull origin develop

git checkout feature/nome-feature
git merge develop
```

### Perché
- Ti porti dentro nella feature gli aggiornamenti di `develop`.
- È la scelta più semplice e sicura.

> Nota: se escono conflitti, li risolvi, poi:
```bash
git add .
git commit -m "merge develop into feature/nome-feature"
```

---

## 4) Chiudere la feature: integrare in `develop`

### Consigliato: PR su GitHub (Actions gira su PR)
```bash
git push
```
Poi su GitHub: Pull Request `feature/nome-feature` → `develop`.

### Alternativa: merge locale
```bash
git checkout develop
git pull origin develop
git merge feature/nome-feature
git push origin develop
```

### Perché
- `develop` diventa la somma di feature finite e testate.
- La PR ti fa controllare (CI) prima del merge.

---

## 5) Rilasciare: portare `develop` su `main`

### Consigliato: PR `develop` → `main`
Su GitHub: Pull Request `develop` → `main`.

### Alternativa: merge locale
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

### Perché
- `main` si aggiorna solo quando sei sicuro che è “rilasciabile”.
- Le Actions su `main` possono fare deploy PROD.

---

## 6) Cancellare branch feature (quando finita)

### Locale
```bash
git branch -d feature/nome-feature
```

### Remoto
```bash
git push origin --delete feature/nome-feature
```

### Perché
- Tieni pulita la repo e non accumuli branch vecchi.

---

## 7) Se per sbaglio hai lavorato su `main` o `develop` 😅

### Caso: hai commit locali su `main` ma dovevano stare su feature
Esempio: spostare gli ultimi commit su un nuovo branch feature.

```bash
git checkout main
git checkout -b feature/recupero-lavoro
git push -u origin feature/recupero-lavoro
```

Poi riporti `main` all’ultimo remoto (ATTENZIONE: se hai già pushato su main questa cosa cambia):
```bash
git checkout main
git pull origin main
```

> Se avevi già pushato commit “sbagliati” su main, NON fare reset a caso: meglio fare PR inversa o hotfix. (Chiedimi e ti dico la procedura sicura.)

---

## 8) Comandi utili extra

### Vedere branch e dove sei
```bash
git branch
```

### Vedere log compatto
```bash
git log --oneline --graph --decorate --all
```

### Salvare lavoro non committato (stash)
```bash
git stash
git stash pop
```

---

## Regole d’oro (riassunto)
1) Non lavorare mai direttamente su `main`.
2) Parti sempre da `develop` aggiornato.
3) Ogni task = un branch `feature/...`.
4) Integra su `develop` (meglio via PR).
5) Rilascia su `main` (meglio via PR).
