import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey().notNull(),
    website: varchar("website", { length: 256 }).notNull(),
    shortDescription: varchar("short_description", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (posts) => {
    return {
      websiteIndex: uniqueIndex("website_idx").on(posts.website),
    };
  }
);

export const companies = pgTable(
  "companies",
  {
    id: text("id").primaryKey().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    appliedAt: timestamp("applied_at"),
    postId: text("post_id").references(() => posts.id),
  },
  (companies) => {
    return {
      titleIndex: uniqueIndex("title_idx").on(companies.title),
    };
  }
);

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey().notNull(),
  title: varchar("title", { length: 256 }),
  url: varchar("url", { length: 256 }).notNull(),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  companyId: text("company_id").references(() => companies.id),
});

export const applications = pgTable("applications", {
  id: text("id").primaryKey().notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  jobId: text("job_id").references(() => jobs.id),
});
