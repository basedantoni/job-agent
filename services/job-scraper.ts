import "server-only";

import * as cheerio from "cheerio";
import puppeteer, { Page } from "puppeteer";
import { Company, Job, JobPost } from "@/types";

/* 
Selects options from dropdown given a clickable dropdown,
querySelector for options, and title of option to select
*/
const selectOptions = async (
  page: Page,
  clickableElement: string,
  selector: string,
  optionTitle: string
) => {
  await page.click(clickableElement);
  // Wait for dropdown to be visible
  await page.waitForSelector(selector, { visible: true });
  // Find and click the option
  await page.evaluate(
    (selector, optionTitle) => {
      const options = Array.from(document.querySelectorAll(selector));
      const option = options.find(
        (option) => option.textContent?.trim() === optionTitle
      );
      if (option) {
        (option as HTMLElement).click();
      } else {
        throw new Error(`${optionTitle} option not found`);
      }
    },
    selector,
    optionTitle
  );
};

export const startScraping = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: process.env.USE_HEADLESS_BROWSER === "true",
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the content to load
  await page.waitForSelector("#sign-in-card");

  // Use Puppeteer to input username and password
  await page.type("#ycid-input", (process.env.YC_USERNAME as string) || "");
  await page.type("#password-input", (process.env.YC_PASSWORD as string) || "");

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation after form submission
  await page.waitForNavigation();

  // Filter
  await selectOptions(page, "#role", '[id^="react-select-"]', "Engineering");
  await selectOptions(
    page,
    "#minExperience",
    '[id^="react-select-"]',
    "0 - 1 years exp"
  );
  await selectOptions(
    page,
    "#minExperience",
    '[id^="react-select-"]',
    "1 - 3 years exp"
  );
  await selectOptions(
    page,
    "#minExperience",
    '[id^="react-select-"]',
    "3 - 6 years exp"
  );

  // Wait for the list to load
  await page.waitForSelector(".directory-list");

  // Wait for actual directory items to appear
  await page.waitForFunction(() => {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return false;
    const children = directoryList.children;
    return (
      children.length > 1 ||
      (children.length === 1 && !children[0].classList.contains("loading"))
    );
  });

  // Create an array of children of the div element with the class 'directory-list'
  let directoryItems = await page.evaluate(() => {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return [];
    return Array.from(directoryList.children)
      .filter((child) => !child.classList.contains("loading"))
      .map((child) => child.outerHTML);
  });

  let jobPosts: JobPost[] = [];

  let hasMoreEntries = true;
  while (hasMoreEntries) {
    for (const item of directoryItems) {
      const $ = await cheerio.load(item);
      // Get Job Title
      const title = $("span.company-name").text().trim();
      console.log("title: %s", title);

      // Get Job Name
      const jobNames = $("div.job-name")
        .map((_, el) => $(el).text().trim())
        .get();
      console.log("Job titles:", jobNames);

      // Get Application URL
      const jobUrls = $("a.hover\\:underline")
        .map((_, el) => $(el).attr("href"))
        .get();
      console.log("Job URLs:", jobUrls);

      const jobs: Job[] = jobNames.map((title, index) => ({
        title,
        applied: false,
        url: jobUrls[index] || "",
      }));

      const company: Company = {
        title,
        applied: false,
      };

      const website = $("a").attr("href") || "";
      const shortDescription = $(".mt-3.text-gray-700").text().trim();

      const jobPost: JobPost = {
        company,
        jobs,
        website,
        shortDescription,
      };

      jobPosts.push(jobPost);
    }

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for potential new content to load

    // Check if there are more entries
    const newDirectoryItems = await page.evaluate(() => {
      const directoryList = document.querySelector(".directory-list");
      if (!directoryList) return [];
      return Array.from(directoryList.children)
        .filter((child) => !child.classList.contains("loading"))
        .map((child) => child.outerHTML);
    });

    if (newDirectoryItems.length > directoryItems.length) {
      directoryItems = newDirectoryItems;
    } else {
      hasMoreEntries = false;
    }
  }

  await browser.close();
};
