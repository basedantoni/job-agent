import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { loginToYCombinator } from "@/services/job-scraper";
import { generateOutreach } from "./openai/generate-outreach";
import { update as updateJob } from "@/db/queries/jobs";
import { update as updateCompany } from "@/db/queries/companies";
import { create as createApplication } from "@/db/queries/applications";

export const startJobApplication = async (jobs: any[]) => {
  const browser = await puppeteer.launch({
    headless: process.env.USE_HEADLESS_BROWSER === "true",
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();

  // Visit first url to login
  await page.goto(jobs[0].url);
  await page.waitForSelector("a.inline-flex");
  await page.click("a.inline-flex");

  await loginToYCombinator(page);

  for (const job of jobs) {
    await page.goto(job.url);

    // Wait for the div with class 'bg-beige-lighter' to be present
    await page.waitForSelector("div.company-details");

    // Get the HTML content of the page
    const content = await page.content();

    // Use cheerio to parse the HTML and extract the div
    const $ = cheerio.load(content);
    const jobDescription = $("div.company-details").text().trim();

    // call ai to create personalized message
    const { output } = await generateOutreach(job.title, jobDescription);

    // Wait for the 'Apply' button to be visible
    await page.waitForSelector("[id^=ApplyButton]", { visible: true });

    // Click the 'Apply' button
    await page.click("[id^=ApplyButton]");

    // Wait for the application form to load
    await page.waitForSelector("textarea", { visible: true });

    await page.type("textarea", output);

    await page.click("button.ml-3.bg-orange-500");

    // Create and Update entities
    await createApplication({ message: output, jobId: job.id });

    await updateJob(job.id, {
      applied: true,
      updatedAt: new Date(),
    });

    await updateCompany(job.companyId, {
      updatedAt: new Date(),
      appliedAt: new Date(),
    });
  }

  //   await browser.close();
};
