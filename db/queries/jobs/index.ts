"use server";

import { db } from "@/db";
import { jobs } from "@/db/schema";
import { Job, NewJob } from "@/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const create = async (
  params: Omit<NewJob, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const id = nanoid();
  const res = await db
    .insert(jobs)
    .values({
      id,
      url: params.url,
      title: params.title,
      companyId: params.companyId,
    })
    .returning();

  return JSON.stringify(res);
};

export const show = async (id: string): Promise<string> => {
  const res = await db.select().from(jobs).where(eq(jobs.id, id));

  return JSON.stringify(res);
};

export const index = async (): Promise<string> => {
  const res = await db.query.jobs.findMany();

  return JSON.stringify(res);
};

export const update = async (
  id: string,
  params: Omit<Job, "id" | "companyId">
): Promise<string> => {
  const res = await db
    .update(jobs)
    .set({ ...params })
    .where(eq(jobs.id, id))
    .returning();

  return JSON.stringify(res);
};

export const destroy = async (id: string) => {
  const deletedJobId: { deletedId: string }[] = await db
    .delete(jobs)
    .where(eq(jobs.id, id))
    .returning({ deletedId: jobs.id });

  return JSON.stringify(deletedJobId);
};
