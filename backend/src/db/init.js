const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initDb() {
  console.log('Initializing TribeShop database...');
  
  try {
    // Read schema.sql and seed.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    // Drop existing tables to ensure a clean, matching schema
    console.log('Dropping conflicting tables if they exist...');
    await db.query('DROP TABLE IF EXISTS order_items CASCADE;');
    await db.query('DROP TABLE IF EXISTS orders CASCADE;');
    await db.query('DROP TABLE IF EXISTS products CASCADE;');
    await db.query('DROP TABLE IF EXISTS admin_users CASCADE;');
    
    console.log('Creating database tables and indexes...');
    await db.query(schemaSql);
    
    console.log('Seeding default administrator and initial products...');
    await db.query(seedSql);
    
    console.log('✓ Success: TribeShop database initialized and seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err.stack || err.message);
    process.exit(1);
  }
}

initDb();
