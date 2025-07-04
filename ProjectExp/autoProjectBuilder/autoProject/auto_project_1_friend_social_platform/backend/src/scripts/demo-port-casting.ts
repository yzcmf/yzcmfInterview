import { getAvailablePort, PortManager } from '../utils/portManager';
import { createServer } from 'http';

async function demoPortCasting() {
  console.log('🚀 Port Casting Demonstration\n');

  // Step 1: Show initial port availability
  console.log('Step 1: Checking initial port availability...');
  try {
    const initialPort = await getAvailablePort(8000, [8002, 8003, 8004, 8005]);
    console.log(`✅ Initial available port: ${initialPort}\n`);
  } catch (error) {
    console.log('❌ No ports available initially\n');
    return;
  }

  // Step 2: Occupy port 8000
  console.log('Step 2: Occupying port 8000...');
  const blockingServer = createServer();
  
  try {
    blockingServer.listen(8000, () => {
      console.log('✅ Port 8000 is now occupied\n');
    });

    // Wait a moment for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Test port casting with 8000 occupied
    console.log('Step 3: Testing port casting with 8000 occupied...');
    const portManager = new PortManager({
      preferredPort: 8000,
      fallbackPorts: [8002, 8003, 8004, 8005]
    });

    const availablePort = await portManager.findAvailablePort();
    console.log(`✅ Port casting found available port: ${availablePort}\n`);

    // Step 4: Verify the port is actually available
    console.log('Step 4: Verifying the found port is actually available...');
    const testServer = createServer();
    
    try {
      await new Promise<void>((resolve, reject) => {
        testServer.listen(availablePort, () => {
          console.log(`✅ Successfully started test server on port ${availablePort}`);
          testServer.close(() => {
            console.log(`✅ Test server closed on port ${availablePort}\n`);
            resolve();
          });
        });

        testServer.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.log(`❌ Failed to start test server on port ${availablePort}:`, error);
    }

    console.log('🎉 Port casting demonstration completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Port 8000 was occupied');
    console.log('   - Port casting automatically found an available fallback port');
    console.log('   - The system gracefully handled the port conflict');

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  } finally {
    // Clean up
    blockingServer.close(() => {
      console.log('🧹 Cleanup: Blocking server closed');
    });
  }
}

// Run the demonstration
demoPortCasting(); 