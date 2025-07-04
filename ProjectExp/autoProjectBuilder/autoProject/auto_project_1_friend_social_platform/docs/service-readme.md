# 🚀 Service Management Guide

## 📋 Overview

This document provides a comprehensive guide to all services in the Friend Social Platform project. The platform is built using a microservices architecture with multiple interconnected services.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Service    │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chat Service  │    │   PostgreSQL    │    │   Redis Cache   │
│   (WebSocket)   │    │   Database      │    │   Session Store │
│   Port: 8002    │    │   Port: 5432    │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Service List

### Core Application Services

| Service | Technology | Port | Purpose | Status |
|---------|------------|------|---------|--------|
| **Frontend** | Next.js | 3000 | User interface | ✅ Ready |
| **Backend API** | Node.js/Express | 8000 | Main API server | ✅ Ready |
| **AI Service** | Python/FastAPI | 8001 | AI matching & moderation | ✅ Ready |
| **Chat Service** | Node.js/WebSocket | 8002 | Real-time messaging | ✅ Ready |

### Infrastructure Services

| Service | Technology | Port | Purpose | Status |
|---------|------------|------|---------|--------|
| **PostgreSQL** | Database | 5432 | Primary database | ✅ Ready |
| **Redis** | Cache | 6379 | Session & cache | ✅ Ready |
| **Elasticsearch** | Search | 9200 | User search | ✅ Ready |
| **Kibana** | Analytics | 5601 | Log analysis | ✅ Ready |

### Proxy & Monitoring

| Service | Technology | Port | Purpose | Status |
|---------|------------|------|---------|--------|
| **Nginx** | Reverse Proxy | 80/443 | Load balancing | ✅ Ready |
| **Prometheus** | Monitoring | 9090 | Metrics collection | ✅ Ready |
| **Grafana** | Dashboards | 3001 | Monitoring UI | ✅ Ready |

## 🚀 Quick Start Options

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Quick Start Script

```bash
# One-command startup
./scripts/quick-start.sh
```

### Option 3: Service Manager

```bash
# Check all services
./scripts/service-manager.sh check

# Start all services
./scripts/service-manager.sh start

# Start specific service
./scripts/service-manager.sh start backend
./scripts/service-manager.sh start ai
./scripts/service-manager.sh start redis
```

### Option 4: Manual Development

```bash
# Install dependencies
npm run setup

# Start all services concurrently
npm run dev

# Or start individually
npm run dev:frontend    # Frontend on port 3000
npm run dev:backend     # Backend on port 8000
npm run dev:ai          # AI service on port 8001
npm run dev:chat        # Chat service on port 8002
```

## 📋 Detailed Service Information

### 1. Frontend Service
- **Location**: `./frontend` or `./frontends/frondend1`
- **Technology**: Next.js 14 with TypeScript
- **Port**: 3000
- **Purpose**: Main user interface for the social platform
- **Key Features**: 
  - User authentication
  - Profile management
  - Match discovery
  - Real-time chat
  - Responsive design

**Start Command:**
```bash
cd frontend && npm run dev
```

### 2. Backend API Service
- **Location**: `./backend`
- **Technology**: Node.js with Express and TypeScript
- **Port**: 8000
- **Purpose**: Main API server handling business logic
- **Key Features**:
  - User authentication & authorization
  - User profile management
  - Match management
  - Database operations
  - API endpoints

**Start Command:**
```bash
cd backend && npm run dev
```

### 3. AI Service
- **Location**: `./ai-service`
- **Technology**: Python with FastAPI
- **Port**: 8001
- **Purpose**: AI-powered features and algorithms
- **Key Features**:
  - User matching algorithms
  - Content moderation
  - Natural language processing
  - Recommendation systems
  - Image analysis

**Start Command:**
```bash
cd ai-service && python -m uvicorn app:app --reload --port 8001
```

### 4. Chat Service
- **Location**: `./chat-service`
- **Technology**: Node.js with Socket.io
- **Port**: 8002
- **Purpose**: Real-time messaging and WebSocket connections
- **Key Features**:
  - WebSocket connections
  - Real-time messaging
  - Message encryption
  - Online status tracking
  - Chat room management

**Start Command:**
```bash
cd chat-service && npm run dev
```

### 5. PostgreSQL Database
- **Port**: 5432
- **Purpose**: Primary relational database
- **Data**: Users, matches, messages, profiles
- **Docker**: `social_platform_postgres`

**Start Command:**
```bash
# Using Docker
docker run -d --name postgres -p 5432:5432 \
  -e POSTGRES_DB=social_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  postgres:15-alpine
```

### 6. Redis Cache
- **Port**: 6379
- **Purpose**: Session storage and caching
- **Data**: Sessions, temporary data, real-time state
- **Docker**: `social_platform_redis`

**Start Command:**
```bash
# Using Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Or locally
redis-server --daemonize yes
```

