import { configuration } from '../../config';
import openAI from '../openAI';
import type { Moderation } from 'openai/resources/moderations';
import { reviewModeration } from './reviewmoderation';

const moderation = openAI.moderations;

type ModerationCategory = keyof Moderation.CategoryScores;

type ModerationRule = {
  reviewThreshold: number;
  blockThreshold: number;
  hardBlock?: boolean;
};

type ModerationEntry = {
  category: ModerationCategory;
  score: number;
  flagged: boolean;
  appliedInputTypes: Array<'text' | 'image'>;
  reviewThreshold: number;
  blockThreshold: number;
  hardBlock: boolean;
};

const moderationRules: Record<ModerationCategory, ModerationRule> = {
  harassment: { reviewThreshold: 0.35, blockThreshold: 0.82 },
  'harassment/threatening': { reviewThreshold: 0.18, blockThreshold: 0.5 },
  hate: { reviewThreshold: 0.25, blockThreshold: 0.7 },
  'hate/threatening': { reviewThreshold: 0.12, blockThreshold: 0.35, hardBlock: true },
  illicit: { reviewThreshold: 0.2, blockThreshold: 0.55 },
  'illicit/violent': { reviewThreshold: 0.1, blockThreshold: 0.35, hardBlock: true },
  'self-harm': { reviewThreshold: 0.15, blockThreshold: 0.45 },
  'self-harm/instructions': { reviewThreshold: 0.08, blockThreshold: 0.25, hardBlock: true },
  'self-harm/intent': { reviewThreshold: 0.08, blockThreshold: 0.2, hardBlock: true },
  sexual: { reviewThreshold: 0.45, blockThreshold: 0.8 },
  'sexual/minors': { reviewThreshold: 0.02, blockThreshold: 0.05, hardBlock: true },
  violence: { reviewThreshold: 0.35, blockThreshold: 0.78 },
  'violence/graphic': { reviewThreshold: 0.18, blockThreshold: 0.48 },
};

const summarizeEntries = (entries: ModerationEntry[]) =>
  entries.map(({ category, score, flagged, appliedInputTypes }) => ({
    category,
    score: Number(score.toFixed(3)),
    flagged,
    appliedInputTypes,
  }));

export const moderate = async (input: string) => {
  try {
    const response = await moderation.create({
      model: configuration.MODERATION_MODEL || 'omni-moderation-latest',
      input,
    });
    const result = response.results?.[0];

    if (!result) {
      return [];
    }

    const categories = result.categories as Partial<Record<ModerationCategory, boolean | null>>;
    const categoryScores = result.category_scores as Partial<Record<ModerationCategory, number>>;
    const appliedInputTypes =
      result.category_applied_input_types as Partial<
        Record<ModerationCategory, Array<'text' | 'image'>>
      >;

    const relevantEntries = (Object.keys(moderationRules) as ModerationCategory[])
      .map((category) => {
        const rule = moderationRules[category];

        return {
          category,
          score: categoryScores[category] ?? 0,
          flagged: categories[category] === true,
          appliedInputTypes: appliedInputTypes[category] ?? [],
          reviewThreshold: rule.reviewThreshold,
          blockThreshold: rule.blockThreshold,
          hardBlock: Boolean(rule.hardBlock),
        };
      })
      .filter(({ flagged, score, reviewThreshold }) => flagged || score >= reviewThreshold)
      .sort((left, right) => right.score - left.score);

    if (relevantEntries.length === 0) {
      return [];
    }

    const hardBlockEntries = relevantEntries.filter(
      ({ hardBlock, flagged, score, blockThreshold }) =>
        hardBlock && (flagged || score >= blockThreshold)
    );

    if (hardBlockEntries.length > 0) {
      console.warn('Moderation hard block triggered', {
        inputPreview: input.slice(0, 200),
        categories: summarizeEntries(hardBlockEntries),
      });
      return '__BLOCK__';
    }

    const reviewEntries = relevantEntries.filter(
      ({ hardBlock, score, blockThreshold }) => !hardBlock && score >= blockThreshold
    );

    if (reviewEntries.length > 0) {
      return reviewModeration(
        input,
        reviewEntries.map(({ category, score }) => ({ category, score }))
      );
    }

    const borderlineEntries = relevantEntries.filter(({ flagged }) => flagged);

    if (borderlineEntries.length > 0) {
      console.warn('Moderation borderline flag allowed', {
        inputPreview: input.slice(0, 200),
        categories: summarizeEntries(borderlineEntries),
      });
    }

    return [];
  } catch (error) {
    console.error('Moderation error:', error);
    throw new Error('Moderation failed');
  }
  return [];
};
