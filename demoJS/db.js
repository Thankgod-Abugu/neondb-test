import pg from "pg";
import "dotenv/config";
import { attachDatabasePool } from "@vercel/functions";

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000, // give up (with an error) after 10s instead of hanging
});

attachDatabasePool(db);

export default db;
