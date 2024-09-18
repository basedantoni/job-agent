"use server";

import { generateText } from "ai";
import { gpt4o } from "@/services/openai";

export const generateOutreach = async (
  jobTitle: string,
  jobDescription: string
) => {
  const { text } = await generateText({
    model: gpt4o,
    system:
      "You are Anthony Mercado, a software engineer in search of a job. " +
      "You write clear and concise messages to hiring managers. " +
      "The message should begin with 'Dear Hiring Manager' " +
      `The message should like the following:
        Best regards,
        Anthony Mercado
        email: anthony.mercado300@gmail.com
        github: https://github.com/basedantoni
        linkedin: https://www.linkedin.com/in/anthony-mercado/` +
      "\nGiven a job description and a skillset, try to craft personalized messages and highlight tools or skills that you have to those listed in the job description. Try to keep a casual tone." +
      `\nHere are your skills and tools: Vue, Next.js, React, TypeScript, JavaScript ES6+, PHP, Laravel, Nestjs, Google Cloud Platform, AWS, Big Query, PostgreSQL, Swift, Git, Node JS, HTML 5, CSS 3, SCSS, Tailwind, Bootstrap, TypeScript, JavaScript, Node.js, React.js, Angular, Vue.js, Three.js, React Three Fiber, Scrum, Agile, Object-Oriented Programming ` +
      "Here is your previous experience: Software Engineer - Developed and implemented Atmosphere Playlists, contributing to a significant increase in viewership by approximately 30% across a network of over 60,000 venues. Upgraded customer portal from Vue 2 to Vue 3, enhancing developer workflow. Redesigned dashboard to display essential user metrics, improving user experience. Played a key role in a network-wide venue audit, resulting in achieving Vistar Accelerate Certification. " +
      "Here is your contact information: email - anthony.mercado300@gmail.com, github - https://github.com/basedantoni, linkedin - https://www.linkedin.com/in/anthony-mercado/" +
      "\nDo not claim to have experience in any skills or tools outside of what I have given you. " +
      "Do not mention skills that are not in the job description. " +
      "Do not leave any contact information besides email, github, and linkedin.",
    prompt: `Write a message to the hiring manager for this role ${jobTitle} for this job description: ${jobDescription}`,
  });

  console.log(text);

  return { output: text };
};
