#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { Command } = require('commander');
const inquirer = require('inquirer');

const program = new Command();

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

// Save current stack
const saveCurrentStack = (stackName) => {
  const currentStackPath = path.join(__dirname, '../.current-stack');
  fs.writeFileSync(currentStackPath, stackName);
};

// List available stacks
const listStacks = () => {
  const config = loadStacksConfig();
  const currentStack = getCurrentStack();
  
  console.log(chalk.blue.bold('\n📦 Available Stacks:\n'));
  
  Object.entries(config.stacks).forEach(([key, stack]) => {
    const isCurrent = key === currentStack;
    const status = isCurrent ? chalk.green('✓ CURRENT') : '';
    console.log(`${chalk.cyan(key.padEnd(20))} ${chalk.white(stack.name)} ${status}`);
    console.log(`${' '.repeat(20)} ${chalk.gray(stack.description)}`);
    console.log(`${' '.repeat(20)} ${chalk.yellow(`Frontend: ${stack.frontend} | Backend: ${stack.backend} | Database: ${stack.database}`)}\n`);
  });
};

// Interactive stack selection
const selectStack = async () => {
  const config = loadStacksConfig();
  const currentStack = getCurrentStack();
  
  const choices = Object.entries(config.stacks).map(([key, stack]) => ({
    name: `${stack.name} - ${stack.description}`,
    value: key,
    checked: key === currentStack
  }));
  
  const { selectedStack } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedStack',
      message: 'Select a stack to switch to:',
      choices
    }
  ]);
  
  return selectedStack;
};

// Switch to a specific stack
const switchToStack = async (stackName) => {
  const config = loadStacksConfig();
  
  if (!config.stacks[stackName]) {
    console.error(chalk.red(`❌ Stack "${stackName}" not found!`));
    console.log(chalk.yellow('Use --list to see available stacks'));
    process.exit(1);
  }
  
  const stack = config.stacks[stackName];
  const currentStack = getCurrentStack();
  
  if (currentStack === stackName) {
    console.log(chalk.yellow(`⚠️  Already using stack: ${stack.name}`));
    return;
  }
  
  console.log(chalk.blue(`🔄 Switching to ${stack.name}...`));
  
  try {
    // Stop current processes if running
    await stopCurrentProcesses();
    
    // Update environment variables
    await updateEnvironment(stack);
    
    // Install dependencies for new stack
    await installDependencies(stack);
    
    // Update configuration files
    await updateConfigurations(stack);
    
    // Save current stack
    saveCurrentStack(stackName);
    
    console.log(chalk.green(`✅ Successfully switched to ${stack.name}!`));
    console.log(chalk.blue(`\n🚀 To start development:`));
    console.log(chalk.white(`   npm run dev`));
    console.log(chalk.blue(`\n📊 Stack Info:`));
    console.log(chalk.white(`   Frontend: ${stack.frontend} (port ${stack.port.frontend})`));
    console.log(chalk.white(`   Backend: ${stack.backend} (port ${stack.port.backend})`));
    console.log(chalk.white(`   Database: ${stack.database} (port ${stack.port.database})`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error switching stack:'), error.message);
    process.exit(1);
  }
};

// Stop current processes
const stopCurrentProcesses = async () => {
  console.log(chalk.gray('Stopping current processes...'));
  
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    // Kill processes on common ports
    const ports = [3000, 5000, 8000, 8080, 5173];
    for (const port of ports) {
      try {
        await execAsync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
      } catch (error) {
        // Ignore errors if no process is running
      }
    }
  } catch (error) {
    console.log(chalk.yellow('Warning: Could not stop all processes'));
  }
};

// Update environment variables
const updateEnvironment = async (stack) => {
  console.log(chalk.gray('Updating environment variables...'));
  
  const envPath = path.join(__dirname, '../.env');
  let envContent = '';
  
  // Add stack-specific environment variables
  Object.entries(stack.env).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });
  
  // Add common environment variables
  envContent += `CURRENT_STACK=${stack.name}\n`;
  envContent += `FRONTEND_PORT=${stack.port.frontend}\n`;
  envContent += `BACKEND_PORT=${stack.port.backend}\n`;
  envContent += `DATABASE_PORT=${stack.port.database}\n`;
  
  fs.writeFileSync(envPath, envContent);
};

