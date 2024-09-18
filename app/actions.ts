"use server";

import { startJobApplication } from "@/services/job-application-spider";
import { startScraping } from "@/services/job-scraper";

export const scrapeJobs = (formData: FormData) => {
  const entryUrl = formData.get("entryUrl") as string;
  if (!entryUrl) {
    throw new Error("Entry URL is required");
  }

  startScraping(entryUrl);
};

export const applyToJobs = (jobs: any[]) => {
  startJobApplication(jobs);
};
