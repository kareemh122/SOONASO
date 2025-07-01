const db = require('./db');

async function testConnection() {
  try {
    const conn = await db.getConnection();
    console.log('✅ Database connection successful!');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}

testConnection();