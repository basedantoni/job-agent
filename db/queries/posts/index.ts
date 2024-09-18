"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { Post, NewPost } from "@/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const create = async (
  params: Omit<NewPost, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const id = nanoid();

  try {
    // Your database operation here
    const post = await db
      .insert(posts)
      .values({
        id,
        website: params.website,
        shortDescription: params.shortDescription,
      })
      .returning();

    return JSON.stringify(post);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      // Handle unique constraint violation
      console.log("Attempted to insert a duplicate record");
      return JSON.stringify(error);
    } else {
      // Handle other types of errors
      console.error("An unexpected error occurred:", error);
      return JSON.stringify(error);
    }
  }
};

export const show = async (id: string): Promise<string> => {
  const res = await db.select().from(posts).where(eq(posts.id, id));

  return JSON.stringify(res);
};

export const index = async (): Promise<string> => {
  const res = await db.query.posts.findMany();

  return JSON.stringify(res);
};

export const update = async (
  id: string,
  params: Partial<Omit<Post, "id">>
): Promise<string> => {
  const res = await db
    .update(posts)
    .set({ ...params })
    .where(eq(posts.id, id))
    .returning();

  return JSON.stringify(res);
};

export const destroy = async (id: string) => {
  const deletedPostId: { deletedId: string }[] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ deletedId: posts.id });

  return JSON.stringify(deletedPostId);
};
