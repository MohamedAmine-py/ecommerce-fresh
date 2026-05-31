# Elite PC

**A Premium High-Performance Hardware & Custom E-Commerce Platform**

---

## Project Vision

Elite PC is an enterprise-grade e-commerce platform engineered to deliver an immersive, dark-themed user experience paired with a robust, RESTful API backend. Designed for high-performance computer hardware and custom system configurations, the platform bridges modern frontend interactivity with industrial-strength backend data management. Built for scalability, security, and seamless user engagement, Elite PC demonstrates full-stack engineering excellence suitable for both academic and commercial deployment.

---

## Architectural Overview & Tech Stack

### Frontend Architecture

- **React.js (v18+)** – Fast, component-driven UI rendering with hooks-based state management
- **Vite** – Next-generation build tool providing lightning-fast development and optimized production bundles
- **React Router v6** – Client-side routing for seamless multi-page navigation without server round-trips
- **Context API** – Global state management for user authentication, cart, favorites, and theme persistence
- **Tailwind CSS v4** – Utility-first CSS framework enabling the signature dark premium aesthetic with responsive design

**Design Principles:**
- Dark Premium Theme: Navy backgrounds (#1a1a2e, #16213e), high-contrast cyan accent (#00e5ff)
- Responsive Grid System: Mobile-first approach with adaptive layouts
- Professional Typography: Inter (body), JetBrains Mono (technical data)

### Backend Architecture

- **Laravel 12** – PHP framework providing API-first architecture with eloquent ORM and clean routing
- **Laravel Sanctum** – Token-based stateless authentication suitable for SPA/API consumers
- **Barryvdh DOMPDF** – Server-side PDF generation for professional invoice creation
- **Google Gemini PHP** – AI-powered support chat integration for intelligent customer assistance
- **MySQL 8+** – Relational database with strict schemas and referential integrity

**Design Principles:**
- RESTful API Conventions: Consistent endpoints, HTTP status codes, JSON responses
- Role-Based Access Control: Public, Authenticated (auth:sanctum), and Admin-only (auth:sanctum + admin middleware)
- Event-Driven Architecture: Seeders populate realistic hardware product data

### Database Schema

```
users → Manages customer authentication and administrative roles
categories → High-performance hardware categories (GPUs, CPUs, Coolers, etc.)
produits → Individual hardware products with specifications and pricing
commandes → Customer orders with payment and delivery metadata
details_commandes → Order line items (product quantity × price)
sessions → Laravel session management
personal_access_tokens → Sanctum API tokens for stateless authentication
```

---

## Key Feature Specifications

### 1. Multi-Page Dynamic Routing

The platform provides intuitive client-side navigation across distinct views:

- **Home** – Hero banner, featured products, promotional content
- **Products** – Comprehensive catalog with category filtering, search, and advanced sorting
- **About** – Company mission, brand story, platform philosophy
- **Contact** – Support inquiry form with message validation
- **Favorites** – Wishlist management with persistent localStorage caching
- **Orders** – Personal order history with payment/delivery details and invoice retrieval
- **Checkout** – Advanced 4-step purchasing wizard (see below)
- **Admin Dashboard** – Restricted administrative interface for analytics and product management

All navigation preserves user context (authentication, cart, theme preference) through Context API.

### 2. Advanced Multi-Step Checkout Flow

The checkout system implements a sophisticated 4-step wizard with inline validation and state persistence:

#### Step 1: Order Review
- Displays all cart items in tabular format
- Real-time calculation: **Subtotal + VAT (20%) = Total**
- Visual confirmation before proceeding
- Ability to edit cart inline

#### Step 2: Shipping & Delivery
- Delivery address input with minimum 10-character validation
- Phone number entry with 8-character minimum validation
- Automatic estimated delivery date calculation (current date + 3 business days, excluding weekends)
- Form submission blocked until all fields valid

#### Step 3: Payment Selection
- Three payment method options: Credit Card, PayPal, Cash on Delivery
- Radio-button selection UI with visual feedback
- Integration-ready for payment processor APIs
- Frontend validation ensures selection before proceeding

#### Step 4: Confirmation
- Success message with cyan accent styling
- Order confirmation acknowledges backend persistence
- Navigation link to Orders dashboard for invoice retrieval
- Cart state completely cleared (localStorage + React state)
- Navbar badge count reset to 0 items

**Technical Implementation:**
```javascript
// Backend validation (Laravel)
POST /api/orders
{
  "items": [{ "produit_id": 1, "quantite": 2 }],
  "payment_method": "credit_card|paypal|cash_on_delivery",
  "delivery_address": "string (min:10)",
  "delivery_phone": "string (min:8)"
}

// Response includes estimated_delivery_date calculated server-side
```

### 3. Document Automation: PDF Invoice Generation

Professional invoice PDF generation provides customers with downloadable records:

**Invoice Features:**
- Company branding: Elite PC logo and tagline
- Unique order ID (6-digit padded format)
- Customer and billing information
- Itemized order table with quantity, unit price, and subtotal
- VAT calculation breakdown (20%)
- Payment method displayed
- Estimated delivery date formatted for clarity
- Premium dark theme styling optimized for print

**Backend Implementation:**
```php
// Download invoice endpoint (protected by auth:sanctum)
GET /api/orders/{id}/invoice

// Authorization: Users view own invoices; admins view any
// Response: PDF file downloaded as "Invoice-{orderID}.pdf"
// Technology: Barryvdh\DomPDF\Facade\Pdf
```

**Template Engine:**
- Blade template with dynamic data binding
- CSS-in-HTML for consistent styling across browsers
- Print-optimized layout (A4 paper size, professional margins)

### 4. Administrative Layer

Secure admin dashboard provides platform oversight:

- **Analytics Dashboard** – Real-time sales metrics, revenue tracking, order volume
- **Product Inventory** – CRUD operations for hardware catalog
- **User Management** – Admin controls for user creation, modification, deletion
- **Order Monitoring** – View all customer orders regardless of status

**Authentication:** All admin routes require both `auth:sanctum` middleware AND `admin` role verification.

### 5. Authentication & Security

- **Token-Based Auth:** Laravel Sanctum provides API tokens for stateless authentication
- **CORS Protection:** Cross-origin requests validated and restricted
- **Input Validation:** Server-side validation on all forms (address length, phone format, etc.)
- **Role-Based Access Control:** Three tiers: Public, Authenticated User, Admin
- **Password Hashing:** Bcrypt with configurable rounds (default: 12)

### 6. AI-Powered Support Chat

The Elite PC Assistant utilizes the Google Gemini Flash-Lite model via a dedicated SupportChatController to provide real-time, context-aware hardware guidance and technical support.
- Real-time chat interface within platform
- Context-aware responses to product questions
- Order status inquiries
- Technical hardware guidance

---

## Installation & Local Environment Setup

### Prerequisites

Ensure your local environment meets these requirements:

- **PHP** ≥ 8.2
- **Node.js** ≥ 18.x
- **MySQL** ≥ 8.0
- **Composer** (dependency manager for PHP)
- **npm** (Node package manager)

### Step 1: Clone Repository & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/elite-pc.git
cd elite-pc

# Install PHP dependencies
composer install

# Install Node.js dependencies (frontend)
cd ecommerce-frontend
npm install
cd ..
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Generate application key (Laravel)
php artisan key:generate

# Configure database credentials in .env
# DATABASE_URL=mysql://user:password@127.0.0.1:3306/ecommerce_fresh
```

### Step 3: Database Initialization

```bash
# Run all migrations and seed realistic data
php artisan migrate:fresh --seed

# Alternative: Run migrations without seeding
php artisan migrate

# Verify database tables
php artisan tinker
# At tinker prompt: Illuminate\Support\Facades\DB::table('commandes')->count();
```

### Step 4: Start Development Servers

**Terminal 1 – Backend API Server (Port 8000):**
```bash
php artisan serve
# Runs on http://127.0.0.1:8000
```

**Terminal 2 – Frontend Development Server (Port 5173):**
```bash
cd ecommerce-frontend
npm run dev
# Runs on http://localhost:5173
```

**Combined Execution (Optional):**
If you have `concurrently` installed globally:
```bash
npm run dev
# This concurrently runs both servers
```

### Step 5: Verify Installation

1. Open browser to `http://localhost:5173`
2. Navigate to **Products** page – should display database-seeded hardware
3. Create test account: **Sign Up** button in navbar
4. Add item to cart and proceed to **Checkout**
5. Complete all 4 checkout steps and verify **Step 4: Confirmation**
6. Visit **Orders** dashboard and download PDF invoice

---

## API Documentation

### Public Endpoints (No Authentication Required)

```
POST   /api/register              – Create new user account
POST   /api/login                 – Authenticate and receive token
GET    /api/products              – List all products (paginated)
GET    /api/products/{id}         – Get product details
GET    /api/categories            – List all categories
POST   /api/support/chat          – Send message to AI support chat/Elite PC Assist(Gemini Flash-Lite)
```

### Authenticated Endpoints (auth:sanctum)

```
POST   /api/logout                – Revoke authentication token
GET    /api/user                  – Retrieve current user profile
GET    /api/orders                – List user's orders
POST   /api/orders                – Create new order (checkout submission)
GET    /api/orders/{id}           – Get order details
GET    /api/orders/{id}/invoice   – Download order invoice as PDF
```

### Admin-Only Endpoints (auth:sanctum + admin role)

```
POST   /api/products              – Create new product
PUT    /api/products/{id}         – Update product details
DELETE /api/products/{id}         – Delete product

POST   /api/categories            – Create new category
PUT    /api/categories/{id}       – Update category
DELETE /api/categories/{id}       – Delete category

PATCH  /api/orders/{id}/status    – Modify order status
DELETE /api/orders/{id}           – Delete order

GET    /api/admin/stats           – Dashboard analytics
GET    /api/admin/users           – List all users
POST   /api/admin/users           – Create admin user
PUT    /api/admin/users/{id}      – Update user
DELETE /api/admin/users/{id}      – Delete user
```

---

## Project Structure

```
elite-pc/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── API/
│   │           ├── AuthController.php
│   │           ├── CommandeController.php
│   │           ├── ProduitController.php
│   │           ├── CategorieController.php
│   │           ├── AdminController.php
│   │           └── SupportChatController.php
│   └── Models/
│       ├── User.php
│       ├── Commande.php
│       ├── Produit.php
│       ├── Categorie.php
│       └── DetailCommande.php
├── database/
│   ├── migrations/
│   │   ├── 2026_04_12_*.php (base tables)
│   │   └── 2026_05_30_*.php (payment & delivery fields)
│   └── seeders/
│       └── DatabaseSeeder.php
├── resources/
│   └── views/
│       └── invoices/
│           └── invoice.blade.php (PDF template)
├── routes/
│   ├── api.php (RESTful routes)
│   └── web.php
├── ecommerce-frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AppContext.jsx (global state)
│   │   ├── api/
│   │   │   └── client.js (API client)
│   │   └── styles/
│   │       └── main.css
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── composer.json
├── package.json
└── README.md
```

---

## Development Workflow

### Hot Module Replacement (HMR)

The Vite development server provides instant component reloading:
- Save a `.jsx` file → browser auto-refreshes within milliseconds
- CSS changes apply instantly without page reload
- Preserves React component state during edits

### Database Seeding

Populate development database with realistic data:
```bash
php artisan db:seed
# or rebuild from scratch
php artisan migrate:fresh --seed
```

### Code Quality

- **Frontend:** React best practices, functional components, hooks-based state
- **Backend:** PSR-12 coding standards, eloquent conventions, clear controller actions
- **Database:** Strict migrations, proper foreign keys, cascading deletes where appropriate

---

## Deployment Considerations

## Execution Environment

### Local Development Focus
The platform is fully optimized for execution and evaluation within a local development environment. 
- **Backend API:** Orchestrated via Laravel's built-in web server running locally on `http://127.0.0.1:8000`.
- **Frontend UI:** Served locally via Vite's development server on `http://localhost:5173`.
- **Database Engine:** Managed via a local MySQL instance with environment credentials securely stored in the local `.env` file.

### Environment Variables (Critical)

```env
# Security
APP_KEY=base64:...
APP_ENV=production
APP_DEBUG=false

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=elite_pc_prod
DB_USERNAME=prod_user
DB_PASSWORD=strong_password

# Frontend CORS
APP_URL=https://elite-pc.com
SANCTUM_STATEFUL_DOMAINS=elite-pc.com

# Payment Processors (future)
STRIPE_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
```

---


## Troubleshooting

### Common Issues

**Issue:** `SQLSTATE[HY000]: General error: 1030 Got error 28`
- **Solution:** Ensure sufficient disk space; check MySQL error logs

**Issue:** CORS errors when frontend calls backend
- **Solution:** Verify `APP_URL` in `.env` matches frontend origin; check `config/cors.php`

**Issue:** `php artisan serve` returns "Cannot resolve service provider"
- **Solution:** Run `composer install` and `php artisan clear-cache`

**Issue:** Frontend shows blank page
- **Solution:** Check browser console (F12) for errors; verify `npm run dev` is running; clear browser cache

**Issue:** Orders not displaying delivery date
- **Solution:** Run migration: `php artisan migrate:fresh --seed`

---

## License

This project is licensed under the MIT License – see the LICENSE file for details.

---

## Contact & Support

For technical inquiries, bug reports, or feature requests:

- **GitHub Issues:** [Report a bug](https://github.com/yourusername/elite-pc/issues)
- **Email Support:** support@elitepc.com
- **Documentation:** https://docs.elitepc.com

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

**Built with ❤️ for high-performance computing enthusiasts | © 2026 Elite PC**
