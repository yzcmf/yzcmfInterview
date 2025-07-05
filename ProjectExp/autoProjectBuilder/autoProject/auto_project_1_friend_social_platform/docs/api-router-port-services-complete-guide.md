# API, Router, Port & Services Complete Guide
## Complete System Architecture: APIs, Routes, Ports, Services & Infrastructure

## System Overview

This documentation provides a complete guide to the Friend Social Platform's APIs, routes, ports, and services architecture.

### Documentation Sections
1. **APIs** - REST endpoints, WebSocket connections, and data formats
2. **Routers** - Route definitions, middleware, and request handling
3. **Ports** - Service port assignments and port management
4. **Services** - All system services and their configurations

### Service Categories
1. **Frontend Services** - User interface applications (Ports 3002-3020)
2. **Backend Services** - API and business logic (Port 8002)
3. **AI Services** - Machine learning and matching (Port 8001)
4. **Database Services** - Data storage and caching (Ports 5432, 6379)
5. **Search Services** - Full-text search and analytics (Ports 9200, 5601)
6. **Infrastructure Services** - Reverse proxy and load balancing (Ports 80, 443)
7. **Monitoring Services** - Metrics and observability (Ports 9090, 3002)

## Port Summary
- **Frontend Services**: Ports 3002-3020 (Dynamic assignment)
- **Backend API**: Port 8002
- **AI Service**: Port 8001
- **Default Frontend**: Port 3002

## Quick Port Reference
| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend (Default) | 3002 | http://localhost:3002 | Main frontend application |
| Frontend (Custom) | 3004-3020 | http://localhost:3004+ | Additional frontend instances |
| Backend API | 8002 | http://localhost:8002 | REST API endpoints |
| AI Service | 8001 | http://localhost:8001 | AI matching & moderation |
| Nginx Proxy | 80/443 | http://localhost | Reverse proxy & load balancer |
| PostgreSQL | 5432 | - | Database server |
| Redis | 6379 | - | Cache & session store |
| Elasticsearch | 9200 | http://localhost:9200 | Search engine |
| Kibana | 5601 | http://localhost:5601 | Log analysis & visualization |
| Frontend (Reserved) | 3003 | - | Reserved by Docker |

