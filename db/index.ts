import { Pool } from "pg";
import * as schema from "@/db/schema";
import env from "@/env";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: env.DB_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  logger: true,
});
