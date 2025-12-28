import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'doctor.db');
let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS valuations (
      id TEXT PRIMARY KEY,
      fiscal_year TEXT NOT NULL,
      company_name TEXT NOT NULL,
      person_in_charge TEXT NOT NULL,
      employees TEXT NOT NULL,
      total_assets TEXT NOT NULL,
      sales TEXT NOT NULL,
      current_period_net_asset REAL NOT NULL,
      previous_period_net_asset REAL NOT NULL,
      net_asset_tax_value REAL NOT NULL,
      current_period_profit REAL NOT NULL,
      previous_period_profit REAL NOT NULL,
      previous_previous_period_profit REAL NOT NULL,
      investors TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
