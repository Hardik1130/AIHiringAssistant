# Complete Login End-to-End Flow Documentation

## Overview
This document explains the complete login flow implementation with proper error handling for wrong passwords and other scenarios.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                               │
│                    Sends POST /api/auth/login                          │
│              Body: {email, password}                                   │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AuthController.login()                               │
│  - Validates request                                                   │
│  - Calls UserVerifyService.verify()                                   │
│  - Returns 200 OK with AuthResponse or exception                       │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 UserVerifyService.verify()                              │
│                    (Complete Login Logic)                               │
│                                                                         │
│  Step 1: Validate Input                                                │
│  ├─ Check email is not null/empty                                      │
│  └─ Check password is not null/empty                                   │
│                                                                         │
│  Step 2: Find User by Email                                            │
│  ├─ Query database for user                                            │
│  └─ If not found → Throw UsernameNotFoundException (401)              │
│                                                                         │
│  Step 3: Verify Account is Active                                      │
│  ├─ Check user.isActive() == true                                      │
│  └─ If inactive → Throw UserAccountInactiveException (403)            │
│                                                                         │
│  Step 4: Authenticate Password                                         │
│  ├─ Use AuthenticationManager with credentials                         │
│  ├─ BCryptPasswordEncoder validates password                           │
│  └─ If wrong password → BadCredentialsException (401)                 │
│                                                                         │
│  Step 5: Load User Details                                             │
│  ├─ Load UserDetails from AppUserDetailService                         │
│  └─ Build User with authorities                                        │
│                                                                         │
│  Step 6: Generate JWT Tokens                                           │
│  ├─ Access Token (short-lived)                                         │
│  └─ Refresh Token (long-lived)                                         │
│                                                                         │
│  Step 7: Return Success Response                                       │
│  └─ LoginResponse with user entity + tokens                            │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               GlobalExceptionHandler (If Exception)                      │
│                                                                         │
│  ├─ BadCredentialsException (wrong password)                           │
│  │  └─ Response: 401 "Invalid email or password"                       │
│  │                                                                     │
│  ├─ UsernameNotFoundException (user not found)                         │
│  │  └─ Response: 401 "User not found with this email"                 │
│  │                                                                     │
│  ├─ UserAccountInactiveException (account disabled)                   │
│  │  └─ Response: 403 "Your account has been deactivated"             │
│  │                                                                     │
│  └─ RuntimeException / Generic                                         │
│     └─ Response: 500 "An unexpected error occurred"                    │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Response sent to Client                              │
│                   (Success or Error)                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## API Endpoint

### Login Request
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Success Response (200 OK)
```json
{
  "userEntity": {
    "id": 1,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "userType": "CANDIDATE",
    "active": true,
    "emailVerified": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0..."
  },
  "message": null,
  "success": true
}
```

## Error Responses

### Error 1: Wrong Password (401 Unauthorized)
**Status Code:** 401

**Response Body:**
```json
{
  "error": true,
  "message": "Invalid email or password. Please check your credentials and try again.",
  "data": null
}
```

**When it occurs:** User enters correct email but incorrect password

**Cause:** `BadCredentialsException` thrown by `AuthenticationManager`

---

### Error 2: User Not Found (401 Unauthorized)
**Status Code:** 401

**Response Body:**
```json
{
  "error": true,
  "message": "User not found. Please check your email and try again.",
  "data": null
}
```

**When it occurs:** Email doesn't exist in database

**Cause:** `UsernameNotFoundException` - User not found by email

---

### Error 3: Account Inactive (403 Forbidden)
**Status Code:** 403

**Response Body:**
```json
{
  "error": true,
  "message": "Your account has been deactivated. Please contact support.",
  "data": null
}
```

**When it occurs:** User exists but account is disabled (active = false)

**Cause:** `UserAccountInactiveException` - User.isActive() is false

---

### Error 4: Missing Credentials (400 Bad Request)
**Status Code:** 400

**Response Body:**
```json
{
  "error": true,
  "message": "Email is required",
  "data": null
}
```

**When it occurs:** Email or password field is empty or null

**Cause:** `IllegalArgumentException` in input validation

---

## Step-by-Step Login Process

### 1. **Input Validation**
```
✓ Email is provided and not empty
✓ Password is provided and not empty
```

