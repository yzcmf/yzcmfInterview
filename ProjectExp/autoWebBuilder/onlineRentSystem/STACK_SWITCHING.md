# Stack Switching Guide

This document explains how to use the modular fullstack application system to switch between different technology stacks seamlessly.

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Install dependencies and create project structure
npm run setup

# Select your preferred stack interactively
npm run switch-stack -- --interactive

# Start development
npm run dev
```

### 2. Switch Between Stacks
```bash
# List all available stacks
npm run list-stacks

# Switch to a specific stack
npm run switch-stack mern
npm run switch-stack pern
npm run switch-stack t3

# Interactive stack selection
npm run switch-stack -- --interactive

# Check current stack
npm run current
```

## 📦 Available Stacks

### MERN Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Ports**: 3000/5000/27017

### PERN Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Ports**: 3000/5000/5432

### T3 Stack
- **Frontend**: Next.js with App Router
- **Backend**: tRPC
- **Database**: PostgreSQL
- **Ports**: 3000/3000/5432

### Next.js Fullstack
- **Frontend**: Next.js with App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Ports**: 3000/3000/5432

### FastAPI + React
- **Frontend**: React.js with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Ports**: 3000/8000/5432

### Spring Boot + React
- **Frontend**: React.js with TypeScript
- **Backend**: Spring Boot (Java)
- **Database**: PostgreSQL
- **Ports**: 3000/8080/5432

### Vue.js + Nuxt
- **Frontend**: Vue.js with Composition API
- **Backend**: Nuxt.js
- **Database**: PostgreSQL
- **Ports**: 3000/3000/5432

### SvelteKit
- **Frontend**: SvelteKit
- **Backend**: SvelteKit
- **Database**: PostgreSQL
- **Ports**: 5173/5173/5432

### Astro Fullstack
- **Frontend**: Astro with SSR
- **Backend**: Astro with Node adapter
- **Database**: PostgreSQL
- **Ports**: 4321/4321/5432

### Remix Fullstack
- **Frontend**: Remix with React
- **Backend**: Remix fullstack
- **Database**: PostgreSQL
- **Ports**: 3000/3000/5432

### SolidStart
- **Frontend**: SolidJS with SolidStart
- **Backend**: SolidStart fullstack
- **Database**: PostgreSQL
- **Ports**: 3000/3000/5432

## 🔧 How It Works

### Unified API Interface
All stacks implement the same API interface, defined in `shared/types/api.ts`:

```typescript
interface Api {
  users: UserApi;
  posts: PostApi;
  comments: CommentApi;
  auth: AuthApi;
}
```

This means your frontend code remains the same regardless of the backend technology:

```typescript
// Same API calls work across all stacks
const user = await api.users.create({ name: "John", email: "john@example.com" });
const posts = await api.posts.list({ userId: user.id });
```

### Stack Configuration
Stacks are configured in `config/stacks.json`:

```json
{
  "stacks": {
    "mern": {
      "name": "MERN Stack",
      "frontend": "react",
      "backend": "nodejs",
      "database": "mongodb",
      "port": {
        "frontend": 3000,
        "backend": 5000,
        "database": 27017
      }
    }
  }
}
```

### Directory Structure
```
├── frontends/           # Frontend implementations
│   ├── react/          # React.js frontend
│   ├── nextjs/         # Next.js frontend
│   ├── vue/            # Vue.js frontend
│   ├── svelte/         # SvelteKit frontend
│   ├── astro/          # Astro frontend
│   ├── remix/          # Remix frontend
│   └── solid/          # SolidJS frontend
├── backends/            # Backend implementations
│   ├── nodejs/         # Node.js + Express
│   ├── fastapi/        # Python FastAPI
│   ├── springboot/     # Java Spring Boot
│   ├── trpc/           # tRPC
│   ├── astro/          # Astro backend
│   ├── remix/          # Remix backend
│   └── solid/          # SolidStart backend
├── databases/           # Database configurations
│   ├── postgresql/     # PostgreSQL setup
│   ├── mongodb/        # MongoDB setup
│   └── sqlite/         # SQLite setup
├── shared/              # Shared code and types
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Utility functions
│   └── api/            # API implementations
└── config/              # Configuration files
```

## 🛠️ Development Workflow

### 1. Choose Your Stack
```bash
# Interactive selection
npm run switch-stack -- --interactive

