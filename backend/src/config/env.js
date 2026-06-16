const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`\nCRITICAL ERROR: The following required environment variables are missing: ${missingEnv.join(', ')}`);
  console.error('Please check your backend/.env file and define them.\n');
  process.exit(1);
}

// Function to auto-encode special characters in PostgreSQL password to avoid "Invalid URL" issues
function formatConnectionString(connectionString) {
  if (!connectionString) return connectionString;
  
  const match = connectionString.match(/^(postgresql:\/\/)([^:]+):(.*)@([^@]+)$/);
  if (match) {
    const protocol = match[1];
    const user = match[2];
    const password = match[3];
    const hostAndDb = match[4];
    
    // If the password is not already URL-encoded, encode it.
    const hasEncoding = /%[0-9A-Fa-f]{2}/.test(password);
    const encodedPassword = hasEncoding ? password : encodeURIComponent(password);
    
    return `${protocol}${user}:${encodedPassword}@${hostAndDb}`;
  }
  return connectionString;
}

const dbUrl = formatConnectionString(process.env.DATABASE_URL);

module.exports = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: dbUrl,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_SSL: process.env.DB_SSL === 'true',
  DB_CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
};
