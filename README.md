# LaunchKit

A production-ready fullstack authentication boilerplate built with Node.js, Express, Firebase, and JWT. Designed as a solid foundation for SaaS applications.

## Live Demo

Base URL: `https://launchkit-hvt0.onrender.com`  
Swagger Docs: `https://launchkit-hvt0.onrender.com/api/docs`

> Note: The free tier on Render spins down after inactivity. First request may take 30–60 seconds.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** Firestore (Firebase)
- **Authentication:** JWT (access tokens) + Refresh tokens (httpOnly cookies)
- **Validation:** Zod
- **Documentation:** Swagger / OpenAPI 3.0
- **Testing:** Jest + Supertest

## Features

- User registration and login
- JWT access tokens (15 minute expiry)
- Refresh token rotation via httpOnly cookies (7 day expiry)
- Role-based access control (user / admin)
- Input validation with structured error responses
- Interactive API documentation
- 7 passing unit tests with mocked database

## Project Structure
LaunchKit/

├── server/

│   ├── index.js              # Entry point

│   ├── server.js             # Express app

│   └── src/

│       ├── config/

│       │   └── swagger.js    # Swagger config

│       ├── middleware/

│       │   ├── auth.js       # JWT verification

│       │   ├── requireRole.js # Role-based access

│       │   └── validate.js   # Request validation

│       ├── models/

│       │   └── User.js       # Firestore user model

│       ├── routes/

│       │   ├── auth.js       # Auth endpoints

│       │   └── protected.js  # Protected endpoints

│       ├── validation/

│       │   └── authSchemas.js # Zod schemas

│       └── tests/

│           └── auth.test.js  # Jest tests

├── .gitignore

└── package.json

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive access token | No |
| POST | `/api/auth/refresh` | Get new access token via cookie | No |
| POST | `/api/auth/logout` | Logout and clear cookie | No |
| GET | `/api/me` | Get authenticated user info | Yes |
| GET | `/api/admin` | Admin only route | Admin |

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled

### Installation

```bash
git clone https://github.com/SorenUPP/LaunchKit.git
cd LaunchKit
npm install
```

### Environment Variables

Create a `.env` file in the `server/` folder:
PORT=5000

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
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

↓

Access Token expires → POST /api/auth/refresh → New Access Token

↓

Logout → Cookie cleared

## License

MIT