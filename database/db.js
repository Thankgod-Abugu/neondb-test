import pg from "pg";
import "dotenv/config";
import { attachDatabasePool } from "@vercel/functions";

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000, // give up (with an error) after for 10s of not able to connect to db instead of hanging
});

attachDatabasePool(db);

export default db;
