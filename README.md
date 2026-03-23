# E-Learning App

A RESTful API backend for an e-learning platform built with Node.js and TypeScript. It supports user authentication, course management, and module/content delivery — enabling both **learners** to access courses and **creators** to publish them.

---

## Features

- **User Authentication** — Register, login, email verification via OTP, and password reset flow
- **Role-Based Users** — Two user types: `learner` and `creator`
- **Course Management** — Create, update, and delete courses (single or bulk)
- **Module Management** — Attach content modules to courses; supports file uploads (video, audio, images, documents) and plain text
- **File Storage** — Media files are uploaded to Cloudinary
- **Email Notifications** — OTP emails sent via Nodemailer (e.g. Gmail)
- **Structured Logging** — HTTP request logging and application logs via Winston + Morgan

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js + TypeScript 5 |
| Framework | Express.js 4 |
| Database | MongoDB (Mongoose 7) |
| Authentication | JWT + bcryptjs |
| Validation | Joi |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer |
| Logging | Winston + Morgan |

---

## Prerequisites

- **Node.js** v16 or higher
- **MongoDB** running locally or a connection URI (e.g. MongoDB Atlas)
- **Cloudinary** account (for file upload support)
- **Gmail** account or any SMTP service (for OTP emails)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-learning-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/e-learning

# Server port (default: 5667)
PORT=5667

# JWT secret — use a long, random string in production
JWT_TOKEN_KEY=your-secret-key-here

# Email configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Environment
NODE_ENV=development
```

> **Gmail users:** Generate an [App Password](https://support.google.com/accounts/answer/185833) and use it as `EMAIL_PASS` — your regular password will not work.

### 4. Start the development server

```bash
npm run start:dev
```

The server starts at `http://localhost:5667` with hot-reload via nodemon.

---

## API Reference

Base URL: `http://localhost:5667`

### Authentication

Protected routes require a JWT token passed in one of these ways:
- `Authorization: Bearer <token>` header
- `token` query parameter
- `token` in the request body

---

### User & Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Health check |
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive a JWT |
| POST | `/verify-email` | No | Verify email address using OTP |
| GET | `/users` | Yes | List all users |
| POST | `/forgot-password` | No | Send OTP to email for password reset |
| POST | `/forgot-password/confirm-otp` | No | Confirm OTP and receive a session token |
| POST | `/forgot-password/reset-password` | No | Reset password using session token |

#### Register — `POST /register`

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "userType": "learner"
}
```

`userType` must be `"learner"` or `"creator"`.

After registration, an OTP is sent to the provided email. Verify it at `/verify-email` before logging in.

#### Login — `POST /login`

```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

Returns a JWT token and basic user info.

#### Verify Email — `POST /verify-email`

```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

#### Forgot Password Flow

1. `POST /forgot-password` with `{ "email": "..." }` — sends OTP to email
2. `POST /forgot-password/confirm-otp` with `{ "email": "...", "otp": "..." }` — returns a `sessionToken`
3. `POST /forgot-password/reset-password` with `{ "sessionToken": "...", "password": "newpassword" }` — resets password

---

### Course Routes

All course routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/courses` | Create a new course |
| PUT | `/courses/:id` | Update a course (title and/or description) |
| DELETE | `/courses/:id` | Delete a single course |
| DELETE | `/courses?courses=id1,id2` | Delete multiple courses by IDs |

#### Create Course — `POST /courses`

```json
{
  "title": "Introduction to TypeScript",
  "description": "A beginner-friendly course covering TypeScript fundamentals."
}
```

---

### Module Routes

Modules are content units attached to a course. Supports both file uploads and plain text.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/modules/:courseId` | Yes | Add a module to a course |

#### Create Module — `POST /modules/:courseId`

Send as `multipart/form-data`:

| Field | Type | Description |
|---|---|---|
| `name` | string | Module name |
| `type` | string | Content type: `video`, `audio`, `image`, `document`, or `text` |
| `content` | file or string | File upload for media types; plain text for `text` type |

Files are uploaded to Cloudinary and the returned URL is stored as the module content.

---

## Project Structure

```
src/
├── index.ts              # Entry point: middleware, routes, DB connection
├── db/                   # Mongoose models
│   ├── connect.ts
│   ├── User.ts
│   ├── Course.ts
│   ├── Module.ts
│   ├── OTP.ts
│   └── OtpSession.ts
├── routes/               # Route handlers
│   ├── user.ts
│   ├── course.ts
│   └── module.ts
├── services/             # Business logic
│   ├── auth/
│   ├── users.ts
│   ├── course.ts
│   └── module.ts
├── middlewares/          # JWT auth, HTTP logging
├── validations/          # Joi schemas and custom errors
├── interfaces/           # TypeScript interfaces
└── utils/                # Logger, bcrypt, Cloudinary, Multer helpers
```

---

## Build

Compile TypeScript to JavaScript:

```bash
npx tsc
```

Output is written to the `build/` directory.

---

## Security Considerations

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- OTPs and session tokens auto-expire after **5 minutes** (MongoDB TTL index)
- Use a strong, randomly-generated value for `JWT_TOKEN_KEY` in production
- No rate limiting is currently implemented — consider adding `express-rate-limit` before deploying to production
- No HTTPS enforcement in-app — terminate TLS at your reverse proxy (nginx, Caddy, etc.)

---

## Known Limitations / Roadmap

- [ ] No test suite — planned: Jest + ts-jest
- [ ] No ESLint/Prettier configuration
- [ ] No rate limiting
- [ ] No CI/CD pipeline
- [ ] No API documentation (consider Swagger/OpenAPI)
- [ ] No pagination on list endpoints
- [ ] `GET /users` returns all users — should be admin-only or paginated

---

## License

ISC
