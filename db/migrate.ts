import env from "@/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const DB_URL = env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not set");
}

const migrationClient = new Client({
  connectionString: DB_URL,
});

const db: NodePgDatabase = drizzle(migrationClient);

const main = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

main();
