# eGov Access API Documentation

## Base URL

```
https://egov-access.onrender.com
```

## Overview

eGov Access is an e-governance platform that provides APIs for user management, admin operations, and post management. The API follows REST conventions and returns JSON responses.

## Authentication

The API uses SHA-256 password hashing for authentication and email-based OTP verification. Tokens are generated using JWT (JSON Web Tokens).

### Authentication Flow:

1. **Registration**: User registers with email/password → Account created with `isVerified: false`
2. **OTP Email**: System sends 4-digit OTP to user's email (expires in 10 minutes)
3. **OTP Verification**: User verifies OTP → Account marked as verified + JWT token generated
4. **Welcome Email**: System sends welcome email after successful verification
5. **Login**: Verified users can login with email/password

### Email Configuration:

The system requires the following environment variables for email functionality:
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_PASS`: Gmail app password for authentication

## API Endpoints

### Authentication Endpoints

#### 1. User Registration

**Endpoint:** `POST /egov/auth/register`

**Description:** Register a new user account and send OTP verification email

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required, 3-30 characters)",
  "password": "string (required, 8-12 characters with uppercase, lowercase, number, and special character)",
  "confirmPassword": "string (required, must match password)",
  "phoneNumber": "string (required, 10-11 digits)",
  "gender": "string (enum: 'Male', 'Female', 'male', 'female')"
}
```

**Success Response (200):**

