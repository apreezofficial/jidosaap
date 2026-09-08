# JidoSapp — Put WhatsApp on Autopilot

> Jidō (自動) — Japanese for automation.

JidoSapp is a production-ready, multi-tenant SaaS platform for AI-powered WhatsApp business automation. It combines the messaging reach of WhatsApp with automated workflows, AI agents, CRM, and API data integrations.

---

## Architecture

```
Next.js (Frontend)
      ↓  REST API
Vanilla PHP 8.3+ (Backend)
      ↓
PostgreSQL (Primary DB + pgvector)
      ↓
Redis Queue
      ↓  Workers
Meta WhatsApp Business Cloud API
OpenAI API
Stripe
S3 Storage
```

### Webhook Flow (Incoming Message)
```
WhatsApp Customer
  → Meta Webhook POST /api/webhooks/whatsapp
  → Signature Verification (HMAC-SHA256)
  → Store Message in DB
  → Push to Redis Queue
  → PHP Worker processes (AI / Automation)
  → Response via Meta Cloud API
  → Delivery receipt updates DB
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 15, TypeScript, Tailwind CSS|
| UI         | shadcn-inspired custom components   |
| Charts     | Recharts                            |
| Flow       | @xyflow/react (React Flow)          |
| Backend    | Vanilla PHP 8.3+, PSR-4 autoload    |
| Database   | PostgreSQL 16 + pgvector            |
| Queue      | Redis (LPUSH/BRPOP)                 |
| Auth       | HS256 JWT, Argon2id passwords       |
| Encryption | AES-256-GCM (secrets at rest)       |
| WhatsApp   | Meta Business Cloud API (official)  |
| AI         | OpenAI (abstracted provider)        |
| Billing    | Stripe (webhooks + portal)          |
| Storage    | S3-compatible object storage        |

---

## Requirements

- PHP 8.3+
- Composer
- PostgreSQL 14+ (16 recommended for pgvector)
- Redis 6+
- Node.js 20+
- Docker & Docker Compose (optional but recommended)

---

## Quick Start with Docker

```bash
# Clone and start everything
git clone https://github.com/yourorg/jidosapp.git
cd jidosapp

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit credentials in backend/.env
# (DB, JWT_SECRET, ENCRYPTION_KEY required at minimum)

# Start all services
docker compose up -d

# Run migrations
docker compose exec backend php migrate.php

# Seed demo data
docker compose exec backend php seed.php

# Frontend available at:  http://localhost:3000
# Backend API at:         http://localhost:8000/api/v1
```

---

## Manual Setup

### Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Copy and configure env
cp .env.example .env
# Edit .env with your database, Redis, JWT, and API credentials

# Run database migrations
php migrate.php

# Optional: seed demo data
php seed.php

# Start PHP development server
php -S 0.0.0.0:8000 -t public/
```

### Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Copy and configure env
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your backend

# Development
npm run dev

# Production build
npm run build
npm run start
```

### Worker (Background Job Processor)

```bash
cd backend

# Start the queue worker (processes WhatsApp, AI, automation jobs)
php worker.php

# Start the scheduler (triggers scheduled content jobs)
php scheduler.php
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `APP_ENV` | `local` / `production` |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis hostname |
| `JWT_SECRET` | Minimum 32-char random string |
| `ENCRYPTION_KEY` | AES-256 key for credential encryption |
| `META_APP_SECRET` | Meta App secret (webhook signature) |
| `OPENAI_API_KEY` | OpenAI API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Database Migrations

Migrations are SQL files in `backend/migrations/`, executed in alphabetical order.

```bash
# Run all pending migrations
php migrate.php
```

Migrations use a `migrations` tracking table to avoid re-running.

---

## Demo Seeding

```bash
php seed.php
```

Creates:
- Demo user: `demo@jidosapp.io` / `JidoDemoPass2026!`
- Demo workspace: Tokyo Retail (Demo)
- Sample contacts, conversations, messages, leads
- A demo AI agent
- A WhatsApp connection (demo credentials)
- Plans: Starter / Business / Pro / Agency

---

## Meta WhatsApp Setup

