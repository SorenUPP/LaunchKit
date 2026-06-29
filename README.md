# LaunchKit

A production-ready backend authentication boilerplate built with Node.js, Express, Firebase, and JWT. Designed as a solid foundation for SaaS applications and internal products.

## Live Demo

Base URL: `https://launchkit-hvt0.onrender.com`  
Swagger Docs: available in development only.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** Firestore (Firebase)
- **Authentication:** JWT (access tokens) + Refresh tokens (httpOnly cookies)
- **Validation:** Zod
- **Email:** Resend
- **Logging:** Winston
- **Error Tracking:** Sentry
- **Testing:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Documentation:** Swagger / OpenAPI 3.0

## Security Features

- Server-side refresh token storage and validation in Firestore
- Token versioning for immediate invalidation on role change or forced logout
- Rate limiting on all auth endpoints (20 req/15min general, 10 req/15min on login)
- Rate limiting on contact endpoint (5 req/hour)
- CSRF origin validation on all state-changing requests
- Timing-safe login with dummy hash to prevent user enumeration
- Generic error messages to prevent account existence leakage
- httpOnly, secure, sameSite cookies for refresh tokens
- Request body size limit (10kb) to prevent bcrypt DoS
- Password max length enforced at 72 characters (bcrypt truncation boundary)
- HTML input sanitization on contact form (sanitize-html)
- Swagger docs disabled in production
- Firestore locked down to Admin SDK only (no client-side access)
- Structured audit logging with Winston
- Environment variable validation on startup — server refuses to boot with missing config

## Features

- User registration and login
- JWT access tokens (15 minute expiry)
- Refresh token rotation via httpOnly cookies (7 day expiry)
- Role-based access control (user / admin)
- Contact form email delivery via Resend
- Input validation with structured error responses
- Health check endpoint (`/health`) for uptime monitoring
- Graceful shutdown with SIGTERM/SIGINT handling
- Uncaught exception and unhandled rejection recovery
- 15 passing unit tests with mocked database
- CI pipeline runs full test suite on every push to main

## Project Structure

```plaintext
LaunchKit/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── config/
│   │   ├── emailTemplates.js
│   │   ├── env.js
│   │   ├── logger.js
│   │   ├── mailer.js
│   │   ├── sentry.js
│   │   └── swagger.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── csrf.js
│   │   ├── rateLimiter.js
│   │   └── requireRole.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── protected.js
│   │   └── validate.js
│   ├── validation/
│   │   └── authSchemas.js
│   └── tests/
│       └── auth.test.js
├── server/
│   └── index.js
├── firestore.rules
├── firestore.indexes.json
├── app.js
├── .gitignore
└── package.json
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check for uptime monitoring | No |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive access token | No |
| POST | `/api/auth/refresh` | Get new access token via cookie | No |
| POST | `/api/auth/logout` | Logout and invalidate refresh token | No |
| GET | `/api/me` | Get authenticated user info | Yes |
| GET | `/api/admin` | Admin only route | Admin |
| POST | `/api/contact` | Send contact message to company | No |

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Resend account and API key
- Sentry project (optional, for error tracking)

### Environment Variables

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=
JWT_REFRESH_SECRET=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
RESEND_API_KEY=
CONTACT_EMAIL=
SENTRY_DSN=
```

### Installation

```bash
git clone https://github.com/SorenUPP/LaunchKit.git
cd LaunchKit
npm install
```

### Run Locally

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

## Contact Flow

```
POST /api/contact → Zod validation → HTML sanitization → Rate limit check → Resend API → Email delivered
```

## CI/CD

GitHub Actions runs the full Jest test suite on every push and pull request to `main`. Required secrets must be added to GitHub → Settings → Secrets → Actions.

## License

MIT