```json
{
  "message": "User registered successfully",
  "newUser": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "isVerified": false,
    "otp": "string (4 digits)",
    "otpExpiry": "timestamp",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: User already exists
- `403`: Password and confirmPassword do not match
- `500`: Server error

**Note:** After successful registration, an OTP is sent to the user's email address. The OTP expires in 10 minutes.

#### 2. OTP Verification

**Endpoint:** `POST /egov/auth/verifyOtp`

**Description:** Verify the OTP sent to user's email during registration

**Request Body:**

```json
{
  "email": "string (required)",
  "otp": "string (required, 4 digits)"
}
```

**Success Response (200):**

```json
{
  "message": "OTP verified successfully.",
  "accessToken": "string (JWT token)",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "isVerified": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: Invalid or expired OTP
- `404`: Invalid or expired OTP (user not found)
- `500`: Server error

**Note:** After successful OTP verification, the user account is marked as verified and a welcome email is sent.

#### 3. User Login

**Endpoint:** `POST /egov/auth/login`

**Description:** Authenticate and login a user

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required, 8-12 characters)"
}
```

**Success Response (200):**

```json
{
  "message": "Login Successful",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: Invalid credentials or validation error
- `500`: Server error

### User Management Endpoints

#### 4. Get All Users

**Endpoint:** `GET /egov/user/`

**Description:** Retrieve all registered users

**Success Response (200):**

```json
{
  "message": "users found succesfully",
  "allUsers": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "gender": "string",
      "profilePic": "string",
      "communities": [],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

**Error Responses:**

- `400`: No users found in database
- `500`: Server error

#### 5. Get Single User

**Endpoint:** `GET /egov/user/:id`

**Description:** Retrieve a specific user by ID

**Path Parameters:**

- `id` (string): User ID

**⚠️ Note:** The controller uses `req.params.userId` instead of `req.params.id`

**Success Response (200):**

```json
{
  "message": "user f  ound succesfully",
  "singleUser": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: No user found with such ID
- `500`: Server error

#### 6. User Registration (Alternative Route)

**Endpoint:** `POST /egov/user/register`

**Description:** Alternative user registration endpoint (same as /egov/auth/register)

#### 7. User Login (Alternative Route)

**Endpoint:** `POST /egov/user/login`

**Description:** Alternative user login endpoint (same as /egov/auth/login)

### Post Management Endpoints

#### 8. Create New Post

**Endpoint:** `POST /egov/post/newpost`

**Description:** Create a new post

**Request Body:**

```json
{
  "postedBy": "string (ObjectId, required)",
  "adminProfilePic": "string (optional)",
  "text": "string (max 3000 characters)",
  "img": ["string"] (array of image URLs),
  "likes": ["string"] (array of user ObjectIds),
  "comment": [
    {
      "userId": "string (ObjectId, required)",
      "adminId": "string (ObjectId, required)",
      "text": "string (required)",
      "userProfilePic": "string",
      "name": "string"
    }
  ],
  "replies": [
    {
      "userId": "string (ObjectId, required)",
      "adminId": "string (ObjectId, required)",
      "text": "string (required)",
      "userProfilePic": "string",
      "name": "string"
    }
  ],
  "createdAt": "string"
}
```

**Success Response (201):**

```json
{
  "message": "Post succesfully created",
  "_id": "string",
  "postedBy": "string",
  "text": "string",
  "img": ["string"],
  "likes": [],
  "views": 50,
  "comment": [],
  "replies": [],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Error Response (400):**

```json
{
  "message": "error creating post"
}
```

#### 9. Get All Posts

**Endpoint:** `GET /egov/post/`

**Description:** Retrieve all posts

**Success Response (200):**

```json
[
  {
    "_id": "string",
    "postedBy": "string",
    "adminProfilePic": "string",
    "text": "string",
    "img": ["string"],
    "likes": ["string"],
    "views": 50,
    "comment": [],
    "replies": [],
    "createdAt": "string"
  }
]
```

**Error Response (404):**

```json
{
  "message": "No post found"
}
```

#### 10. Get Single Post

**Endpoint:** `GET /egov/post/:id`

**Description:** Retrieve a specific post by ID

**Path Parameters:**

- `id` (string): Post ID

**Success Response (200):**

```json
{
  "_id": "string",
  "postedBy": "string",
  "adminProfilePic": "string",
  "text": "string",
  "img": ["string"],
  "likes": ["string"],
  "views": 50,
  "comment": [],
  "replies": [],
  "createdAt": "string"
}
```

**Error Response (404):**

```json
{
  "message": "Post not found"
}
```

#### 11. Update Post

**Endpoint:** `PATCH /egov/post/update/:id`

**Description:** Update a specific post

**Path Parameters:**

- `id` (string): Post ID

**Request Body:** Any field from the post schema that needs to be updated

**Success Response (200):**

```json
{
  "_id": "string",
  "postedBy": "string",
  "text": "string (updated)",
  "img": ["string"],
  "likes": ["string"],
  "views": 50,
  "comment": [],
  "replies": [],
  "createdAt": "string"
}
```

**Error Responses:**

- `404`: Post not found or Error updating post

#### 12. Delete Post

**Endpoint:** `DELETE /egov/post/delete/:id`

**Description:** Delete a specific post

**Path Parameters:**

- `id` (string): Post ID

**Success Response:** Post deleted (no response body)

**Error Response (404):**

```json
{
  "message": "Error deleting post"
}
```

### Admin Endpoints

#### 13. Admin Registration

**Endpoint:** `POST /egov/admin/register`

**Description:** Register a new admin account

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required, unique, 3-30 characters)",
  "password": "string (required, 8-12 characters with uppercase, lowercase, number, and special character)",
  "confirmPassword": "string (required, must match password)",
  "phoneNumber": "string (required, 10-11 digits, unique)",
  "occupation": "string (required)",
  "gender": "string (required, enum: 'Male', 'Female', 'male', 'female')"
}
```

**Success Response (200):**

```json
{
  "message": "Admin registered successfully",
  "newAdmin": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "occupation": "string",
    "gender": "string",
    "profilePic": "string",
    "bio": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: Admin already exists (by name, email, or phone number) or validation errors
- `403`: Password and confirmPassword do not match
- `500`: Server error

#### 14. Admin Login

**Endpoint:** `POST /egov/admin/login`

**Description:** Authenticate and login an admin

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "message": "Login Successful",
  "admin": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profilePic": "string",
    "bio": "string",
    "followers": [],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

- `400`: Invalid email or password incorrect
- `500`: Server error

#### 15. Admin - Get All Users

**Endpoint:** `GET /egov/admin/getUsers`

**Description:** Admin endpoint to retrieve all users

**Success Response (200):**

```json
{
  "message": "users found succesfully",
  "allUsers": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "gender": "string",
      "profilePic": "string",
      "communities": [],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### 16. Admin - Get Single User

**Endpoint:** `GET /egov/admin/:id`

**Description:** Admin endpoint to get a specific user

**Path Parameters:**

- `id` (string): User ID

**⚠️ Note:** The controller uses `req.params.userId` instead of `req.params.id`

**Success Response (200):**

```json
{
  "message": "user f  ound succesfully",
  "singleUser": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### 17. Admin - Delete All Users

**Endpoint:** `GET /egov/admin/delete`

**Description:** Delete all users (Admin only)

**Success Response (200):**

```json
{
  "message": "Users found successfully",
  "allUsers": {
    "deletedCount": "number"
  }
}
```

#### 18. Admin - Delete Single User

**Endpoint:** `GET /egov/admin/delete/:id`

**Description:** Delete a specific user (Admin only)

**Path Parameters:**

- `id` (string): User ID

**Success Response (200):**

```json
{
  "message": "user deleted successfully",
  "userToDelete": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

#### 19. Admin - Update User

**Endpoint:** `GET /egov/admin/update/:id`

**Description:** Update a specific user (Admin only)

**Path Parameters:**

- `id` (string): User ID

**Request Body:** Any field from the user schema that needs to be updated

**Success Response (200):**

```json
{
  "message": "User updated successfully",
  "updatedUser": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "gender": "string",
    "profilePic": "string",
    "communities": [],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Response (404):**

```json
{
  "message": "User with id: {userId} not found"
}
```

#### 20. Admin - Create New Post

**Endpoint:** `POST /egov/admin/newpost`

**Description:** Admin endpoint to create posts (same functionality as regular post creation)

#### 21. Admin - Create Comment

**Endpoint:** `POST /egov/admin/newcomment`

**Description:** Create a new comment

**Request Body:**

```json
{
  "text": "string (required)",
  "name": "string"
}
```

**Success Response (201):**

```json
{
  "_id": "string",
  "comment": [
    {
      "text": "string",
      "name": "string",
      "_id": "string"
    }
  ]
}
```

#### 22. Admin - Get All Posts

**Endpoint:** `GET /egov/admin/`

**Description:** Admin endpoint to get all posts with populated user data

**Success Response (200):**

```json
[
  {
    "_id": "string",
    "postedBy": {
      "name": "string"
    },
    "text": "string",
    "img": ["string"],
    "likes": ["string"],
    "views": 50,
    "comment": [],
    "replies": [],
    "createdAt": "string"
  }
]
```

#### 23. Admin - Get Single Post

**Endpoint:** `GET /egov/admin/:id`

**Description:** Admin endpoint to get a specific post

**⚠️ Warning:** This endpoint conflicts with "Admin - Get Single User" as they use the same route pattern. The actual behavior depends on route order in the code.

**Path Parameters:**

- `id` (string): Post ID

**Success Response (200):**

```json
{
  "_id": "string",
  "postedBy": "string",
  "adminProfilePic": "string",
  "text": "string",
  "img": ["string"],
  "likes": ["string"],
  "views": 50,
  "comment": [],
  "replies": [],
  "createdAt": "string"
}
```

**Error Response (404):**

```json
{
  "message": "Post not found"
}
```

#### 24. Admin - Update Post

**Endpoint:** `PATCH /egov/admin/update/:id`

**Description:** Admin endpoint to update posts

#### 25. Admin - Delete Post

**Endpoint:** `DELETE /egov/admin/delete/:id`

**Description:** Admin endpoint to delete a specific post

#### 26. Admin - Delete All Posts

**Endpoint:** `DELETE /egov/admin/deleteAllPosts`

**Description:** Delete all posts (Admin only)

**Success Response (200):**

```json
{
  "message": "Post found successfully",
  "allPosts": {
    "deletedCount": "number"
  }
}
```

### Post Interaction Endpoints

#### 27. Like/Unlike Post

**Endpoint:** `POST /egov/admin/posts/:id/like`

**Description:** Like or unlike a post (toggles like status)

**Path Parameters:**

- `id` (string): Post ID

**Request Body:**

```json
{
  "userId": "string (ObjectId, required if no auth user)"
}
```

**Success Response (200):**

```json
{
  "message": "Post liked",
  "likes": "number (total likes count)"
}
```

**Or for unlike:**

```json
{
  "message": "Post unliked",
  "likes": "number (total likes count)"
}
```

**Error Responses:**

- `401`: User ID required
- `404`: Post not found
- `500`: Server error

#### 28. Add Comment to Post

**Endpoint:** `POST /egov/admin/posts/:id/comments`

**Description:** Add a comment to a specific post

**Path Parameters:**

- `id` (string): Post ID

**Request Body:**

```json
{
  "text": "string (required)",
  "name": "string (required)",
  "userId": "string (ObjectId, optional)",
  "adminId": "string (ObjectId, optional)",
  "userProfilePic": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Comment added successfully",
  "comment": {
    "userId": "string",
    "adminId": "string",
    "text": "string",
    "name": "string",
    "userProfilePic": "string"
  },
  "totalComments": "number"
}
```

**Error Responses:**

- `400`: Text and name are required
- `404`: Post not found
- `500`: Server error

#### 29. Get Post Comments

**Endpoint:** `GET /egov/admin/posts/:id/comments`

**Description:** Retrieve all comments for a specific post

**Path Parameters:**

- `id` (string): Post ID

**Success Response (200):**

```json
{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "userId": {
        "name": "string",
        "profilePic": "string"
      },
      "adminId": {
        "name": "string",
        "profilePic": "string"
      },
      "text": "string",
      "name": "string",
      "userProfilePic": "string",
      "_id": "string"
    }
  ],
  "totalComments": "number"
}
```

**Error Responses:**

- `404`: Post not found
- `500`: Server error

#### 30. Add Reply to Post

**Endpoint:** `POST /egov/admin/posts/:id/replies`

**Description:** Add a reply to a specific post

**Path Parameters:**

- `id` (string): Post ID

**Request Body:**

```json
{
  "text": "string (required)",
  "name": "string (required)",
  "userId": "string (ObjectId, optional)",
  "adminId": "string (ObjectId, optional)",
  "userProfilePic": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Reply added successfully",
  "reply": {
    "userId": "string",
    "adminId": "string",
    "text": "string",
    "name": "string",
    "userProfilePic": "string"
  },
  "totalReplies": "number"
}
```

**Error Responses:**

- `400`: Text and name are required
- `404`: Post not found
- `500`: Server error

#### 31. Get Post Replies

**Endpoint:** `GET /egov/admin/posts/:id/replies`

**Description:** Retrieve all replies for a specific post

**Path Parameters:**

- `id` (string): Post ID

**Success Response (200):**

```json
{
  "message": "Replies retrieved successfully",
  "replies": [
    {
      "userId": {
        "name": "string",
        "profilePic": "string"
      },
      "adminId": {
        "name": "string",
        "profilePic": "string"
      },
      "text": "string",
      "name": "string",
      "userProfilePic": "string",
      "_id": "string"
    }
  ],
  "totalReplies": "number"
}
```

**Error Responses:**

- `404`: Post not found
- `500`: Server error

## Data Models

### User Schema

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "password": "string (required, hashed)",
  "confirmPassword": "string (required, hashed)",
  "email": "string (required, unique)",
  "phoneNumber": "string (required, unique)",
  "profilePic": "string (default: empty string)",
  "communities": "array of strings (default: empty array)",
  "gender": "string (enum: 'Male', 'Female', 'male', 'female')",
  "otp": "string (4 digits, temporary during verification)",
  "otpExpiry": "Date (OTP expiration timestamp)",
  "isVerified": "boolean (default: false)",
  "profilePhoto": "array of strings",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Admin Schema

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "password": "string (required, hashed)",
  "email": "string (required, unique)",
  "phoneNumber": "string (required, unique)",
  "occupation": "string (required)",
  "gender": "string (required, enum: 'Male', 'Female', 'male', 'female')",
  "profilePic": "string (default: empty string)",
  "bio": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Post Schema

```json
{
  "_id": "ObjectId",
  "postedBy": "ObjectId (ref: Admin, required)",
  "adminProfilePic": "string",
  "text": "string (max 3000 characters)",
  "img": "array of strings",
  "likes": "array of ObjectIds (ref: User)",
  "views": "number (default: 50)",
  "comment": [
    {
      "userId": "ObjectId (ref: User, optional)",
      "adminId": "ObjectId (ref: Admin, optional)",
      "text": "string (required)",
      "userProfilePic": "string",
      "name": "string (required)"
    }
  ],
  "replies": [
    {
      "userId": "ObjectId (ref: User, optional)",
      "adminId": "ObjectId (ref: Admin, optional)",
      "text": "string (required)",
      "userProfilePic": "string",
      "name": "string (required)"
    }
  ],
  "createdAt": "string"
}
```

### Comment Schema

```json
{
  "_id": "ObjectId",
  "comment": [
    {
      "text": "string (required)",
      "name": "string"
    }
  ]
}
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `201`: Created successfully
- `400`: Bad request or validation error
- `403`: Forbidden (password mismatch)
- `404`: Resource not found
- `500`: Internal server error

## Password Validation

Passwords must meet the following criteria:

- Minimum 8 characters, maximum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&)

## Notes

1. All passwords are hashed using SHA-256 encryption before storage
2. The API uses CORS with origin "\*" allowing requests from any domain
3. Some endpoints have duplicate functionality across different routes (auth/user routes)
4. The API includes basic validation using Zod schemas
5. MongoDB ObjectIds are used for references between collections
6. Timestamps are automatically managed by Mongoose for User and Admin models

## Rate Limiting

No rate limiting is currently implemented in this API.

## Testing the API

You can test the API endpoints using tools like Postman, curl, or any HTTP client. Make sure to set the Content-Type header to "application/json" for POST requests.

Example using curl:

```bash
curl -X POST https://egov-access.onrender.com/egov/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "phoneNumber": "1234567890",
    "gender": "Male"
  }'
```
