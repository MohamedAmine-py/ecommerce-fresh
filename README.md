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
