"use server";

import { db } from "@/db";
import { companies } from "@/db/schema";

export const createCompany = async () => {
  const res = await db.insert(companies).values({
    title: "Test",
  });

  return JSON.stringify(res);
};

export const getAllCompanies = async () => {
  const res = await db.query.companies.findMany();

  return JSON.stringify(res);
};
