const db = require('./db');

const createTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS car_parts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      date_acquired DATE NOT NULL,
      replacement_date DATE NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
};
createTables();