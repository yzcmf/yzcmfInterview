#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

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

// List available stacks
const listStacks = () => {
  const config = loadStacksConfig();
  const currentStack = getCurrentStack();
  
  console.log(chalk.blue.bold('\n📦 Available Technology Stacks:\n'));
  
  Object.entries(config.stacks).forEach(([key, stack]) => {
    const isCurrent = key === currentStack;
    const status = isCurrent ? chalk.green('✓ CURRENT') : '';
    const name = isCurrent ? chalk.cyan.bold(stack.name) : chalk.cyan(stack.name);
    
    console.log(`${chalk.white(key.padEnd(20))} ${name} ${status}`);
    console.log(`${' '.repeat(20)} ${chalk.gray(stack.description)}`);
    console.log(`${' '.repeat(20)} ${chalk.yellow(`Frontend: ${stack.frontend} | Backend: ${stack.backend} | Database: ${stack.database}`)}`);
    console.log(`${' '.repeat(20)} ${chalk.blue(`Ports: ${stack.port.frontend}/${stack.port.backend}/${stack.port.database}`)}\n`);
  });
  
  if (!currentStack) {
    console.log(chalk.yellow('⚠️  No stack currently selected'));
    console.log(chalk.white('Use "npm run switch-stack -- --interactive" to select a stack\n'));
  }
  
  console.log(chalk.blue.bold('🛠️  Available Commands:'));
  console.log(chalk.white('   npm run switch-stack -- --interactive  - Select stack interactively'));
  console.log(chalk.white('   npm run switch-stack <stack-name>      - Switch to specific stack'));
  console.log(chalk.white('   npm run dev                            - Start development server'));
  console.log(chalk.white('   npm run current                        - Show current stack'));
  console.log(chalk.white('   npm run setup                          - Initial project setup\n'));
};

// Run the list command
listStacks(); 