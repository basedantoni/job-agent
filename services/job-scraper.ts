import "server-only";

import * as cheerio from "cheerio";
import puppeteer, { Page } from "puppeteer";
import { Company, Job, JobPost } from "@/types";

/**
 * Selects options from a dropdown given a clickable dropdown,
 * querySelector for options, and title of option to select.
 * @param {Page} page - The Puppeteer Page object.
 * @param {string} clickableElement - The selector for the clickable dropdown element.
 * @param {string} selector - The selector for the dropdown options.
 * @param {string} optionTitle - The title of the option to select.
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

/**
 * Handles the login process for YCombinator.
 * @param {Page} page - The Puppeteer Page object.
 */
const loginToYCombinator = async (page: Page) => {
  await page.waitForSelector("#sign-in-card");
  await page.type("#ycid-input", (process.env.YC_USERNAME as string) || "");
  await page.type("#password-input", (process.env.YC_PASSWORD as string) || "");
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
};

/**
 * Applies the necessary filters for job search.
 * @param {Page} page - The Puppeteer Page object.
 */
const applyFilters = async (page: Page) => {
  await selectOptions(page, "#role", '[id^="react-select-"]', "Engineering");
  const experienceLevels = [
    "0 - 1 years exp",
    "1 - 3 years exp",
    "3 - 6 years exp",
  ];
  for (const level of experienceLevels) {
    await selectOptions(page, "#minExperience", '[id^="react-select-"]', level);
  }
};

/**
 * Retrieves the directory items from the page.
 * @param {Page} page - The Puppeteer Page object.
 * @returns {Promise<string[]>} An array of HTML strings representing directory items.
 */
const getDirectoryItems = async (page: Page) => {
  return page.evaluate(() => {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return [];
    return Array.from(directoryList.children)
      .filter((child) => !child.classList.contains("loading"))
      .map((child) => child.outerHTML);
  });
};

/**
 * Waits for the directory list to load on the page.
 * @param {Page} page - The Puppeteer Page object.
 */
const waitForDirectoryList = async (page: Page) => {
  await page.waitForSelector(".directory-list");
  await page.waitForFunction(() => {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return false;
    const children = directoryList.children;
    return (
      children.length > 1 ||
      (children.length === 1 && !children[0].classList.contains("loading"))
    );
  });
};

/**
 * Parses a single job post item.
 * @param {string} item - The HTML string of the job post item.
 * @returns {Promise<JobPost>} A promise that resolves to a JobPost object.
 */
const parseJobPost = async (item: string): Promise<JobPost> => {
  const $ = await cheerio.load(item);
  const title = $("span.company-name").text().trim();
  const jobNames = $("div.job-name")
    .map((_, el) => $(el).text().trim())
    .get();
  const jobUrls = $("a.hover\\:underline")
    .map((_, el) => $(el).attr("href"))
    .get();

  const jobs: Job[] = jobNames.map((title, index) => ({
    title,
    applied: false,
    url: jobUrls[index] || "",
  }));

  const company: Company = { title, applied: false };
  const website = $("a").attr("href") || "";
  const shortDescription = $(".mt-3.text-gray-700").text().trim();

  return { company, jobs, website, shortDescription };
};

/**
 * Starts the scraping process for job posts.
 * @param {string} url - The URL to scrape job posts from.
 * @returns {Promise<JobPost[]>} A promise that resolves to an array of JobPost objects.
 */
export const startScraping = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: process.env.USE_HEADLESS_BROWSER === "true",
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto(url);

  await loginToYCombinator(page);
  await applyFilters(page);
  await waitForDirectoryList(page);

  let jobPosts: JobPost[] = [];
  let hasMoreEntries = true;

  while (hasMoreEntries) {
    const directoryItems = await getDirectoryItems(page);

    for (const item of directoryItems) {
      const jobPost = await parseJobPost(item);
      jobPosts.push(jobPost);
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newDirectoryItems = await getDirectoryItems(page);
    hasMoreEntries = newDirectoryItems.length > directoryItems.length;
  }

  //   await browser.close();
  return jobPosts;
};
