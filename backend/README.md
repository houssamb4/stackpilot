# StackPilot Backend

Backend API for StackPilot application built with Express.js and TypeScript.

## Structure

```
src/
├── app.ts                      # Express app setup
├── server.ts                   # Server entry point
├── config/                     # Configuration files
│   ├── env.ts                 # Environment variables
│   └── logger.ts              # Logger utility
├── routes/                     # Route definitions
│   ├── index.ts               # Main router
│   ├── auth.routes.ts         # Authentication routes
│   └── user.routes.ts         # User routes
├── controllers/                # Request handlers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── services/                   # Business logic
│   ├── auth.service.ts
│   └── user.service.ts
├── middlewares/                # Custom middlewares
│   ├── auth.middleware.ts     # JWT authentication
│   ├── error.middleware.ts    # Error handling
│   └── validate.middleware.ts # Request validation
├── repositories/               # Data access layer
│   └── user.repository.ts
├── utils/                      # Utility functions
│   ├── jwt.ts                 # JWT utilities
│   └── password.ts            # Password hashing
├── types/                      # Type definitions
│   └── express.d.ts           # Express type augmentation
└── health/                     # Health check
    └── health.controller.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the backend directory (already included) and configure:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development

The project uses:
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin support

## Notes

- The user repository currently uses in-memory storage. Replace with a proper database (PostgreSQL, MongoDB, etc.) for production use.
- Update the `JWT_SECRET` in production to a strong, random value.
- Consider adding request validation middleware for all routes.
- Add comprehensive error handling and logging for production.
