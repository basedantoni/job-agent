import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import env from "@/env";

const openai = createOpenAI({
  compatibility: "strict", // strict mode, enable when using the OpenAI API
  apiKey: env.OPENAI_API_KEY,
});

export const o1Preview = openai("o1-preview");
export const gpt4o = openai("gpt-4o");
