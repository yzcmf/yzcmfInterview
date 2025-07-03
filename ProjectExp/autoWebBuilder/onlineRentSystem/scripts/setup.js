#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Create directory structure
const createDirectories = async () => {
  console.log(chalk.blue('📁 Creating directory structure...'));
  
  const directories = [
    'frontends/react/src',
    'frontends/react/public',
    'frontends/nextjs/src',
    'frontends/nextjs/public',
    'frontends/vue/src',
    'frontends/vue/public',
    'frontends/svelte/src',
    'frontends/svelte/static',
    'frontends/astro/src',
    'frontends/astro/public',
    'frontends/remix/app',
    'frontends/remix/public',
    'frontends/solid/src',
    'frontends/solid/public',
    'backends/nodejs/src',
    'backends/fastapi/src',
    'backends/springboot/src',
    'backends/trpc/src',
    'backends/nuxt/src',
    'backends/svelte/src',
    'backends/astro/src',
    'backends/remix/app',
    'backends/solid/src',
    'databases/postgresql',
    'databases/mongodb',
    'databases/sqlite',
    'shared/types',
    'shared/utils',
    'shared/api',
    'config',
    'scripts',
    'docker'
  ];
  
  for (const dir of directories) {
    await fs.ensureDir(path.join(__dirname, '..', dir));
    console.log(chalk.gray(`   Created: ${dir}`));
  }
};

// Create basic configuration files
const createConfigFiles = async () => {
  console.log(chalk.blue('⚙️  Creating configuration files...'));
  
  // TypeScript config for root
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      lib: ["ES2020"],
      outDir: "./dist",
      rootDir: "./",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    include: [
      "scripts/**/*",
      "shared/**/*"
    ],
    exclude: [
      "node_modules",
      "dist",
      "frontends/**/*",
      "backends/**/*"
    ]
  };
  
  await fs.writeJson(path.join(__dirname, '../tsconfig.json'), tsConfig, { spaces: 2 });
  
  // ESLint config for root
  const eslintConfig = {
    root: true,
    env: {
      node: true,
      es2020: true
    },
    extends: [
      "eslint:recommended",
      "@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
    },
    plugins: [
      "@typescript-eslint"
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  };
  
  await fs.writeJson(path.join(__dirname, '../.eslintrc.json'), eslintConfig, { spaces: 2 });
  
  // Git ignore
  const gitignore = `
# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
.next/
.nuxt/
.svelte-kit/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database files
*.db
*.sqlite
*.sqlite3

# Docker
.dockerignore

# Current stack file
.current-stack
`;
  
  await fs.writeFile(path.join(__dirname, '../.gitignore'), gitignore.trim());
  
  console.log(chalk.gray('   Created: tsconfig.json'));
  console.log(chalk.gray('   Created: .eslintrc.json'));
  console.log(chalk.gray('   Created: .gitignore'));
};

// Create Docker configurations
const createDockerConfigs = async () => {
  console.log(chalk.blue('🐳 Creating Docker configurations...'));
  
  // Docker Compose for all stacks
  const dockerComposeAll = `
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: modular-postgres
    environment:
      POSTGRES_DB: modular-app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - modular-network

  # MongoDB Database
  mongodb:
    image: mongo:6
    container_name: modular-mongodb
    environment:
      MONGO_INITDB_DATABASE: modular-app
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - modular-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: modular-redis
    ports:
      - "6379:6379"
    networks:
      - modular-network

volumes:
  postgres_data:
  mongodb_data:

networks:
  modular-network:
    driver: bridge
`;
  
  await fs.writeFile(path.join(__dirname, '../docker/docker-compose.yml'), dockerComposeAll.trim());
  
  // Individual stack Docker files
  const stacks = ['mern', 'pern', 't3', 'nextjs-fullstack', 'fastapi-react', 'spring-react'];
  
  for (const stack of stacks) {
    const dockerCompose = `
version: '3.8'

services:
  frontend:
    build:
      context: ../frontends
      dockerfile: ${stack}/Dockerfile
    container_name: ${stack}-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    networks:
      - ${stack}-network

  backend:
    build:
      context: ../backends
      dockerfile: ${stack}/Dockerfile
    container_name: ${stack}-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/modular-app
    depends_on:
      - postgres
    networks:
      - ${stack}-network

  postgres:
    image: postgres:15
    container_name: ${stack}-postgres
    environment:
      POSTGRES_DB: modular-app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - ${stack}_postgres_data:/var/lib/postgresql/data
    networks:
      - ${stack}-network

volumes:
  ${stack}_postgres_data:

networks:
  ${stack}-network:
    driver: bridge
`;
    
    await fs.writeFile(path.join(__dirname, `../docker/${stack}.yml`), dockerCompose.trim());
  }
  
  console.log(chalk.gray('   Created: docker/docker-compose.yml'));
  console.log(chalk.gray('   Created: Individual stack Docker files'));
};

