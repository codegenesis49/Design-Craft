import { AttemptResult, QuizQuestion } from '../types';

export type MasteryLevel = 'Mastered' | 'Secure' | 'Developing' | 'Review Read and Learn';

export function masteryLevel(score: number): MasteryLevel {
  if (score >= 9) return 'Mastered';
  if (score >= 7) return 'Secure';
  if (score >= 5) return 'Developing';
  return 'Review Read and Learn';
}

/** Deterministic seeded shuffle (Fisher–Yates with mulberry32). */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = items.slice();
  let a = seed >>> 0;
  const rand = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface PreparedQuestion extends QuizQuestion {
  shuffledOptions: string[];
}

/** Randomise question order and option order (unless a question opts out). */
export function prepareQuiz(bank: QuizQuestion[], seed: number): PreparedQuestion[] {
  return seededShuffle(bank, seed).map((q, i) => ({
    ...q,
    shuffledOptions: q.fixedOrder ? q.options.slice() : seededShuffle(q.options, seed + i * 97 + 13),
  }));
}

/** answers: question id -> chosen option text */
export function scoreQuiz(bank: QuizQuestion[], answers: Record<string, string>): AttemptResult {
  let score = 0;
  for (const q of bank) {
    if (answers[q.id] === q.options[q.answer]) score++;
  }
  return { score, total: bank.length, answers, at: new Date().toISOString() };
}

export function topicsToRevisit(bank: QuizQuestion[], attempt: AttemptResult): string[] {
  const topics = new Set<string>();
  for (const q of bank) {
    if (attempt.answers[q.id] !== q.options[q.answer]) topics.add(q.topic);
  }
  return [...topics];
}

export function improvement(first: AttemptResult | null, retry: AttemptResult | null): number | null {
  if (!first || !retry) return null;
  return retry.score - first.score;
}