# Or specify directly
npm run switch-stack t3
```

### 2. Start Development
```bash
# Start all services (frontend, backend, database)
npm run dev
```

### 3. Switch Stacks (if needed)
```bash
# Stop current development servers (Ctrl+C)
# Switch to different stack
npm run switch-stack pern

# Start development with new stack
npm run dev
```

## 🔄 Stack Switching Process

When you switch stacks, the system:

1. **Stops Current Processes**: Kills running development servers
2. **Updates Environment**: Sets stack-specific environment variables
3. **Installs Dependencies**: Installs packages for the new stack
4. **Updates Configuration**: Modifies scripts and configs
5. **Saves Current Stack**: Records the selected stack

## 📊 Performance Comparison

Compare stack performance:

```bash
# Benchmark specific stacks
npm run benchmark -- --stacks=mern,pern,t3

# Benchmark all stacks
npm run benchmark
```

## 🐳 Docker Support

### Start All Services
```bash
# Start databases (PostgreSQL, MongoDB, Redis)
docker-compose -f docker/docker-compose.yml up -d
```

### Start Specific Stack
```bash
# Start MERN stack with Docker
docker-compose -f docker/mern.yml up

# Start T3 stack with Docker
docker-compose -f docker/t3.yml up
```

## 🧪 Testing

### Test Specific Stack
```bash
# Test current stack
npm run test

# Test specific stack
npm run test -- --stack=mern
```

### Test All Stacks
```bash
# Run tests across all stacks
npm run test:all
```

## 🔧 Adding New Stacks

### 1. Create Implementation
```bash
# Create frontend implementation
mkdir frontends/your-frontend
cd frontends/your-frontend
npm init -y
# Add your frontend code
```

### 2. Implement API Interface
```typescript
// frontends/your-frontend/src/lib/api.ts
import type { Api } from '../../../shared/types/api';

export class YourFrontendApi implements Api {
  // Implement all required methods
  users = { /* ... */ };
  posts = { /* ... */ };
  comments = { /* ... */ };
  auth = { /* ... */ };
}
```

### 3. Add Stack Configuration
```json
// config/stacks.json
{
  "stacks": {
    "your-stack": {
      "name": "Your Stack",
      "frontend": "your-frontend",
      "backend": "your-backend",
      "database": "postgresql",
      "port": {
        "frontend": 3000,
        "backend": 5000,
        "database": 5432
      }
    }
  }
}
```

### 4. Create Docker Configuration
```yaml
# docker/your-stack.yml
version: '3.8'
services:
  frontend:
    build:
      context: ../frontends
      dockerfile: your-frontend/Dockerfile
    # ... rest of configuration
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

#### 2. Database Not Running
```bash
# Start PostgreSQL (macOS)
brew services start postgresql

# Start MongoDB (macOS)
brew services start mongodb-community

# Start with Docker
docker-compose -f docker/docker-compose.yml up -d
```

#### 3. Dependencies Not Installed
```bash
# Install root dependencies
npm install

# Install stack-specific dependencies
cd frontends/react && npm install
cd backends/nodejs && npm install
```

#### 4. Stack Not Found
```bash
# Check available stacks
npm run list-stacks

# Reinstall dependencies
npm run setup
```

### Reset Everything
```bash
# Clean all and start fresh
npm run clean
npm run setup
npm run switch-stack -- --interactive
```

## 📚 Best Practices

### 1. Use TypeScript
All implementations should use TypeScript for better type safety and developer experience.

### 2. Follow API Interface
Always implement the complete API interface to ensure compatibility across stacks.

### 3. Use Environment Variables
Store configuration in environment variables, not in code.

### 4. Test Across Stacks
Write tests that work across all stack implementations.

### 5. Document Changes
Update documentation when adding new stacks or features.

## 🎯 Use Cases

### 1. Technology Evaluation
Compare different stacks for your project requirements.

### 2. Learning Different Technologies
Practice with various frontend and backend technologies.

### 3. Migration Planning
Test migration paths between different technology stacks.

### 4. Team Skill Development
Allow team members to work with their preferred technologies.

### 5. Proof of Concept
Quickly prototype with different technology combinations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your stack
4. Add tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 