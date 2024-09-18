"use server";

import { db } from "@/db";
import { applications } from "@/db/schema";
import { Application, NewApplication } from "@/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const create = async (
  params: Omit<NewApplication, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const id = nanoid();
  const res = await db
    .insert(applications)
    .values({
      id,
      message: params.message,
      jobId: params.jobId,
    })
    .returning();

  return JSON.stringify(res);
};

export const show = async (id: string): Promise<string> => {
  const res = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id));

  return JSON.stringify(res);
};

export const index = async (): Promise<string> => {
  const res = await db.query.applications.findMany();

  return JSON.stringify(res);
};

export const update = async (
  id: string,
  params: Partial<Omit<Application, "id" | "createdAt" | "jobId">>
): Promise<string> => {
  const res = await db
    .update(applications)
    .set({ ...params })
    .where(eq(applications.id, id))
    .returning();

  return JSON.stringify(res);
};

export const destroy = async (id: string) => {
  const deletedApplicationId: { deletedId: string }[] = await db
    .delete(applications)
    .where(eq(applications.id, id))
    .returning({ deletedId: applications.id });

  return JSON.stringify(deletedApplicationId);
};
