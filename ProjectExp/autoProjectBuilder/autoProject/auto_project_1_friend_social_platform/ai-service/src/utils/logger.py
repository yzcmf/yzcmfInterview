import logging
import sys
from typing import Optional

# Configure logging
def setup_logger(name: str = "ai-service", level: str = "INFO") -> logging.Logger:
    """Setup and return a configured logger"""
    logger = logging.getLogger(name)
    
    if not logger.handlers:  # Avoid duplicate handlers
        logger.setLevel(getattr(logging, level.upper()))
        
        # Create console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, level.upper()))
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(formatter)
        
        # Add handler to logger
        logger.addHandler(console_handler)
    
    return logger

# Create default logger instance
logger = setup_logger() 