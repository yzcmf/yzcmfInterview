import { createServer, Server as HttpServer } from 'http';
import { logger } from './logger';

export interface PortManagerOptions {
  preferredPort?: number;
  fallbackPorts?: number[];
  host?: string;
}

export class PortManager {
  private preferredPort: number;
  private fallbackPorts: number[];
  private host: string;

  constructor(options: PortManagerOptions = {}) {
    this.preferredPort = options.preferredPort || 8000;
    this.fallbackPorts = options.fallbackPorts || [8002, 8003, 8004, 8005];
    this.host = options.host || '0.0.0.0';
  }

  /**
   * Check if a port is available
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = createServer();
      
      server.listen(port, this.host, () => {
        server.close();
        resolve(true);
      });

      server.on('error', () => {
        resolve(false);
      });
    });
  }

  /**
   * Find an available port from the preferred and fallback ports
   */
  async findAvailablePort(): Promise<number> {
    // First try the preferred port
    if (await this.isPortAvailable(this.preferredPort)) {
      logger.info(`Preferred port ${this.preferredPort} is available`);
      return this.preferredPort;
    }

    logger.warn(`Preferred port ${this.preferredPort} is not available, trying fallback ports...`);

    // Try fallback ports
    for (const port of this.fallbackPorts) {
      if (await this.isPortAvailable(port)) {
        logger.info(`Found available port: ${port}`);
        return port;
      }
      logger.debug(`Port ${port} is not available`);
    }

    // If no ports are available, throw an error
    const allPorts = [this.preferredPort, ...this.fallbackPorts];
    throw new Error(`No available ports found. Tried: ${allPorts.join(', ')}`);
  }

  /**
   * Start server on an available port
   */
  async startServerOnAvailablePort(
    server: HttpServer,
    callback?: (port: number) => void
  ): Promise<number> {
    const availablePort = await this.findAvailablePort();
    
    return new Promise((resolve, reject) => {
      server.listen(availablePort, this.host, () => {
        logger.info(`Server started successfully on port ${availablePort}`);
        if (callback) {
          callback(availablePort);
        }
        resolve(availablePort);
      });

      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`Port ${availablePort} is already in use`);
        } else {
          logger.error('Server error:', error);
        }
        reject(error);
      });
    });
  }
}

/**
 * Utility function to get available port
 */
export async function getAvailablePort(
  preferredPort: number = 8000,
  fallbackPorts: number[] = [8002, 8003, 8004, 8005]
): Promise<number> {
  const portManager = new PortManager({
    preferredPort,
    fallbackPorts
  });
  
  return portManager.findAvailablePort();
} 