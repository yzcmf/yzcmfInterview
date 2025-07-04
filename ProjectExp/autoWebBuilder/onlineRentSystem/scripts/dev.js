#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

// Load stack configuration
const loadStacksConfig = () => {
  try {
    const configPath = path.join(__dirname, '../config/stacks.json');
    return fs.readJsonSync(configPath);
  } catch (error) {
    console.error(chalk.red('Error loading stack configuration:'), error.message);
    process.exit(1);
  }
};

// Get current stack
const getCurrentStack = () => {
  try {
    const currentStackPath = path.join(__dirname, '../.current-stack');
    if (fs.existsSync(currentStackPath)) {
      return fs.readFileSync(currentStackPath, 'utf8').trim();
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Start development servers
const startDev = async () => {
  const config = loadStacksConfig();
  const currentStack = getCurrentStack();
  
  if (!currentStack) {
    console.log(chalk.yellow('⚠️  No stack currently selected'));
    console.log(chalk.white('Please select a stack first:'));
    console.log(chalk.cyan('   npm run switch-stack -- --interactive'));
    process.exit(1);
  }
  
  if (!config.stacks[currentStack]) {
    console.error(chalk.red(`❌ Current stack "${currentStack}" not found in configuration`));
    process.exit(1);
  }
  
  const stack = config.stacks[currentStack];
  
  console.log(chalk.blue.bold(`🚀 Starting development for ${stack.name}`));
  console.log(chalk.gray(`   Frontend: ${stack.frontend} (port ${stack.port.frontend})`));
  console.log(chalk.gray(`   Backend: ${stack.backend} (port ${stack.port.backend})`));
  console.log(chalk.gray(`   Database: ${stack.database} (port ${stack.port.database})`));
  console.log('');
  
  // Start database if needed
  await startDatabase(stack);
  
  // Start backend
  const backendProcess = await startBackend(stack);
  
  // Start frontend
  const frontendProcess = await startFrontend(stack);
  
  // Handle process termination
  const cleanup = () => {
    console.log(chalk.yellow('\n🛑 Shutting down development servers...'));
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  // Handle process errors
  backendProcess?.on('error', (error) => {
    console.error(chalk.red('Backend error:'), error.message);
  });
  
  frontendProcess?.on('error', (error) => {
    console.error(chalk.red('Frontend error:'), error.message);
  });
};

// Start database
const startDatabase = async (stack) => {
  console.log(chalk.gray('Starting database...'));
  
  const { exec } = require('child_process');
  const util = require('util');
  const execAsync = util.promisify(exec);
  
  try {
    switch (stack.database) {
      case 'postgresql':
        // Check if PostgreSQL is running
        try {
          await execAsync('pg_isready -h localhost -p 5432');
          console.log(chalk.green('✅ PostgreSQL is running'));
        } catch (error) {
          console.log(chalk.yellow('⚠️  PostgreSQL not running. Please start it manually:'));
          console.log(chalk.white('   brew services start postgresql (macOS)'));
          console.log(chalk.white('   sudo systemctl start postgresql (Linux)'));
        }
        break;
        
      case 'mongodb':
        // Check if MongoDB is running
        try {
          await execAsync('mongosh --eval "db.runCommand({ping: 1})" --quiet');
          console.log(chalk.green('✅ MongoDB is running'));
        } catch (error) {
          console.log(chalk.yellow('⚠️  MongoDB not running. Please start it manually:'));
          console.log(chalk.white('   brew services start mongodb-community (macOS)'));
          console.log(chalk.white('   sudo systemctl start mongod (Linux)'));
        }
        break;
        
      case 'sqlite':
        console.log(chalk.green('✅ SQLite database ready'));
        break;
        
      default:
        console.log(chalk.yellow(`⚠️  Database ${stack.database} not configured for auto-start`));
    }
  } catch (error) {
    console.log(chalk.yellow('Warning: Could not verify database status'));
  }
};

// Start backend
const startBackend = async (stack) => {
  console.log(chalk.gray(`Starting backend (${stack.backend})...`));
  
  const backendPath = path.join(__dirname, `../backends/${stack.backend}`);
  
  if (!fs.existsSync(backendPath)) {
    console.log(chalk.yellow(`⚠️  Backend directory not found: ${backendPath}`));
    console.log(chalk.white('   Backend will not be started'));
    return null;
  }
  
  let command, args;
  
  switch (stack.backend) {
    case 'nodejs':
    case 'nextjs':
    case 'trpc':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    case 'fastapi':
      command = 'python';
      args = ['-m', 'uvicorn', 'main:app', '--reload', '--port', stack.port.backend];
      break;
      
    case 'springboot':
      command = './mvnw';
      args = ['spring-boot:run'];
      break;
      
    case 'nuxt':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    case 'svelte':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    case 'astro':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    case 'remix':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    case 'solid':
      command = 'npm';
      args = ['run', 'dev'];
      break;
      
    default:
      console.log(chalk.yellow(`⚠️  Backend type ${stack.backend} not configured`));
      return null;
  }
  
  const backendProcess = spawn(command, args, {
    cwd: backendPath,
    stdio: 'pipe',
    shell: true
  });
  
  backendProcess.stdout.on('data', (data) => {
    console.log(chalk.blue(`[Backend] ${data.toString().trim()}`));
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.log(chalk.red(`[Backend Error] ${data.toString().trim()}`));
  });
  
  return backendProcess;
};

// Start frontend
const startFrontend = async (stack) => {
  console.log(chalk.gray(`Starting frontend (${stack.frontend})...`));
  
  const frontendPath = path.join(__dirname, `../frontends/${stack.frontend}`);
  
  if (!fs.existsSync(frontendPath)) {
    console.log(chalk.yellow(`⚠️  Frontend directory not found: ${frontendPath}`));
    console.log(chalk.white('   Frontend will not be started'));
    return null;
  }
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'pipe',
    shell: true
  });
  
  frontendProcess.stdout.on('data', (data) => {
    console.log(chalk.green(`[Frontend] ${data.toString().trim()}`));
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.log(chalk.red(`[Frontend Error] ${data.toString().trim()}`));
  });
  
  return frontendProcess;
};

// Start the development environment
startDev().catch((error) => {
  console.error(chalk.red('❌ Error starting development:'), error.message);
  process.exit(1);
}); 