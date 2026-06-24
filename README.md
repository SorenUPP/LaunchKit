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
- **Logging:** Winston
- **Documentation:** Swagger / OpenAPI 3.0
- **Testing:** Jest + Supertest

## Security Features

- Server-side refresh token storage and validation in Firestore
- Token versioning for immediate invalidation on role change or forced logout
- Rate limiting on all auth endpoints (20 req/15min general, 10 req/15min on login)
- CSRF origin validation on all state-changing requests
- Timing-safe login with dummy hash to prevent user enumeration
- Generic error messages to prevent account existence leakage
- httpOnly, secure, sameSite cookies for refresh tokens
- Request body size limit (10kb) to prevent bcrypt DoS
- Password max length enforced at 72 characters (bcrypt truncation boundary)
- Swagger docs disabled in production
- Structured audit logging with Winston

## Features

- User registration and login
- JWT access tokens (15 minute expiry)
- Refresh token rotation via httpOnly cookies (7 day expiry)
- Role-based access control (user / admin)
- Input validation with structured error responses
- 11 passing unit tests with mocked database

## Project Structure
LaunchKit/

├── server/

│   ├── index.js                  # Entry point

│   ├── server.js                 # Express app

│   └── src/

│       ├── config/

│       │   ├── logger.js         # Winston logger

│       │   └── swagger.js        # Swagger config

│       ├── middleware/

│       │   ├── auth.js           # JWT verification + token version check

│       │   ├── csrf.js           # CSRF origin validation

│       │   ├── rateLimiter.js    # Rate limiting

│       │   └── requireRole.js    # Role-based access

│       ├── models/

│       │   └── User.js           # Firestore user + token model

│       ├── routes/

│       │   ├── auth.js           # Auth endpoints

│       │   ├── protected.js      # Protected endpoints

│       │   └── validate.js       # Zod middleware

│       ├── validation/

│       │   └── authSchemas.js    # Zod schemas

│       └── tests/

│           └── auth.test.js      # Jest tests

├── .gitignore

└── package.json

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive access token | No |
| POST | `/api/auth/refresh` | Get new access token via cookie | No |
| POST | `/api/auth/logout` | Logout and invalidate refresh token | No |
| GET | `/api/me` | Get authenticated user info | Yes |
| GET | `/api/admin` | Admin only route | Admin |

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled

### Environment Variables

```env
JWT_SECRET=
JWT_REFRESH_SECRET=
FIREBASE_SERVICE_ACCOUNT=
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
NODE_ENV=development
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

## Authentication Flow
Register/Login → Access Token (15min) + Refresh Token cookie (7d)

Refresh token stored server-side in Firestore

↓

Access Token expires → POST /api/auth/refresh → validated against DB → New Access Token

↓

Logout → Refresh token deleted from Firestore + cookie cleared

## License

MIT
