# Modular Fullstack Application

A flexible fullstack application architecture that allows switching between different technology stacks at will.

## 🏗️ Architecture Overview

This project uses a **modular architecture** with:
- **Frontend Layer**: Interchangeable UI frameworks
- **Backend Layer**: Swappable server technologies  
- **Database Layer**: Pluggable database systems
- **API Layer**: Unified API interface
- **Configuration Layer**: Stack switching mechanism

## 📦 Available Stacks

### Frontend Stacks
- **React** (with TypeScript)
- **Next.js** (with App Router)
- **Vue.js** (with Composition API)
- **Svelte/SvelteKit**
- **Astro** (with SSR)
- **Remix** (with React)
- **SolidJS** (with SolidStart)

### Backend Stacks
- **Node.js + Express**
- **Next.js API Routes**
- **FastAPI (Python)**
- **Spring Boot (Java)**
- **tRPC**
- **Astro** (with Node adapter)
- **Remix** (fullstack)
- **SolidStart** (fullstack)

### Database Stacks
- **PostgreSQL** (with Prisma)
- **MongoDB** (with Mongoose)
- **SQLite** (for development)
- **Supabase** (PostgreSQL + Auth)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start with default stack (React + Node.js + PostgreSQL)
npm run dev

# Switch to different stack
npm run switch-stack -- --frontend=nextjs --backend=fastapi --database=mongodb

# List available stacks
npm run list-stacks

# Switch to Astro fullstack
npm run switch-stack astro-fullstack

# Switch to Remix fullstack
npm run switch-stack remix-fullstack

# Switch to SolidStart
npm run switch-stack solid-start

# Interactive selection (includes new stacks)
npm run switch-stack -- --interactive
```

## 🔧 Stack Configuration

Edit `config/stacks.json` to define your stacks:

```json
{
  "stacks": {
    "mern": {
      "frontend": "react",
      "backend": "nodejs",
      "database": "mongodb",
      "description": "MERN Stack"
    },
    "pern": {
      "frontend": "react", 
      "backend": "nodejs",
      "database": "postgresql",
      "description": "PERN Stack"
    },
    "t3": {
      "frontend": "nextjs",
      "backend": "trpc",
      "database": "postgresql", 
      "description": "T3 Stack"
    }
  }
}
```

## 📁 Project Structure

```
├── frontends/           # Frontend implementations
│   ├── react/
│   ├── nextjs/
│   ├── vue/
│   └── svelte/
├── backends/            # Backend implementations
│   ├── nodejs/
│   ├── fastapi/
│   ├── springboot/
│   └── trpc/
├── databases/           # Database configurations
│   ├── postgresql/
│   ├── mongodb/
│   └── sqlite/
├── shared/              # Shared code and types
│   ├── types/
│   ├── utils/
│   └── api/
├── config/              # Configuration files
├── scripts/             # Stack switching scripts
└── docker/              # Docker configurations
```

## 🔄 Stack Switching

The system uses a **unified API interface** that abstracts away the underlying technology:

```typescript
// Same API calls work across all stacks
const user = await api.users.create({ name: "John", email: "john@example.com" });
const posts = await api.posts.list({ userId: user.id });
```

## 🛠️ Development

### Adding a New Stack

1. Create implementation in appropriate directory
2. Implement the unified API interface
3. Add configuration to `config/stacks.json`
4. Create Docker configuration if needed

### Testing Stacks

```bash
# Test specific stack
npm run test -- --stack=mern

# Test all stacks
npm run test:all
```

## 🐳 Docker Support

Each stack has its own Docker configuration for easy deployment:

```bash
# Build specific stack
docker-compose -f docker/mern.yml up

# Build all stacks
docker-compose -f docker/all-stacks.yml up
```

## 📊 Performance Comparison

The system includes built-in benchmarking to compare stack performance:

```bash
npm run benchmark -- --stacks=mern,pern,t3
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your stack
4. Add tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 

# After switching to any stack
npm run dev 