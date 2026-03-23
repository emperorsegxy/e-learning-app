# CLAUDE.md — E-Learning App

This document describes the codebase structure, development workflows, and conventions for AI assistants working on this project.

---

## Project Overview

A Node.js/TypeScript REST API backend for an e-learning platform supporting:
- User authentication (registration, login, email verification via OTP, password reset)
- Course management (CRUD)
- Module/content management with file uploads to Cloudinary
- Multi-role users: `learner` and `creator`

**Author:** Ishola Segun
**Server Port:** 5667 (default)
**Database:** MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript 5 |
| Framework | Express.js 4 |
| Database | MongoDB via Mongoose 7 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Joi |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Logging | Winston + Morgan |
| OTP | otp-generator |

---

## Directory Structure

```
src/
├── index.ts                   # App entry point: middleware setup, route registration, DB connect
├── db/                        # Mongoose models and DB connection
│   ├── connect.ts             # MongoDB connection via MONGO_URI env var
│   ├── User.ts                # User model (firstName, lastName, email, password, userType, hasVerifiedEmail)
│   ├── Course.ts              # Course model (title, owner, description)
│   ├── Module.ts              # Module model (name, type, content, courseId, contentType)
│   ├── OTP.ts                 # OTP model (email, otp; TTL: 5 min)
│   └── OtpSession.ts          # OTP session token model (email, token; TTL: 5 min)
├── routes/                    # Express route handlers
│   ├── user.ts                # Auth and user routes
│   ├── course.ts              # Course CRUD routes
│   └── module.ts              # Module creation route
├── services/                  # Business logic layer
│   ├── auth/
│   │   ├── registerNewUser.ts # User registration logic
│   │   ├── logUserIn.ts       # Login logic
│   │   ├── manageOTP.ts       # OTP generation and verification
│   │   └── mailService.ts     # Nodemailer email sending
│   ├── users.ts               # User query service
│   ├── course.ts              # Course CRUD service
│   └── module.ts              # Module creation service
├── middlewares/
│   ├── VerifyUser.ts          # JWT auth middleware; populates req.user
│   └── morganMiddleware.ts    # HTTP request logging via Morgan + Winston
├── validations/
│   ├── dtos/
│   │   ├── auth.ts            # Joi schemas for user registration/login
│   │   └── course.ts          # Joi schemas for course operations
│   └── errors/
│       └── CourseError.ts     # Custom Error class for course errors
├── interfaces/                # TypeScript interfaces
│   ├── IUserRegisterPayload.ts
│   ├── LoginPayload.ts
│   ├── ICourse.ts
│   └── IModule.ts
├── utils/
│   ├── logger.ts              # Winston logger (file + console)
│   ├── httpStatus.ts          # HTTP status code constants (UPPER_SNAKE_CASE)
│   ├── bcryptor.ts            # hash() and compare() wrappers around bcryptjs
│   ├── cloudinaryUploader.ts  # Cloudinary upload helper
│   ├── formDataHandler.ts     # Multer configuration for file uploads
│   ├── modules/index.ts       # Content-type detection helpers
│   └── errors/
│       └── ApiBaseErrorResponse.ts  # Standard error response structure
├── error-handlers/
│   └── joi-handler.ts         # Extracts first Joi validation error message
└── types/
    ├── express/index.d.ts     # Extends Express Request with `user` field
    └── FileType.ts            # File type definitions
```

---

## API Endpoints

### User Routes (`/`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Health check / welcome |
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login and receive JWT |
| POST | `/verify-email` | No | Verify email with OTP |
| GET | `/users` | Yes | Get all users |
| POST | `/forgot-password` | No | Initiate password reset (sends OTP) |
| POST | `/forgot-password/confirm-otp` | No | Confirm OTP, receive session token |
| POST | `/forgot-password/reset-password` | No | Reset password with session token |

### Course Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/courses` | Yes | Create a course |
| PUT | `/courses/:id` | Yes | Update a course |
| DELETE | `/courses/:id` | Yes | Delete a single course |
| DELETE | `/courses` | Yes | Delete multiple courses |

### Module Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/modules/:courseId` | Yes | Create a module (supports file upload) |

---

