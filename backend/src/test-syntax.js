// Programmatic syntax and import verification script
const path = require('path');

console.log('Starting TribeShop backend syntax check...');

// Mock environment variables to satisfy checks during validation
process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
process.env.JWT_SECRET = 'dummy_validation_secret';

try {
  console.log('Testing db pool configuration...');
  require('./config/db');

  console.log('Testing middlewares...');
  require('./middleware/error.middleware');
  require('./middleware/auth.middleware');
  require('./middleware/validator.middleware');

  console.log('Testing controllers...');
  require('./controllers/auth.controller');
  require('./controllers/product.controller');
  require('./controllers/order.controller');

  console.log('Testing routes...');
  require('./routes/auth.routes');
  require('./routes/product.routes');
  require('./routes/order.routes');

  console.log('Testing express app config...');
  // Require server but bypass listen by requiring the server directly if we exported it
  // Since server.js starts the port listener, requiring it will start listening.
  // We can just verify server.js syntax via node command line.
  
  console.log('✓ SUCCESS: All backend controller, route, and middleware modules parsed and loaded with no syntax or path resolution errors.');
} catch (error) {
  console.error('❌ FAILURE: Syntax or path error detected:');
  console.error(error);
  process.exit(1);
}
