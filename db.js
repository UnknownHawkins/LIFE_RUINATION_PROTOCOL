const { createClient } = require('@libsql/client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

let db = null;
let libsqlClient = null;

if (useTurso) {
    console.log('Connecting to Turso online database at:', process.env.TURSO_DATABASE_URL);
    libsqlClient = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN
    });
} else {
    const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || 'database.db');
    console.log('Connecting to local SQLite database at:', dbPath);
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Could not connect to local database', err);
        }
    });
}

// Helper function to run query returning all rows
const query = (sql, params = []) => {
    if (useTurso) {
        return libsqlClient.execute({ sql, args: params }).then(res => res.rows);
    } else {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Helper function to run query returning a single row
const get = (sql, params = []) => {
    if (useTurso) {
        return libsqlClient.execute({ sql, args: params }).then(res => res.rows[0]);
    } else {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

// Helper function to execute queries like INSERT, UPDATE, DELETE
const run = (sql, params = []) => {
    if (useTurso) {
        return libsqlClient.execute({ sql, args: params }).then(res => {
            const lastId = res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : null;
            return { id: lastId, changes: res.rowsAffected };
        });
    } else {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
};

// Initialize schema
const initDb = async () => {
    try {
        await run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await run(`
            CREATE TABLE IF NOT EXISTS progress (
                user_id INTEGER PRIMARY KEY,
                social INTEGER DEFAULT 0,
                financial INTEGER DEFAULT 0,
                professional INTEGER DEFAULT 0,
                health INTEGER DEFAULT 0,
                current_day INTEGER DEFAULT 1,
                completed_tasks TEXT NOT NULL DEFAULT '[]',
                earned_achievements TEXT NOT NULL DEFAULT '[]',
                custom_plan TEXT DEFAULT '[]',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Migration for existing databases: add custom_plan if missing
        try {
            await run('ALTER TABLE progress ADD COLUMN custom_plan TEXT DEFAULT "[]"');
            console.log('Database migrated: added custom_plan column.');
        } catch (migrationErr) {
            // Ignore error if column already exists
        }

        console.log('Database tables initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database tables:', error);
        throw error;
    }
};

module.exports = {
    db,
    query,
    get,
    run,
    initDb
};