// Install dependencies for the new stack
const installDependencies = async (stack) => {
  console.log(chalk.gray('Installing dependencies...'));
  
  const { exec } = require('child_process');
  const util = require('util');
  const execAsync = util.promisify(exec);
  
  try {
    // Install frontend dependencies
    const frontendPath = path.join(__dirname, `../frontends/${stack.frontend}`);
    if (fs.existsSync(frontendPath)) {
      console.log(chalk.gray(`Installing frontend dependencies (${stack.frontend})...`));
      await execAsync('npm install', { cwd: frontendPath });
    }
    
    // Install backend dependencies
    const backendPath = path.join(__dirname, `../backends/${stack.backend}`);
    if (fs.existsSync(backendPath)) {
      console.log(chalk.gray(`Installing backend dependencies (${stack.backend})...`));
      await execAsync('npm install', { cwd: backendPath });
    }
    
    // Install root dependencies
    console.log(chalk.gray('Installing root dependencies...'));
    await execAsync('npm install', { cwd: path.join(__dirname, '..') });
    
  } catch (error) {
    console.log(chalk.yellow('Warning: Some dependencies may not have installed correctly'));
  }
};

// Update configuration files
const updateConfigurations = async (stack) => {
  console.log(chalk.gray('Updating configurations...'));
  
  // Update package.json scripts based on stack
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = fs.readJsonSync(packagePath);
  
  // Update dev script based on stack
  switch (stack.backend) {
    case 'nextjs':
    case 'trpc':
      packageJson.scripts.dev = 'concurrently "npm run dev:frontend" "npm run dev:backend"';
      packageJson.scripts['dev:frontend'] = `cd frontends/${stack.frontend} && npm run dev`;
      packageJson.scripts['dev:backend'] = `cd backends/${stack.backend} && npm run dev`;
      break;
    case 'fastapi':
      packageJson.scripts.dev = 'concurrently "npm run dev:frontend" "npm run dev:backend"';
      packageJson.scripts['dev:frontend'] = `cd frontends/${stack.frontend} && npm run dev`;
      packageJson.scripts['dev:backend'] = `cd backends/${stack.backend} && python -m uvicorn main:app --reload`;
      break;
    case 'springboot':
      packageJson.scripts.dev = 'concurrently "npm run dev:frontend" "npm run dev:backend"';
      packageJson.scripts['dev:frontend'] = `cd frontends/${stack.frontend} && npm run dev`;
      packageJson.scripts['dev:backend'] = `cd backends/${stack.backend} && ./mvnw spring-boot:run`;
      break;
    default:
      packageJson.scripts.dev = 'concurrently "npm run dev:frontend" "npm run dev:backend"';
      packageJson.scripts['dev:frontend'] = `cd frontends/${stack.frontend} && npm run dev`;
      packageJson.scripts['dev:backend'] = `cd backends/${stack.backend} && npm run dev`;
  }
  
  fs.writeJsonSync(packagePath, packageJson, { spaces: 2 });
};

// CLI Commands
program
  .name('switch-stack')
  .description('Switch between different technology stacks')
  .version('1.0.0');

program
  .command('list')
  .alias('ls')
  .description('List all available stacks')
  .action(listStacks);

program
  .command('current')
  .description('Show current stack')
  .action(() => {
    const currentStack = getCurrentStack();
    const config = loadStacksConfig();
    
    if (currentStack && config.stacks[currentStack]) {
      const stack = config.stacks[currentStack];
      console.log(chalk.green(`\n✅ Current Stack: ${stack.name}`));
      console.log(chalk.white(`   Description: ${stack.description}`));
      console.log(chalk.white(`   Frontend: ${stack.frontend} (port ${stack.port.frontend})`));
      console.log(chalk.white(`   Backend: ${stack.backend} (port ${stack.port.backend})`));
      console.log(chalk.white(`   Database: ${stack.database} (port ${stack.port.database})`));
    } else {
      console.log(chalk.yellow('\n⚠️  No stack currently selected'));
      console.log(chalk.white('Use "switch-stack <stack-name>" to select a stack'));
    }
  });

program
  .argument('[stack-name]', 'Name of the stack to switch to')
  .option('-i, --interactive', 'Interactive mode')
  .description('Switch to a different stack')
  .action(async (stackName, options) => {
    if (options.interactive || !stackName) {
      stackName = await selectStack();
    }
    
    if (stackName) {
      await switchToStack(stackName);
    }
  });

// Parse command line arguments
program.parse(); 