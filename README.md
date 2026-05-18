# README — E-commerce Backend Setup

## Étape 1 — Copier les fichiers

Copie tous les fichiers générés dans ton projet Laravel :
```
C:\Users\Mjid\ecommerce-backend\
```

Structure attendue :
```
ecommerce-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/API/
│   │   │   ├── AuthController.php
│   │   │   ├── ProduitController.php
│   │   │   ├── CategorieController.php
│   │   │   ├── CommandeController.php
│   │   │   └── AdminController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Categorie.php
│       ├── Produit.php
│       ├── Commande.php
│       └── DetailCommande.php
├── database/
│   ├── migrations/         ← 5 migration files
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   └── api.php
└── public/
    └── test-frontend.html
```

---

## Étape 2 — Configurer .env

Ouvre le fichier `.env` dans ton projet et modifie ces lignes :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## Étape 3 — Créer la base de données

1. Ouvre XAMPP Control Panel → Start **MySQL**
2. Va sur http://localhost/phpmyadmin
3. Clique **New** → nom : `ecommerce_db` → **Create**

---

## Étape 4 — Installer Sanctum

Dans le terminal, dans le dossier du projet :

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

## Étape 5 — Enregistrer le middleware Admin

Ouvre le fichier `bootstrap/app.php` et ajoute ceci dans la section `withMiddleware` :

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ]);
})
```

---

## Étape 6 — Supprimer les anciennes migrations

Laravel crée des migrations par défaut qu'on n'utilise pas.
Dans `database/migrations/`, supprime ces fichiers :
- `0001_01_01_000000_create_users_table.php`  ← remplacé par le nôtre
- `0001_01_01_000001_create_cache_table.php`
- `0001_01_01_000002_create_jobs_table.php`

---

## Étape 7 — Lancer les migrations + seeders

```bash
php artisan migrate:fresh --seed
```

`migrate:fresh` recrée toutes les tables depuis zéro.
`--seed` remplit les tables avec les données de test.

Comptes créés automatiquement :
- Admin  : admin@ecommerce.com  / admin123
- Client : client@ecommerce.com / client123

---

## Étape 8 — Configurer CORS

Ouvre `config/cors.php` et assure-toi que ces lignes sont présentes :

```php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

## Étape 9 — Démarrer le serveur

```bash
php artisan serve
```

---

## Étape 10 — Tester

Ouvre dans ton navigateur :
```
http://localhost:8000/test-frontend.html
```

Tu verras l'interface de test complète !

Connecte-toi avec :
- **Admin** : admin@ecommerce.com / admin123
- **Client** : client@ecommerce.com / client123

---

## Tester l'API directement (optionnel)

Tu peux aussi tester avec le navigateur ou Postman :

```
GET  http://localhost:8000/api/products
GET  http://localhost:8000/api/categories
POST http://localhost:8000/api/login
```
