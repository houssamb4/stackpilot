# StackPilot Security Features

## 🔒 Authentication & Authorization

### SQL Injection Prevention
- **Parameterized Queries**: All database queries use prepared statements via `mysql2`
- **Example**: `query('SELECT * FROM users WHERE email = ?', [email])`
- **Protection**: User input is never concatenated directly into SQL strings
- **Validation**: Input sanitization and validation on all endpoints

### Rate Limiting
- **Login Protection**: Maximum 5 failed attempts per IP address
- **Time Window**: 15-minute rolling window for attempt tracking
- **Block Duration**: 30-minute automatic block after max attempts exceeded
- **Auto-Cleanup**: Old entries automatically removed every 10 minutes
- **IP Tracking**: Uses `X-Forwarded-For` header for accurate IP detection

### Password Security
- **Hashing**: bcrypt algorithm with salt rounds
- **Minimum Length**: 8 characters required
- **Storage**: Only hashed passwords stored in database
- **Comparison**: Secure timing-safe comparison functions

### JWT Token Security
- **HS256 Algorithm**: Industry-standard HMAC-SHA256
- **Expiration**: Configurable token expiration time
- **Payload**: Contains only user ID, email, and role
- **Verification**: Every protected route validates token signature

## 🛡️ Security Best Practices Implemented

### Input Validation
1. **Email Format**: Regex validation for proper email structure
2. **Password Length**: Minimum 8 characters enforced
3. **Required Fields**: Server-side validation of all required fields
4. **Type Checking**: TypeScript ensures type safety

### User Enumeration Prevention
- **Generic Error Messages**: Login failures return same message regardless of whether email exists
- **Consistent Response Times**: No timing differences between valid/invalid emails
- **Logging**: Security events logged server-side without exposing details to client

### Account Security
- **Account Activation**: New accounts require admin approval (is_active flag)
- **Role-Based Access**: super_admin, admin, and user roles with different permissions
- **Audit Trail**: All authentication events logged with timestamps and IP addresses

### HTTP Security Headers
- **CORS**: Cross-Origin Resource Sharing properly configured
- **Content-Type**: JSON responses with proper content-type headers
- **Error Handling**: Detailed errors logged server-side, generic messages to client

## 📊 Rate Limiting Configuration

```typescript
MAX_ATTEMPTS = 5        // Failed attempts before block
WINDOW_MS = 15 minutes  // Time window for counting attempts
BLOCK_DURATION = 30 min // How long IP is blocked
```

### Rate Limit Behavior

**Scenario 1: Failed Attempts**
- Attempt 1-4: User notified of invalid credentials
- Attempt 5: User notified of invalid credentials
- Attempt 6+: IP blocked with remaining time message

**Scenario 2: Successful Login**
- Rate limit counter immediately cleared
- IP can attempt login again without restrictions

**Scenario 3: Time Expiration**
- After 15 minutes, attempt counter resets
- After block expires, IP can try again

## 🔍 Monitoring & Logging

### Security Events Logged
- Failed login attempts (email + IP address)
- Successful logins (email + IP address)
- Rate limit blocks (IP address + duration)
- Rate limit clears (IP address)
- Database connection issues
- Authentication errors

### Log Format
```
[TIMESTAMP] [LEVEL] Message
Example: [2026-01-27T18:00:00.000Z] [WARN] Failed login attempt from IP: 192.168.1.100 - 4 attempts remaining
```

## 🚀 Production Recommendations

### Current Implementation (Development)
- In-memory rate limit storage (Map)
- Simple IP-based tracking
- Basic logging to console/file

### Production Upgrades (Recommended)
1. **Redis for Rate Limiting**: Distributed storage for multi-server deployments
2. **Database Logging**: Store security events in dedicated audit table
3. **IP Whitelist**: Allow-list for trusted IPs (admin networks)
4. **2FA/MFA**: Two-factor authentication for admin accounts
5. **HTTPS Only**: Enforce SSL/TLS in production
6. **Helmet.js**: Additional HTTP security headers
7. **CAPTCHA**: Add reCAPTCHA after multiple failed attempts
8. **Session Management**: Implement session invalidation
9. **Password Policy**: Enforce complexity requirements
10. **Regular Security Audits**: Periodic vulnerability scanning

## 📝 API Endpoints Protected

### Public Endpoints (No Auth)
- `POST /api/auth/login` - Rate limited (5 attempts/15min)
- `POST /api/auth/register` - Input validated

### Protected Endpoints (JWT Required)
- `GET /api/stats/server`
- `GET /api/services/*`
- `GET /api/metrics/*`
- All dashboard routes

### Admin Only Endpoints
- User management routes
- Service configuration routes

## ⚠️ Security Notes

1. **SQL Injection**: ✅ PROTECTED - All queries use parameterized statements
2. **Rate Limiting**: ✅ IMPLEMENTED - 5 attempts per 15 minutes, 30-minute block
3. **Password Storage**: ✅ SECURE - bcrypt hashing with salt
4. **XSS Protection**: ✅ React auto-escapes output
5. **CSRF**: ⚠️ Use HTTPS and SameSite cookies in production
6. **Brute Force**: ✅ PROTECTED - Rate limiting prevents brute force attacks
7. **User Enumeration**: ✅ PREVENTED - Generic error messages
8. **JWT Security**: ✅ SECURE - Signed tokens with expiration

## 🔧 Environment Variables

```env
JWT_SECRET=your-secret-key-here      # Must be strong in production
JWT_EXPIRES_IN=24h                   # Token expiration time
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=secure-password    # Never commit real passwords
DATABASE_NAME=stackpilot-db
```

**Important**: Never commit real credentials to version control!