1. Create a Meta Developer App at [developers.facebook.com](https://developers.facebook.com/)
2. Add the WhatsApp Business product
3. Set Webhook URL: `https://yourdomain.com/api/webhooks/whatsapp`
4. Set Webhook Verify Token (your value from `META_VERIFY_TOKEN` in `.env`)
5. Subscribe to `messages` events
6. Get your Phone Number ID and WABA ID from the Meta dashboard
7. In JidoSapp: Settings → Integrations → WhatsApp → Connect Account

**Important:** JidoSapp uses only the official Meta WhatsApp Business Cloud API.
No web scraping, no unofficial libraries, no QR session automation.

---

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Add your `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
3. Create products for each plan in Stripe dashboard
4. Update `stripe_price_id_monthly` and `stripe_price_id_yearly` in the `plans` table
5. Configure webhook endpoint: `https://yourdomain.com/api/v1/billing/webhook/stripe`
6. Subscribe to: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
7. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## OpenAI Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add to `OPENAI_API_KEY` in `.env`
3. Default model: `gpt-4o-mini` (configurable via `OPENAI_MODEL`)

The AI provider is abstracted — alternative providers can be added by implementing the provider interface.

---

## API Documentation

Base URL: `/api/v1`

All authenticated requests require:
```
Authorization: Bearer <token>
X-Workspace-Id: <workspace-id>
```

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": null
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "fields": {}
  }
}
```

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET  | `/auth/me` | Current user + workspaces |
| GET  | `/contacts` | List contacts |
| GET  | `/conversations` | List conversations |
| POST | `/conversations/:id/messages` | Send message |
| GET  | `/content` | List content |
| POST | `/content` | Create content |
| GET  | `/automations` | List automations |
| GET  | `/agents` | List AI agents |
| GET  | `/analytics/dashboard` | Dashboard stats |
| GET  | `/crm/pipeline` | Kanban board |
| GET  | `/billing/subscription` | Current subscription |

---

## Security

- **Passwords**: Argon2id hashing
- **Sessions**: HS256 JWT with 7-day expiry
- **API secrets**: AES-256-GCM encryption at rest
- **Webhooks**: HMAC-SHA256 signature verification
- **Tenant isolation**: Row-level workspace scoping on every query
- **Rate limiting**: Auth endpoints rate-limited (20 req/min)
- **Prompt injection**: System instructions protected from customer input
- **SQL injection**: All queries use PDO prepared statements

---

## Running Tests

```bash
cd backend
php vendor/bin/phpunit tests/
```

---

## Production Deployment

### Backend (PHP)

- Use nginx + PHP-FPM
- Point document root to `backend/public/`
- Set `APP_ENV=production` and `APP_DEBUG=false`
- Run workers as a supervised process (supervisord or systemd)
- Use PostgreSQL with connection pooling (PgBouncer)

### Frontend (Next.js)

```bash
npm run build
npm run start
# Or deploy to Vercel, Netlify, or any Node.js host
```

### Workers

```bash
# /etc/supervisor/conf.d/jidosapp-worker.conf
[program:jidosapp-worker]
command=php /var/www/jidosapp/backend/worker.php
autostart=true
autorestart=true
numprocs=2
```

---

## Project Structure

```
jidosapp/
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── (app)/              # Authenticated app routes
│   │   │   ├── dashboard/
│   │   │   ├── inbox/
│   │   │   ├── contacts/
│   │   │   ├── crm/leads/
│   │   │   ├── content/
│   │   │   ├── calendar/
│   │   │   ├── templates/
│   │   │   ├── automations/
│   │   │   ├── agents/
│   │   │   ├── knowledge/
│   │   │   ├── analytics/
│   │   │   ├── integrations/
│   │   │   └── settings/
│   │   ├── (auth)/             # Login, register, forgot password
│   │   └── (marketing)/        # Landing page, pricing
│   ├── components/
│   ├── hooks/                  # Data fetching hooks
│   └── lib/                    # API client, utils, auth context
│
├── backend/                    # PHP REST API
│   ├── public/index.php        # Entry point
│   ├── src/
│   │   ├── Controllers/        # HTTP handlers
│   │   ├── Services/           # Business logic
│   │   ├── Providers/          # WhatsApp, Storage abstractions
│   │   ├── Middleware/         # Auth, Tenant, CORS, RateLimit
│   │   ├── Security/           # JWT, Argon2, AES
│   │   ├── Database/           # PDO connection, migrations
│   │   └── Queue/              # Redis queue implementation
│   ├── migrations/             # SQL migration files
│   ├── routes/api.php          # API route definitions
│   └── routes/webhooks.php     # Webhook endpoints
│
└── docker-compose.yml          # Full stack dev environment
```

---

## License

MIT — see LICENSE file.

---

*Built with Jidō (自動) — the spirit of intelligent automation.*
