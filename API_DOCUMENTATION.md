# PrimeTask API Documentation

## Base URL

```
http://localhost:5001/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the Register or Login endpoints and expire after 30 days.

---

## Auth Endpoints

### POST /api/auth/register

Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `name` — required, non-empty string
- `email` — required, valid email format
- `password` — required, minimum 6 characters

**Success Response (201):**
```json
{
  "_id": "60d5ecb74e4d2b001f9a1234",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` — Missing required fields or user already exists

---

### POST /api/auth/login

Authenticate an existing user.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `email` — required, valid email format
- `password` — required

**Success Response (200):**
```json
{
  "_id": "60d5ecb74e4d2b001f9a1234",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` — Invalid credentials

---

### GET /api/auth/me

Get current authenticated user's profile.

**Access:** Private (requires JWT)

**Success Response (200):**
```json
{
  "id": "60d5ecb74e4d2b001f9a1234",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `401` — Not authorized / no token

---

### PUT /api/auth/profile

Update the authenticated user's profile.

**Access:** Private (requires JWT)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Validation:**
- `name` — optional, non-empty string
- `email` — optional, valid email format

**Success Response (200):**
```json
{
  "_id": "60d5ecb74e4d2b001f9a1234",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Error Responses:**
- `400` — Email already in use
- `404` — User not found

---

## Task Endpoints

### GET /api/tasks

Get all tasks for the authenticated user.

**Access:** Private (requires JWT)

**Query Parameters:**
| Parameter | Type   | Description                              |
|-----------|--------|------------------------------------------|
| `search`  | string | Filter tasks by title (case-insensitive regex) |
| `status`  | string | Filter by status: `pending`, `in-progress`, `completed` |

**Example:**
```
GET /api/tasks?search=meeting&status=pending
```

**Success Response (200):**
```json
[
  {
    "_id": "60d5ecb74e4d2b001f9a5678",
    "user": "60d5ecb74e4d2b001f9a1234",
    "title": "Team meeting prep",
    "description": "Prepare slides for Monday meeting",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### POST /api/tasks

Create a new task.

**Access:** Private (requires JWT)

**Request Body:**
```json
{
  "title": "Complete project report",
  "description": "Write the Q4 quarterly report",
  "status": "pending"
}
```

**Validation:**
- `title` — required, non-empty string
- `description` — optional string
- `status` — optional, one of: `pending`, `in-progress`, `completed` (defaults to `pending`)

**Success Response (201):**
```json
{
  "_id": "60d5ecb74e4d2b001f9a5678",
  "user": "60d5ecb74e4d2b001f9a1234",
  "title": "Complete project report",
  "description": "Write the Q4 quarterly report",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` — Title is required

---

### PUT /api/tasks/:id

Update an existing task.

**Access:** Private (requires JWT, must own the task)

**URL Parameters:**
- `id` — Task ID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

**Validation:**
- `title` — optional, non-empty string
- Only `title`, `description`, and `status` fields are accepted (mass assignment protected)

**Success Response (200):**
```json
{
  "_id": "60d5ecb74e4d2b001f9a5678",
  "user": "60d5ecb74e4d2b001f9a1234",
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
- `401` — Not authorized (not the task owner)
- `404` — Task not found

---

### DELETE /api/tasks/:id

Delete a task.

**Access:** Private (requires JWT, must own the task)

**URL Parameters:**
- `id` — Task ID

**Success Response (200):**
```json
{
  "id": "60d5ecb74e4d2b001f9a5678"
}
```

**Error Responses:**
- `401` — Not authorized (not the task owner)
- `404` — Task not found

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Rate Limiting

The API enforces rate limiting of **100 requests per 15-minute window** per IP address.

## Security Features

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Authentication:** Token-based auth with 30-day expiry
- **Helmet:** HTTP security headers
- **CORS:** Cross-origin resource sharing configured
- **Input Validation:** express-validator on all endpoints
- **Mass Assignment Protection:** Only whitelisted fields accepted on updates
