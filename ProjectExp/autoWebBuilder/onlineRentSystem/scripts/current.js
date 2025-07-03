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

// Show current stack
const showCurrentStack = () => {
  const config = loadStacksConfig();
  const currentStack = getCurrentStack();
  
  if (currentStack && config.stacks[currentStack]) {
    const stack = config.stacks[currentStack];
    
    console.log(chalk.green.bold(`\n✅ Current Stack: ${stack.name}`));
    console.log(chalk.white(`   Description: ${stack.description}`));
    console.log('');
    console.log(chalk.blue.bold('🔧 Technology Stack:'));
    console.log(chalk.white(`   Frontend: ${chalk.cyan(stack.frontend)} (port ${stack.port.frontend})`));
    console.log(chalk.white(`   Backend:  ${chalk.cyan(stack.backend)} (port ${stack.port.backend})`));
    console.log(chalk.white(`   Database: ${chalk.cyan(stack.database)} (port ${stack.port.database})`));
    console.log('');
    console.log(chalk.blue.bold('🚀 Quick Start:'));
    console.log(chalk.white('   npm run dev'));
    console.log('');
    console.log(chalk.blue.bold('🔄 Switch Stack:'));
    console.log(chalk.white('   npm run switch-stack -- --interactive'));
    console.log(chalk.white(`   npm run switch-stack <stack-name>`));
    console.log('');
    console.log(chalk.blue.bold('📋 View All Stacks:'));
    console.log(chalk.white('   npm run list-stacks'));
    
  } else {
    console.log(chalk.yellow('\n⚠️  No stack currently selected'));
    console.log(chalk.white('\nTo select a stack:'));
    console.log(chalk.cyan('   npm run switch-stack -- --interactive'));
    console.log(chalk.white('\nTo view available stacks:'));
    console.log(chalk.cyan('   npm run list-stacks'));
  }
};

// Run the current command
showCurrentStack(); 