## Table of Contents
1. [Frontend Services & Routes](#frontend-pages)
2. [Backend APIs & Routers](#backend-apis)
3. [AI Service APIs](#ai-service)
4. [Infrastructure Services](#additional-services--infrastructure)
5. [Database Services](#database-services)
6. [Search & Analytics Services](#search--analytics-services)
7. [Monitoring Services](#monitoring-services-commented-in-docker)
8. [API Integration Guide](#api-integration-guide)
9. [Authentication Flow](#authentication-flow)
10. [Error Handling](#error-handling)
11. [Service Management](#service-management)

---

## Frontend Pages

## Frontend Port Range: 3002-3020

The frontend services use a dynamic port range from 3002 to 3020. The default port is 3002, and you can switch between different frontend versions using the frontend switcher script.

### Available Frontend Versions

#### 1. frondend1 (Default)
**Default Port**: 3002
**URL**: http://localhost:3002 (or custom port 3002-3020)

#### Landing Page
- **Route**: `/`
- **Component**: `frontends/frondend1/app/page.tsx`
- **Description**: Main landing page with hero section, features, and call-to-action
- **Features**: 
  - Hero section with platform introduction
  - Feature highlights
  - Call-to-action buttons for login/register

#### Authentication Pages
- **Route Group**: `/(auth)`
- **Layout**: `frontends/frondend1/app/(auth)/layout.tsx`

##### Login Page
- **Route**: `/login`
- **Component**: `frontends/frondend1/app/(auth)/login/page.tsx`
- **Features**:
  - Email/password login form
  - "Remember me" option
  - Forgot password link
  - Register link
  - Social login options (if configured)

##### Register Page
- **Route**: `/register`
- **Component**: `frontends/frondend1/app/(auth)/register/page.tsx`
- **Features**:
  - User registration form
  - Email verification
  - Terms and conditions
  - Login link

#### Dashboard Pages
- **Route Group**: `/(dashboard)`
- **Layout**: `frontends/frondend1/app/(dashboard)/layout.tsx`
- **Authentication**: Required

##### Dashboard Home
- **Route**: `/dashboard`
- **Component**: `frontends/frondend1/app/(dashboard)/dashboard/page.tsx`
- **Features**:
  - User overview and stats
  - Recent activity feed
  - Quick actions
  - Navigation to other sections

##### Chat Interface
- **Route**: `/chat`
- **Component**: `frontends/frondend1/app/(dashboard)/chat/page.tsx`
- **Features**:
  - Real-time messaging
  - Match list sidebar
  - Message history
  - Typing indicators
  - File/image sharing

##### Discover Page
- **Route**: `/discover`
- **Component**: `frontends/frondend1/app/(dashboard)/discover/page.tsx`
- **Features**:
  - User discovery cards
  - Like/Pass actions
  - User filtering
  - Location-based matching

##### Matches Page
- **Route**: `/matches`
- **Component**: `frontends/frondend1/app/(dashboard)/matches/page.tsx`
- **Features**:
  - List of successful matches
  - Match statistics
  - Quick chat access
  - Unmatch functionality

##### Profile Page
- **Route**: `/profile`
- **Component**: `frontends/frondend1/app/(dashboard)/profile/page.tsx`
- **Features**:
  - Profile information display
  - Edit profile functionality
  - Privacy settings
  - Account management

#### API Routes
- **Auth Routes**: `/api/auth/[...nextauth]` - NextAuth.js authentication
- **Register Route**: `/api/register` - Custom registration endpoint

---

#### 2. frontend1-2 - Enhanced Version
**Available Ports**: 3002-3020
**Features**: All frondend1 features plus additional pages

##### Additional Pages (beyond frondend1)

##### Notifications Page
- **Route**: `/notifications`
- **Component**: `frontends/frontend1-2/app/(dashboard)/notifications/page.tsx`
- **Features**:
  - Notification center
  - Real-time notifications
  - Notification preferences
  - Mark as read functionality

##### Payment Page
- **Route**: `/payment`
- **Component**: `frontends/frontend1-2/app/(dashboard)/payment/page.tsx`
- **Features**:
  - Payment processing
  - Subscription management
  - Payment history
  - Billing information

##### Pricing Page
- **Route**: `/pricing`
- **Component**: `frontends/frontend1-2/app/(dashboard)/pricing/page.tsx`
- **Features**:
  - Subscription plans
  - Feature comparison
  - Payment options
  - FAQ section

##### Settings Page
- **Route**: `/settings`
- **Component**: `frontends/frontend1-2/app/(dashboard)/settings/page.tsx`
- **Features**:
  - Account settings
  - Privacy controls
  - Notification preferences
  - Security settings

---

#### 3. frontend2 - Alternative Layout
**Available Ports**: 3002-3020
**Key Differences**:
- **Discovery Layout**: Separate from dashboard (`/discover`)
- **Simplified Navigation**: Focused on core features
- **Mobile-First Design**: Optimized for mobile devices

#### Pages Structure
- Landing: `/`
- Auth: `/login`, `/register`
- Dashboard: `/dashboard`, `/chat`, `/matches`, `/profile`
- Discovery: `/discover` (separate route)

---

#### 4. frontend2-2 - Enhanced Alternative
**Available Ports**: 3002-3020
**Features**:
- All frontend2 features plus:
- Notifications, Payment, Pricing, Settings pages
- Enhanced user experience
- Advanced features

---

### Frontend Switching

You can switch between frontend versions using the frontend switcher script:

```bash
# Show available frontends
./scripts/switch-frontend.sh --list

# Switch to specific frontend with custom port
./scripts/switch-frontend.sh frondend1 3004

# Interactive menu
./scripts/switch-frontend.sh --menu

# Show current frontend
./scripts/switch-frontend.sh --current
```

### Port Management
- **Port Range**: 3002-3020
- **Default Port**: 3002
- **Dynamic Assignment**: Ports are assigned dynamically based on availability
- **Docker Integration**: Frontend runs in Docker containers with port mapping

### Checking Port Status
```bash
# Check which ports are currently in use
lsof -i :3002 -i :3003 -i :3004 -i :3005 -i :3006 -i :3007 -i :3008 -i :3009 -i :3010

# Check Docker containers and their port mappings
docker ps

# Check current frontend configuration
./scripts/switch-frontend.sh --current
```

### Current Port Assignments
- **Port 3003**: Reserved by Docker (exlm-agent service)
- **Port 3002**: Default frontend port (when available)
- **Ports 3004-3020**: Available for frontend services

---

## Backend APIs

### Base URL
- **Development**: http://localhost:8002
- **Production**: Configured via environment variables
- **Port**: 8002

### WebSocket Support
The backend also supports WebSocket connections for real-time features:
- **WebSocket URL**: ws://localhost:8002
- **Events**: 
  - `join` - Join user room
  - `send_message` - Send chat message
  - `user_online` - Update user online status
  - `receive_message` - Receive chat message
  - `user_status_change` - User status updates

### Authentication APIs (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password123"
}
```

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

#### Resend Verification
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

### User Management APIs (`/api/users`)

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "User bio",
    "location": "New York",
    "birthDate": "1990-01-01",
    "gender": "male",
    "avatar": "avatar_url"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "location": "Los Angeles",
  "birthDate": "1990-01-01",
  "gender": "male"
}
```

#### Upload Avatar
```http
POST /api/users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

#### Discover Users
```http
GET /api/users/discover?page=1&limit=20&location=New York
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "bio": "User bio",
        "location": "New York",
        "age": 25,
        "avatar": "avatar_url",
        "compatibilityScore": 0.85
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### Get User by ID
```http
GET /api/users/:userId
Authorization: Bearer <token>
```

#### Update User Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "ageRange": {
    "min": 18,
    "max": 35
  },
  "distance": 50,
  "interests": ["music", "travel", "sports"],
  "genderPreference": ["female"]
}
```

#### Get User Stats
```http
GET /api/users/stats/overview
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalMatches": 15,
    "totalLikes": 45,
    "totalPasses": 120,
    "profileViews": 89,
    "responseRate": 0.75
  }
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <token>
```

---

### Matching APIs (`/api/matches`)

#### Get Match Suggestions
```http
GET /api/matches/suggestions?limit=10
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "user_id",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "bio": "User bio",
        "location": "New York",
        "age": 25,
        "avatar": "avatar_url",
        "compatibilityScore": 0.85,
        "commonInterests": ["music", "travel"]
      }
    ]
  }
}
```

#### Like User
```http
POST /api/matches/like
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetUserId": "target_user_id"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "isMatch": true,
    "matchId": "match_id",
    "message": "It's a match!"
  }
}
```

#### Pass User
```http
POST /api/matches/pass
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetUserId": "target_user_id"
}
```

#### Get Matches
```http
GET /api/matches?page=1&limit=20
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match_id",
        "user": {
          "id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "avatar_url"
        },
        "matchedAt": "2024-01-01T00:00:00Z",
        "lastMessage": "Hello!",
        "lastMessageAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

