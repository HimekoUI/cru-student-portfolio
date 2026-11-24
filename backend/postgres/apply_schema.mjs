import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(
  path.resolve(process.cwd(), "package.json")
);
const { neon } = require("@neondatabase/serverless");

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m);
if (!match) {
  throw new Error("DATABASE_URL not found in .env.local");
}

const sql = neon(match[1]);
const schemaPath = path.resolve(process.cwd(), "../backend/postgres/001_initial_schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");
const stmts = schema
  .split(/;\s*\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

for (const s of stmts) {
  await sql.query(s);
}

const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`;
const skills = await sql`SELECT name, category FROM public.skills ORDER BY name`;
console.log("Tables:", tables.map((t) => t.table_name));
console.log("Skills count:", skills.length);
