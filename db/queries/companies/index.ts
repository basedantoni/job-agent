"use server";

import { db } from "@/db";
import { companies } from "@/db/schema";
import { Company, NewCompany } from "@/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const create = async (
  params: Omit<NewCompany, "id" | "createdAt" | "updatedAt" | "appliedAt">
): Promise<string> => {
  const id = nanoid();
  const company = await db
    .insert(companies)
    .values({
      id,
      title: params.title,
      postId: params.postId,
    })
    .returning();

  return JSON.stringify(company);
};

export const show = async (id: string): Promise<string> => {
  const res = await db.select().from(companies).where(eq(companies.id, id));

  return JSON.stringify(res);
};

export const index = async (): Promise<string> => {
  const res = await db.query.companies.findMany();

  return JSON.stringify(res);
};

export const update = async (
  id: string,
  params: Omit<Company, "id" | "postId">
): Promise<string> => {
  const res = await db
    .update(companies)
    .set({ ...params })
    .where(eq(companies.id, id))
    .returning();

  return JSON.stringify(res);
};

export const destroy = async (id: string) => {
  const deletedCompanyId: { deletedId: string }[] = await db
    .delete(companies)
    .where(eq(companies.id, id))
    .returning({ deletedId: companies.id });

  return JSON.stringify(deletedCompanyId);
};
