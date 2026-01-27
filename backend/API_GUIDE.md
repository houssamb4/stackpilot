# StackPilot Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Admin Endpoints](#admin-endpoints-super-admin-only)

---

## Health Check

### Check API Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T10:30:00.000Z",
  "uptime": 1234.56
}
```

---

## Authentication Endpoints

### 1. Register New User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (Success - 201):**
```json
{
  "message": "Registration successful. Please wait for admin approval to activate your account.",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "name": "John Doe",
    "role": "admin",
    "isActive": false
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "User with this email already exists"
}
```

**Note:** By default, new users are registered as `admin` role with `isActive: false`. They need Super Admin approval to login.

---

### 2. Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "name": "John Doe",
    "role": "admin",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 401):**
```json
{
  "message": "Your account is pending approval. Please wait for admin activation."
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid credentials"
}
```

---

## User Endpoints

### 3. Get Current User Profile
```http
GET /api/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "id": "uuid-here",
  "email": "admin@example.com",
  "name": "John Doe",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-01-27T10:00:00.000Z"
}
```

---

### 4. Update Current User Profile
```http
PUT /api/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

**Response (Success - 200):**
```json
{
  "id": "uuid-here",
  "email": "newemail@example.com",
  "name": "John Updated",
  "role": "admin",
  "isActive": true
}
```

---

## Admin Endpoints (Super Admin Only)

All admin endpoints require:
- Valid JWT token
- `super_admin` role

### 5. Get All Users
```http
GET /api/admin/users
```

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Response (Success - 200):**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "email": "admin1@example.com",
      "name": "Admin One",
      "role": "admin",
      "isActive": true,
      "activatedAt": "2026-01-27T09:00:00.000Z",
      "activatedBy": "super-admin-001",
      "createdAt": "2026-01-26T10:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "email": "admin2@example.com",
      "name": "Admin Two",
      "role": "admin",
      "isActive": false,
      "activatedAt": null,
      "activatedBy": null,
      "createdAt": "2026-01-27T08:00:00.000Z"
    }
  ]
}
```

---

### 6. Get Pending Users (Waiting for Activation)
```http
GET /api/admin/users/pending
```

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Response (Success - 200):**
```json
{
  "users": [
    {
      "id": "uuid-2",
      "email": "admin2@example.com",
      "name": "Admin Two",
      "role": "admin",
      "isActive": false,
      "activatedAt": null,
      "activatedBy": null,
      "createdAt": "2026-01-27T08:00:00.000Z"
    }
  ]
}
```

---

### 7. Activate User
```http
PUT /api/admin/users/:userId/activate
```

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**URL Parameters:**
- `userId` - The ID of the user to activate

**Example:**
```http
PUT /api/admin/users/uuid-2/activate
```

**Response (Success - 200):**
```json
{
  "message": "User activated successfully",
  "userId": "uuid-2"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

**Response (Error - 400):**
```json
{
  "message": "User is already active"
}
```

---

### 8. Deactivate User
```http
PUT /api/admin/users/:userId/deactivate
```

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**URL Parameters:**
- `userId` - The ID of the user to deactivate

**Example:**
```http
PUT /api/admin/users/uuid-1/deactivate
```

**Response (Success - 200):**
```json
{
  "message": "User deactivated successfully",
  "userId": "uuid-1"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email, password, and name are required"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Super admin privileges required."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## User Roles

| Role | Description |
|------|-------------|
| `super_admin` | Full access to all endpoints, can activate/deactivate users |
| `admin` | Regular admin user (requires activation by super admin) |
| `user` | Standard user (future use) |

---

## Default Super Admin Credentials

**Email:** `superadmin@stackpilot.com`  
**Password:** `Admin@123` *(Change after first login)*

**Important:** Update the password hash in the database schema after first login for security.

---

## Testing with cURL

### Register a new admin:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "SecurePass123!",
    "name": "New Admin"
  }'
```

### Login as super admin:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@stackpilot.com",
    "password": "Admin@123"
  }'
```

### Get pending users (replace TOKEN):
```bash
curl -X GET http://localhost:3000/api/admin/users/pending \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Activate a user (replace TOKEN and USER_ID):
```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/activate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

### 1. Create a New Collection
- Name: `StackPilot API`

### 2. Set Environment Variables
- `base_url`: `http://localhost:3000/api`
- `token`: (will be set after login)

### 3. Test Flow
1. **Health Check** → GET `{{base_url}}/health`
2. **Register** → POST `{{base_url}}/auth/register`
3. **Login as Super Admin** → POST `{{base_url}}/auth/login`
   - Save the token from response
4. **Get Pending Users** → GET `{{base_url}}/admin/users/pending`
   - Add header: `Authorization: Bearer {{token}}`
5. **Activate User** → PUT `{{base_url}}/admin/users/:userId/activate`
   - Add header: `Authorization: Bearer {{token}}`
6. **Login as Activated User** → POST `{{base_url}}/auth/login`

---

## Common Issues

### Issue: "Your account is pending approval"
**Solution:** Login with super admin and activate the user via `/api/admin/users/:userId/activate`

### Issue: "Access denied. Super admin privileges required"
**Solution:** Ensure you're using a token from a user with `super_admin` role

### Issue: Database connection failed
**Solution:** 
1. Check MySQL is running on port 3306
2. Verify credentials in `.env` file
3. Run the schema: `mysql -u root -p < database/schema.sql`

---

## Rate Limiting (Future Enhancement)
Consider adding rate limiting for:
- Login attempts: 5 per minute
- Registration: 3 per hour per IP
- API calls: 100 per minute per user

---

## Next Steps
1. Run the database schema
2. Install dependencies: `npm install`
3. Update super admin password
4. Start the server: `npm run dev`
5. Test endpoints with Postman or cURL