## 🔍 Health Check URLs

| Service | Health Check URL | Expected Response |
|---------|------------------|-------------------|
| Frontend | http://localhost:3000 | HTML page |
| Backend API | http://localhost:8000/health | `{"status":"ok"}` |
| AI Service | http://localhost:8001/health | `{"status":"ok"}` |
| Chat Service | ws://localhost:8002 | WebSocket connection |
| PostgreSQL | localhost:5432 | Database connection |
| Redis | localhost:6379 | `PONG` response |
| Elasticsearch | http://localhost:9200 | `{"status":"green"}` |
| Kibana | http://localhost:5601 | Kibana UI |
| Prometheus | http://localhost:9090 | Prometheus UI |
| Grafana | http://localhost:3001 | Grafana UI |

## 🛠️ Service Management Commands

### Check Service Status
```bash
# Check all services
./scripts/service-manager.sh check

# Check specific service
lsof -i :8000  # Backend
lsof -i :8001  # AI Service
lsof -i :6379  # Redis
```

### Start Services
```bash
# Start all services
./scripts/service-manager.sh start

# Start specific service
./scripts/service-manager.sh start backend
./scripts/service-manager.sh start ai
./scripts/service-manager.sh start redis
```

### Stop Services
```bash
# Stop all services
./scripts/service-manager.sh stop

# Stop specific service
./scripts/service-manager.sh stop backend
```

### Restart Services
```bash
# Restart specific service
./scripts/service-manager.sh restart backend
./scripts/service-manager.sh restart ai
```

### View Logs
```bash
# View all logs
./scripts/service-manager.sh logs

# View specific service logs
./scripts/service-manager.sh logs backend
./scripts/service-manager.sh logs ai
./scripts/service-manager.sh logs redis
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Backend Configuration
NODE_ENV=development
PORT=8000
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/social_platform
# Or use SQLite for development
# DATABASE_URL=file:./dev.db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8001

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8002
```

### Service Dependencies
**Startup Order:**
1. **PostgreSQL** & **Redis** (databases)
2. **Elasticsearch** (search)
3. **Backend API** (depends on databases)
4. **AI Service** (depends on database)
5. **Chat Service** (depends on databases)
6. **Frontend** (depends on backend)
7. **Nginx** (depends on all app services)
8. **Monitoring** (Prometheus & Grafana)

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### Service Won't Start
```bash
# Check logs
./scripts/service-manager.sh logs backend

# Debug service
./scripts/service-manager.sh debug backend
```

#### Database Connection Issues
```bash
# Check PostgreSQL
psql -h localhost -p 5432 -U postgres -d social_platform

# Check Redis
redis-cli ping
```

#### Dependency Issues
```bash
# Reinstall backend dependencies
cd backend && npm install

# Reinstall AI service dependencies
cd ai-service && pip install -r requirements.txt
```

### Debug Commands

```bash
# Check all processes
ps aux | grep node
ps aux | grep python
ps aux | grep redis

# Check network connections
netstat -tulpn | grep :8000
netstat -tulpn | grep :8001

# Check disk space
df -h

# Check memory usage
free -h
```

## 📊 Monitoring

### Service Metrics
- **CPU Usage**: Monitor with `htop` or `top`
- **Memory Usage**: Check with `free -h`
- **Disk Usage**: Monitor with `df -h`
- **Network**: Check with `netstat` or `ss`

### Log Monitoring
```bash
# Real-time log monitoring
tail -f logs/backend.log
tail -f logs/ai-service.log
tail -f logs/redis.log

# Search for errors
grep "ERROR" logs/backend.log
grep "ERROR" logs/ai-service.log
```

## 🔒 Security Considerations

### Development Environment
- Use strong passwords for databases
- Don't commit sensitive data to version control
- Use environment variables for configuration
- Keep dependencies updated

### Production Environment
- Enable HTTPS
- Configure firewalls
- Use strong authentication
- Regular security updates
- Monitor for vulnerabilities

## 📚 Additional Resources

- **API Documentation**: `docs/api-documentation.md`
- **Service Management**: `docs/service-management.md`
- **Frontend Guide**: `FRONTEND_V0_GUIDE.md`
- **Project Structure**: `project-structure.md`
- **Docker Setup**: `docker-compose.yml`

## 🆘 Getting Help

### Script Help
```bash
./scripts/service-manager.sh help
```

### Common Error Codes
| Error Code | Description | Solution |
|------------|-------------|----------|
| EADDRINUSE | Port already in use | Stop conflicting process |
| ECONNREFUSED | Connection refused | Check if service is running |
| ENOENT | File not found | Check file paths |
| EACCES | Permission denied | Check file permissions |

### Support
- Check the troubleshooting section above
- Review service logs for specific errors
- Consult the API documentation
- Check the project structure guide

---

*Last updated: December 2024*
*Version: 1.0.0* 