### Chat APIs (`/api/chat`)

#### Get Chat History
```http
GET /api/chat/:matchId?page=1&limit=50
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "message_id",
        "content": "Hello!",
        "senderId": "user_id",
        "timestamp": "2024-01-01T12:00:00Z",
        "type": "text"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25,
      "pages": 1
    }
  }
}
```

#### Send Message
```http
POST /api/chat/:matchId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello!",
  "type": "text"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "message_id",
      "content": "Hello!",
      "senderId": "user_id",
      "timestamp": "2024-01-01T12:00:00Z",
      "type": "text"
    }
  }
}
```

---

### Analytics APIs (`/api/analytics`)

#### Get User Statistics
```http
GET /api/analytics/user-stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalMatches": 15,
    "totalLikes": 45,
    "totalPasses": 120,
    "profileViews": 89,
    "responseRate": 0.75,
    "averageResponseTime": 2.5
  }
}
```

#### Get Platform Statistics
```http
GET /api/analytics/platform-stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 10000,
    "totalMatches": 5000,
    "activeUsers": 2500,
    "dailyMatches": 150,
    "averageResponseTime": 3.2
  }
}
```

---

## Additional Services & Infrastructure

### Nginx Reverse Proxy (Port 80/443)
**URL**: http://localhost (HTTP) / https://localhost (HTTPS)

#### Proxy Routes
- **API Routes**: `/api/*` → Backend (Port 8002)
- **AI Service Routes**: `/ai/*` → AI Service (Port 8001)
- **Auth Routes**: `/auth/*` → Backend (Port 8002)
- **WebSocket Routes**: `/ws/*` → Backend (Port 8002)
- **Frontend**: `/` → Frontend (Port 3002)

#### Features
- **Rate Limiting**: API (10r/s), Login (5r/s)
- **Security Headers**: X-Frame-Options, XSS Protection, etc.
- **Gzip Compression**: Enabled for all responses
- **Health Check**: `/health` endpoint
- **Static Files**: `/static/*` with caching

#### Configuration
```nginx
# API routes with rate limiting
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend/;
}

# AI Service routes
location /ai/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://ai_service/;
}

# WebSocket support
location /ws/ {
    proxy_pass http://backend/ws/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

### Database Services

#### PostgreSQL (Port 5432)
**Purpose**: Primary database for user data, matches, messages
**Connection**: `postgresql://postgres:postgres123@localhost:5432/social_platform`

