import { getAvailablePort, PortManager } from '../utils/portManager';

async function testPortCasting() {
  console.log('Testing port casting functionality...\n');

  try {
    // Test 1: Get available port
    console.log('Test 1: Getting available port...');
    const availablePort = await getAvailablePort(8000, [8002, 8003, 8004, 8005]);
    console.log(`✅ Available port found: ${availablePort}\n`);

    // Test 2: Create PortManager instance
    console.log('Test 2: Creating PortManager instance...');
    const portManager = new PortManager({
      preferredPort: 8000,
      fallbackPorts: [8002, 8003, 8004, 8005]
    });
    console.log('✅ PortManager created successfully\n');

    // Test 3: Find available port using PortManager
    console.log('Test 3: Finding available port using PortManager...');
    const port = await portManager.findAvailablePort();
    console.log(`✅ PortManager found available port: ${port}\n`);

    console.log('🎉 All tests passed! Port casting is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testPortCasting(); 