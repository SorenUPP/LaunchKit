# LaunchKit

A production-ready fullstack authentication boilerplate built with Node.js, Express, Firebase, and JWT. Designed as a solid foundation for SaaS applications.

## Live Demo

Base URL: `https://launchkit-hvt0.onrender.com`  
Swagger Docs: available in development only

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** Firestore (Firebase)
- **Authentication:** JWT (access tokens) + Refresh tokens (httpOnly cookies)
- **Validation:** Zod
- **Email:** Resend
- **Logging:** Winston
- **Documentation:** Swagger / OpenAPI 3.0
- **Testing:** Jest + Supertest

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
- Structured audit logging with Winston

## Features

- User registration and login
- JWT access tokens (15 minute expiry)
- Refresh token rotation via httpOnly cookies (7 day expiry)
- Role-based access control (user / admin)
- Contact form email delivery via Resend
- Input validation with structured error responses
- 11 passing unit tests with mocked database

## Project Structure
```plaintext

LaunchKit/
├── server/
│   ├── index.js
│   ├── server.js
│   └── src/
│       ├── config/
│       │   ├── emailTemplates.js
│       │   ├── logger.js
│       │   ├── mailer.js
│       │   └── swagger.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── csrf.js
│       │   ├── rateLimiter.js
│       │   └── requireRole.js
│       ├── models/
│       │   └── User.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── contact.js
│       │   ├── protected.js
│       │   └── validate.js
│       ├── validation/
│       │   └── authSchemas.js
│       └── tests/
│           └── auth.test.js
├── .gitignore
└── package.json

```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
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

### Environment Variables

```env
JWT_SECRET=
JWT_REFRESH_SECRET=
FIREBASE_SERVICE_ACCOUNT=
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
NODE_ENV=development
RESEND_API_KEY=
COMPANY_EMAIL=
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
POST /api/contact → Zod validation → HTML sanitization → Rate limit check → Resend API → Email delivered to company inbox

## License

MIT