#### Redis (Port 6379)
**Purpose**: Caching, session storage, rate limiting
**Connection**: `redis://localhost:6379`
**Features**:
- Session storage
- API rate limiting
- Real-time data caching
- Message queues

---

### Search & Analytics Services

#### Elasticsearch (Port 9200)
**URL**: http://localhost:9200
**Purpose**: Full-text search, user discovery, content indexing

##### Health Check
```http
GET http://localhost:9200/_cluster/health
```

##### Search APIs
```http
# Search users
POST http://localhost:9200/users/_search
{
  "query": {
    "multi_match": {
      "query": "search term",
      "fields": ["firstName", "lastName", "bio", "interests"]
    }
  }
}

# Index user document
PUT http://localhost:9200/users/_doc/:userId
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "User bio",
  "interests": ["music", "travel"],
  "location": "New York"
}
```

#### Kibana (Port 5601)
**URL**: http://localhost:5601
**Purpose**: Log analysis, data visualization, monitoring dashboards

##### Features
- Log analysis and visualization
- User activity dashboards
- Performance monitoring
- Error tracking and analysis

---

### Monitoring Services (Commented in Docker)

#### Prometheus (Port 9090)
**URL**: http://localhost:9090 (when enabled)
**Purpose**: Metrics collection and monitoring

##### Metrics Endpoints
- **Backend Metrics**: http://localhost:8002/metrics
- **AI Service Metrics**: http://localhost:8001/metrics
- **System Metrics**: CPU, memory, disk usage

#### Grafana (Port 3002)
**URL**: http://localhost:3002 (when enabled)
**Purpose**: Metrics visualization and dashboards

##### Default Credentials
- **Username**: admin
- **Password**: admin123

---

### Infrastructure Services

#### Port Manager
The backend uses a dynamic port management system:
- **Preferred Port**: 8000
- **Fallback Ports**: 8002, 8003, 8004, 8005
- **Auto-selection**: Automatically selects next available port

#### Health Checks
All services include health check endpoints:
- **Backend**: `GET /health`
- **AI Service**: `GET /health`
- **Nginx**: `GET /health`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`
- **Elasticsearch**: `GET /_cluster/health`

---

## API Integration Guide

### Authentication Headers
All protected endpoints require the JWT token in the Authorization header:
```http
Authorization: Bearer <jwt_token>
```

### Error Responses
Standard error response format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid request data
- `INTERNAL_ERROR` (500): Server error

### Pagination
Most list endpoints support pagination:
```http
GET /api/endpoint?page=1&limit=20
```

**Response format**:
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

## Authentication Flow

### 1. Registration Flow
1. User submits registration form
2. Frontend calls `POST /api/auth/register`
3. Backend validates data and creates user
4. Email verification sent (if enabled)
5. User receives JWT token

### 2. Login Flow
1. User submits login form
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials
4. User receives JWT token and refresh token
5. Token stored in frontend (localStorage/cookies)

### 3. Token Refresh Flow
1. Frontend detects token expiration
2. Calls `POST /api/auth/refresh` with refresh token
3. Backend validates refresh token
4. New JWT token issued
5. Frontend updates stored token

### 4. Protected Route Access
1. Frontend includes JWT token in Authorization header
2. Backend validates token on each request
3. If valid, request proceeds
4. If invalid, returns 401 Unauthorized

---

## Error Handling

### Frontend Error Handling
- Network errors: Retry with exponential backoff
- 401 errors: Redirect to login
- 403 errors: Show permission denied message
- 422 errors: Display validation errors
- 500 errors: Show generic error message

### Backend Error Handling
- Input validation using express-validator
- JWT token validation middleware
- Global error handler for uncaught exceptions
- Structured error responses
- Logging for debugging

### Rate Limiting
- API endpoints are rate-limited
- Authentication endpoints have stricter limits
- Rate limit headers included in responses

---

## Development Notes

### Environment Variables
```bash
# Backend
PORT=8002
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
```

### Testing
- Backend: Jest + Supertest
- Frontend: Jest + React Testing Library
- E2E: Playwright or Cypress

### Shared Services
The project includes shared utilities and schemas:
- **Shared Types**: `shared/types/` - Common TypeScript interfaces
- **Shared Schemas**: `shared/schemas/` - Data validation schemas
- **Shared Utils**: `shared/utils/` - Common utility functions

### Deployment
- Backend: Docker containers
- Frontend: Vercel/Netlify
- Database: PostgreSQL
- Cache: Redis
- File Storage: AWS S3/Cloudinary
- Search: Elasticsearch
- Monitoring: Prometheus + Grafana
- Reverse Proxy: Nginx 