// Install dependencies
const installDependencies = async () => {
  console.log(chalk.blue('📦 Installing dependencies...'));
  
  try {
    console.log(chalk.gray('   Installing root dependencies...'));
    await execAsync('npm install', { cwd: path.join(__dirname, '..') });
    
    // Install dependencies for each frontend
    const frontends = ['react', 'nextjs', 'vue', 'svelte', 'astro', 'remix', 'solid'];
    for (const frontend of frontends) {
      const frontendPath = path.join(__dirname, `../frontends/${frontend}`);
      if (fs.existsSync(path.join(frontendPath, 'package.json'))) {
        console.log(chalk.gray(`   Installing ${frontend} frontend dependencies...`));
        await execAsync('npm install', { cwd: frontendPath });
      }
    }
    
    // Install dependencies for each backend
    const backends = ['nodejs', 'trpc', 'nuxt', 'svelte', 'astro', 'remix', 'solid'];
    for (const backend of backends) {
      const backendPath = path.join(__dirname, `../backends/${backend}`);
      if (fs.existsSync(path.join(backendPath, 'package.json'))) {
        console.log(chalk.gray(`   Installing ${backend} backend dependencies...`));
        await execAsync('npm install', { cwd: backendPath });
      }
    }
    
  } catch (error) {
    console.log(chalk.yellow('Warning: Some dependencies may not have installed correctly'));
    console.log(chalk.gray('   You can run "npm install" in individual directories later'));
  }
};

// Create initial stack
const createInitialStack = async () => {
  console.log(chalk.blue('🎯 Setting up initial stack...'));
  
  try {
    // Set default stack to MERN
    await execAsync('node scripts/switch-stack.js mern', { cwd: path.join(__dirname, '..') });
    console.log(chalk.green('✅ Initial stack (MERN) configured'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not set initial stack automatically'));
    console.log(chalk.white('   Run "npm run switch-stack -- --interactive" to select a stack'));
  }
};

// Main setup function
const setup = async () => {
  console.log(chalk.blue.bold('🚀 Setting up Modular Fullstack Application\n'));
  
  try {
    await createDirectories();
    await createConfigFiles();
    await createDockerConfigs();
    await installDependencies();
    await createInitialStack();
    
    console.log(chalk.green.bold('\n✅ Setup completed successfully!'));
    console.log(chalk.blue('\n🎉 Next steps:'));
    console.log(chalk.white('   1. Select your preferred stack:'));
    console.log(chalk.cyan('      npm run switch-stack -- --interactive'));
    console.log(chalk.white('   2. Start development:'));
    console.log(chalk.cyan('      npm run dev'));
    console.log(chalk.white('   3. View available stacks:'));
    console.log(chalk.cyan('      npm run list-stacks'));
    console.log(chalk.white('\n📚 Documentation: README.md'));
    
  } catch (error) {
    console.error(chalk.red('❌ Setup failed:'), error.message);
    process.exit(1);
  }
};

// Run setup
setup(); 