import dotenv from 'dotenv';
import path from 'path';
import { Database } from "bun:sqlite";

dotenv.config();
const dbPath = process.env.DB_PATH as string;
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true }); 
}
 
const db = new Database(dbPath, (err: any)=> {
    if (err) return console.error(err.message);
});

export default db;