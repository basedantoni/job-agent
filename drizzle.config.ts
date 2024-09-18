import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import env from "@/env";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB_URL,
  },
  migrations: {
    table: "migrations",
    schema: "public",
  },
  verbose: true,
  strict: true,
});