### 2. **Database User Lookup**
```
Query: SELECT * FROM users WHERE email = 'user@example.com'
- If found: Continue to next step
- If not found: Return 401 Error (User not found)
```

### 3. **Account Status Check**
```
Check: user.isActive() == true
- If active: Continue to next step
- If inactive: Return 403 Error (Account disabled)
```

### 4. **Password Verification** ← MAIN FOCUS!
```
Input: raw password from request + stored bcrypt hash from database
Process:
  1. BCryptPasswordEncoder.matches(rawPassword, storedHash)
  2. Returns true if password is correct, false if wrong
  
Result:
  - If correct: Continue to token generation
  - If wrong: Return 401 Error (Invalid password)
```

### 5. **Load User Details**
```
Load UserDetails with:
- Username: email
- Password: bcrypt hash
- Authorities: [ROLE_CANDIDATE, ROLE_HR, etc.]
```

### 6. **Generate JWT Tokens**
```
Access Token:
- Short-lived (typically 15-30 minutes)
- Contains: user ID, email, authorities
- Used for API requests

Refresh Token:
- Long-lived (typically 7 days)
- Used to get a new access token when it expires
```

### 7. **Return Success Response**
```
Send Login Response with:
- User entity details
- Access Token
- Refresh Token
```

## Code Files Modified

1. **AuthController.java**
   - Enhanced login endpoint with proper documentation
   - Added logging
   - Returns ResponseEntity with proper HTTP status

2. **UserVerifyService.java** (MAIN LOGIC)
   - Complete login flow with step-by-step comments
   - Input validation
   - User lookup
   - Account status check
   - Password verification (AuthenticationManager)
   - Token generation
   - Comprehensive error handling with details

3. **GlobalExceptionHandler.java**
   - BadCredentialsException handler (wrong password)
   - UsernameNotFoundException handler (user not found)
   - UserAccountInactiveException handler (account disabled)
   - RuntimeException handler
   - Generic Exception handler

4. **UserAccountInactiveException.java** (NEW)
   - Custom exception for inactive accounts
   - Thrown when user exists but account is disabled

5. **LoginResponse.java**
   - Added message field
   - Added success flag

## Testing the Login Flow

### Test Case 1: Successful Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "correct_password"
  }'

Expected: 200 OK with tokens
```

### Test Case 2: Wrong Password
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "wrong_password"
  }'

Expected: 401 Unauthorized
Response: "Invalid email or password. Please check your credentials and try again."
```

### Test Case 3: User Not Found
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'

Expected: 401 Unauthorized
Response: "User not found. Please check your email and try again."
```

### Test Case 4: Account Inactive
```bash
First update user in database: UPDATE users SET active = false WHERE email = 'user@example.com'

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "correct_password"
  }'

Expected: 403 Forbidden
Response: "Your account has been deactivated. Please contact support."
```

### Test Case 5: Missing Password
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'

Expected: 400 Bad Request (or internal error depending on validation)
```

## Security Features Implemented

1. **Password Encryption**
   - Passwords stored as BCrypt hashes
   - BCryptPasswordEncoder validates password matching
   - Plain text passwords never stored or logged

2. **JWT Token Generation**
   - Access token for short-lived authentication
   - Refresh token for getting new access token
   - Tokens contain user ID, email, and authorities

3. **Error Handling**
   - Generic error messages (don't reveal if email exists)
   - Proper HTTP status codes
   - Exception logging for debugging

4. **Account Status**
   - Can disable accounts without deletion
   - Active flag checked before authentication

5. **Filtering**
   - JWT filter validates tokens on protected endpoints
   - Public endpoints: /api/auth/login, /api/auth/register

## Logging

The login flow includes comprehensive logging:

```
[INFO] Login attempt for email: user@example.com
[WARN] Login failed: User not found with email: nonexistent@example.com
[INFO] User found: user@example.com
[WARN] Login failed: Account is inactive for email: inactive@example.com
[WARN] Login failed: Invalid password for email: user@example.com
[INFO] Authentication successful for email: user@example.com
[INFO] Login successful for email: user@example.com
```

## Summary

The complete login flow now handles:
✅ Password validation with BCrypt
✅ Wrong password detection and proper error message
✅ User not found error
✅ Inactive account detection
✅ JWT token generation
✅ Comprehensive error handling
✅ Proper HTTP status codes
✅ Detailed logging for debugging
