# ElitePC

ElitePC is an API-backed ecommerce application for high-performance computers and PC components.

## Repository structure

```text
ElitePC/
|-- frontend/   React + Vite storefront and Admin interface
|-- backend/    Laravel API, SQLite data, tests, and PDF invoices
|-- .gitignore
`-- README.md
```

The frontend communicates with Laravel through `VITE_API_URL`; it does not depend on filesystem proximity between the two applications.

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm

SQLite remains the default local development database.

## Backend setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

For an existing local checkout, preserve `backend/.env` and `backend/database/database.sqlite`. Do not run destructive migrations when retaining development data.

The Gemini integration reads its API key and model configuration from the backend environment. Never commit the real `.env` file or API keys.

## Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The supplied frontend environment example points `VITE_API_URL` to `http://127.0.0.1:8000/api`.

## Verification

From `backend/`:

```bash
php artisan about
php artisan test
```

From `frontend/`:

```bash
npm run build
npm run lint
```

## Local URLs

- Storefront: `http://127.0.0.1:5173`
- Laravel API: `http://127.0.0.1:8000/api`

Authentication, catalog, checkout, Admin, Elite AI, and invoice behavior remain owned by their existing applications under `frontend/` and `backend/`.

## Docker Compose

Docker runs the production frontend bundle with Nginx, the Laravel API with PHP 8.3 and Apache, and MySQL 8.4 with persistent named volumes.

Optional configuration can be copied before startup:

```bash
cp .env.docker.example .env
```

The Compose defaults are sufficient for local development, so the stack can also be started directly:

```bash
docker compose up --build
```

Open:

- Storefront: `http://localhost:3000`
- Laravel API: `http://localhost:8000/api`
- Laravel health endpoint: `http://localhost:8000/up`

Laravel waits for MySQL and runs `php artisan migrate --force` whenever the backend container starts. Migrations are incremental and do not erase existing data. Seeding never runs automatically. To add the idempotent local demo catalog and accounts intentionally, run:

```bash
docker compose exec backend php artisan db:seed
```

MySQL data is retained in the `mysql_data` volume. The generated local Laravel application key is retained in `laravel_runtime` when `APP_KEY` is not explicitly configured. For shared environments, provide stable credentials and `APP_KEY` through a non-committed root `.env` file based on `.env.docker.example`.

Elite AI requires a valid `GEMINI_API_KEY` in that root `.env`. The key is passed only to the backend container and is never built into the frontend image.
