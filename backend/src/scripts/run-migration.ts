import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'stackpilot123',
    database: 'stackpilot-db',
  });

  try {
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '../database/migrations/004_create_services_tables.sql'),
      'utf8'
    );

    const statements = sqlFile.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
};

runMigration();
