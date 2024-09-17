import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  website: varchar("website", { length: 256 }),
  shortDescription: varchar("short_description", { length: 256 }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const companies = pgTable(
  "companies",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    appliedAt: timestamp("applied_at"),
    postId: integer("post_id").references(() => posts.id),
  },
  (companies) => {
    return {
      titleIndex: uniqueIndex("title_idx").on(companies.title),
    };
  }
);

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }),
  url: varchar("url", { length: 256 }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  companyId: integer("company_id").references(() => companies.id),
});
