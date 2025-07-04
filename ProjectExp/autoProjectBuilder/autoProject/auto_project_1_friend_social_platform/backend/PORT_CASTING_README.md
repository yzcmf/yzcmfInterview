# Port Casting Functionality

This backend now includes intelligent port casting functionality that automatically finds an available port if the preferred port is already in use.

## How It Works

The port casting system will try ports in the following order:
1. **Preferred Port**: 8000 (or the port specified in `PORT` environment variable)
2. **Fallback Ports**: 8002, 8003, 8004, 8005

If port 8000 is not available, the system will automatically try ports 8002-8005 until it finds an available one.

## Usage

### Automatic Port Casting (Default Behavior)

The server will automatically use port casting when started:

```bash
# Development mode with automatic port casting
npm run dev

# Production mode with automatic port casting
npm start
```

### Manual Port Testing

You can test the port casting functionality:

```bash
# Test port casting logic
npm run test:port-casting
```

### Environment Variables

You can customize the port casting behavior using environment variables:

```bash
# Set preferred port (default: 8000)
PORT=8001

# The system will try: 8001, 8002, 8003, 8004, 8005
```

## Implementation Details

### PortManager Class

The `PortManager` class provides the core functionality:

```typescript
import { PortManager } from './utils/portManager';

const portManager = new PortManager({
  preferredPort: 8000,
  fallbackPorts: [8002, 8003, 8004, 8005]
});

// Find an available port
const availablePort = await portManager.findAvailablePort();

// Start server on available port
await portManager.startServerOnAvailablePort(server, (port) => {
  console.log(`Server started on port ${port}`);
});
```

### Utility Functions

```typescript
import { getAvailablePort } from './utils/portManager';

// Quick way to get an available port
const port = await getAvailablePort(8000, [8002, 8003, 8004, 8005]);
```

## Logging

The system provides detailed logging about port availability:

- ✅ `Preferred port 8000 is available` - When the preferred port is free
- ⚠️ `Preferred port 8000 is not available, trying fallback ports...` - When falling back
- ✅ `Found available port: 8002` - When a fallback port is found
- ❌ `No available ports found. Tried: 8000, 8002, 8003, 8004, 8005` - When no ports are available

## Error Handling

If no ports are available, the system will:
1. Log an error with all attempted ports
2. Exit the process with code 1
3. Provide clear error messages for debugging

## Benefits

1. **Automatic Recovery**: No manual intervention needed when ports are busy
2. **Flexible Configuration**: Easy to customize preferred and fallback ports
3. **Clear Logging**: Detailed information about port selection process
4. **Robust Error Handling**: Graceful handling of port conflicts
5. **Development Friendly**: Works seamlessly in development environments with multiple services 