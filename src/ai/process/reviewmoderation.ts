import { configuration } from '../../config';
import openAI from '../openAI';

export type FlaggedContent = {
  category: string;
  score: number;
}

export const reviewModeration = async (input: string, flags: FlaggedContent[]) => {
  const moderationReviewModel = configuration.MODERATION_REVIEW_MODEL;
  const moderationReviewInstructions = configuration.MODERATION_REVIEW_INSTRUCTIONS;

  if (!moderationReviewModel || !moderationReviewInstructions) {
    throw new Error('Missing moderation review configuration.');
  }

  const review = await openAI.responses.create({
    model: moderationReviewModel,
    instructions: moderationReviewInstructions,
    input: [
      {
        role: 'system',
        content: `
        ${ flags.map(flag => `Category: ${ flag.category } | Score: ${ flag.score }`).join('\n') }
        Flagged content:
        "${ input }"`
      }
    ]
  })
  return review.output_text
}
