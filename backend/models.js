const pool = require('./db');

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS car_parts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      last_maintenance_date DATE NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
  console.log('Tables created');
}

createTables();