## Authentication

JWT tokens are extracted from (in order):
1. `Authorization: Bearer <token>` header
2. `token` query parameter
3. `token` in the request body

The `VerifyUser` middleware populates `req.user` with decoded token payload. All protected routes require a valid JWT.

---

## Environment Variables

Copy `.env.example` to `.env` and populate:

```env
MONGO_URI=mongodb://localhost:27017/e-learning
PORT=5667
JWT_TOKEN_KEY=<strong-secret>

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=<email>
EMAIL_PASS=<app-password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

NODE_ENV=development
```

**Never commit `.env` — it is in `.gitignore`.**

---

## Development Workflow

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with real values
```

### Run (Development)

```bash
npm run start:dev
```

Uses `nodemon` to watch `src/` and restart on `.ts`/`.js` changes. Executes via `ts-node`.

### Build

```bash
npx tsc
```

Compiles TypeScript to `build/` directory (excluded from git).

### Testing

No test framework is currently configured. When adding tests, prefer **Jest** with `ts-jest` for TypeScript compatibility.

---

## Code Conventions

### Naming
- **PascalCase** for classes, interfaces, and type names
- **camelCase** for variables, functions, and method names
- **UPPER_SNAKE_CASE** for HTTP status constants (see `src/utils/httpStatus.ts`)
- Interface names are prefixed with `I` (e.g., `ICourse`, `IModule`)
- DTO validation schemas live in `src/validations/dtos/`

### Architecture Layers
Follow the existing layered pattern:
1. **Route** — parse request, validate with Joi, call service
2. **Service** — business logic, calls DB models
3. **Model** — Mongoose schema only, no business logic

Do not skip layers. Routes should not directly query Mongoose. Services should not handle HTTP responses.

### Validation
- Use **Joi** schemas for all incoming data
- Schemas live in `src/validations/dtos/`
- Use `joi-handler.ts` to extract error messages consistently
- Validate at the route level before calling services

### Error Handling
- Use `CourseError` (extends `Error`) for course-related errors
- Use `ApiBaseErrorResponse` for consistent API error response shape
- Always return structured JSON error responses — never raw Error objects

### Logging
- Use the Winston logger from `src/utils/logger.ts` — never use `console.log`
- Log levels: `error` > `warn` > `info` > `http` > `debug`
- Development logs at `debug` level; production at `warn` level
- Log files: `logs/error.log` and `logs/info.log` (excluded from git)

### TypeScript
- Strict mode is enabled — no implicit `any`
- Extend Express types in `src/types/express/index.d.ts`
- Use interfaces from `src/interfaces/` for shared data shapes
- `tsconfig.json` compiles `src/` → `build/` with CommonJS modules targeting ES5

---

## Database Models — Quick Reference

| Model | Key Fields | Notes |
|---|---|---|
| `User` | `email` (unique), `password`, `userType`, `hasVerifiedEmail` | userType: `'learner'` or `'creator'` |
| `Course` | `title`, `owner`, `description` | owner is user ID |
| `Module` | `name`, `type`, `content`, `courseId`, `contentType` | content is Cloudinary URL or text |
| `OTP` | `email`, `otp` | Auto-expires after 5 minutes |
| `OtpSession` | `email`, `token` | Auto-expires after 5 minutes |

---

## File Uploads

- **Multer** handles `multipart/form-data` in `src/utils/formDataHandler.ts`
- Files are uploaded to **Cloudinary** via `src/utils/cloudinaryUploader.ts`
- Requires `CLOUDINARY_*` environment variables
- Local `uploads/` directory is in `.gitignore`

---

## Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds)
- OTPs and session tokens expire automatically (MongoDB TTL index, 5 min)
- Use a strong, random value for `JWT_TOKEN_KEY` in production
- No rate limiting is currently implemented — add it before production deployment
- No HTTPS enforcement — add TLS termination at the infrastructure/reverse-proxy level

---

## What's Missing / Future Work

- No test suite — add Jest + ts-jest
- No ESLint or Prettier configuration
- No rate limiting (consider `express-rate-limit`)
- No CI/CD pipeline
- No API documentation (consider Swagger/OpenAPI)
- No pagination on list endpoints
