import { z } from 'zod/v3';

const sourceSchema = z.object({
  label: z.string().describe('Source name/description'),
  url: z.string().describe('URL of the source'),
  credibility: z.enum(['High', 'Medium', 'Low', 'Uncertain']).describe('Most likely level of source credibility'),
}).describe('A source used to verify the claim') ?? null;

const bulletPoint = z.object({
  title: z.string().describe('Title of the bullet point'),
  content: z.string().describe('Summary of the bullet point'),
  sources: z.array(sourceSchema).nullable().describe('Provide a list of sources ONLY if sources are real and not invented, otherwise return null'),
});

export const factCheckResponseSchema = z.object({
  title: z.string().describe('The fact-checked claim summarized and formatted as a question'),
  introduction: z.string().describe(`
A brief introduction announcing you chiming in and the topic you are going to look into and why (examples: "Hey, [username], that is an interesting claim and might be worth looking into!", "This is actually a controversial topic known to be represented in conflicting ways, so let's shed some light on it!"
`
  ),
  bulletPoints: z.array(bulletPoint).describe('A list of bullet points summarizing key findings from the fact-check') ?? [],
  verdict: z.enum(['True', 'False', 'Uncertain', 'Mixed']).describe(`
The final verdict of the claim's accuracy
(True: Claim turned out to be true
False: Claim turned out to be false
Uncertain: Claim could not be verified
Mixed: Claim had both true and false elements (use sparingly, default to true or false if claim is mostly true or false, respectively))
`
  ),
  reliability: z.enum(['High', 'Medium', 'Low']).describe(`
How reliable the verdict is based on the findings
(High: The claim was verified with high confidence
Medium: The claim was verified with some confidence, but a slightly underwhelming amount of information on the subject
Low: The claim was verified with low confidence, it was challenging to find information on the subject, conflicting information was found, or the sources were questionable)
`
  ),
});
