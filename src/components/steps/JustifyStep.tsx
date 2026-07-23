import { useEffect, useState } from 'react';
import { PenLine } from 'lucide-react';
import { StepProps } from '../Journey';
import { JustificationAnswers } from '../../types';

const QUESTIONS: { key: keyof JustificationAnswers; label: string; keywords: string[] }[] = [
  {
    key: 'suitable',
    label: '1. Why was this design tool suitable?',
    keywords: ['organises', 'categories', 'central theme', 'connects ideas', 'sequence', 'decision', 'routes', 'standard symbols', 'paths towards a solution', 'audience'],
  },
  {
    key: 'helped',
    label: '2. How did it help you plan the product?',
    keywords: ['grouped', 'broke down', 'identified', 'users', 'inputs', 'outputs', 'accessibility', 'missing steps', 'error handling', 'before designing'],
  },
  {
    key: 'limitation',
    label: '3. Give one limitation of the tool.',
    keywords: ['crowded', 'hard for others to understand', 'not enough detail', 'no interface layout', 'complicated', 'symbols must be understood', 'crossing lines'],
  },
  {
    key: 'next',
    label: '4. Which design tool should be used next, and why?',
    keywords: ['wireframe', 'flowchart', 'visualisation diagram', 'mood board', 'screen layout', 'buttons and fields', 'process logic', 'visual theme'],
  },
];

const EXAMPLE =
  '“I used a Library mind map because it organises related information into categories. For example, I grouped the hospital system’s users, inputs, outputs and accessibility requirements before designing its interface.”';

function feedbackFor(text: string): string | null {
  const t = text.trim();
  if (t.length === 0) return null;
  if (t.length < 20) return 'Keep going — a sentence or two is expected.';
  if (!/because|so that|which means|as it/i.test(t)) return 'Strengthen this with a “because” statement that explains your reasoning.';
  if (!/hospital|patient|appointment|kiosk|reception/i.test(t)) return 'Good reasoning — now link it to the hospital project for the Example part of the scaffold.';
  return null;
}

export default function JustifyStep({ record, update, setCanContinue, moduleId }: StepProps) {
  const [answers, setAnswers] = useState<JustificationAnswers>(
    record.writtenJustification ?? { suitable: '', helped: '', limitation: '', next: '' }
  );

  const complete = QUESTIONS.every((q) => answers[q.key].trim().length >= 20);
  useEffect(() => { setCanContinue(complete); }, [complete, setCanContinue]);

  // debounce-save the writing
  useEffect(() => {
    const t = setTimeout(() => update({ writtenJustification: answers }), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const setAnswer = (key: keyof JustificationAnswers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  return (
    <div className="card card-pad">
      <div className="eyebrow"><PenLine size={12} style={{ verticalAlign: '-1px' }} /> Exam practice</div>
      <h2>Explain why your tool was suitable</h2>
      <p className="muted small">
        These are the kinds of questions OCR asks. Write your own answers — nothing is written for you. Use the scaffold:
      </p>
      <div className="note">
        <strong>Point</strong> — state the design decision. · <strong>Explanation</strong> — explain why it was suitable. · <strong>Example</strong> — link it to the project.
        <p className="small" style={{ margin: '6px 0 0' }}>Model shape (for a different question): {EXAMPLE}</p>
      </div>
      {QUESTIONS.map((q) => {
        const fb = feedbackFor(answers[q.key]);
        return (
          <div key={q.key} style={{ marginBottom: 18 }}>
            <label className="field-label" htmlFor={`j-${q.key}`} style={{ fontSize: '1rem' }}>{q.label}</label>
            <textarea
              id={`j-${q.key}`} className="text-input" rows={3}
              value={answers[q.key]}
              onChange={(e) => setAnswer(q.key, e.target.value)}
              placeholder="Write two or three sentences…"
            />
            <div className="small muted" style={{ marginTop: 5 }}>
              Useful keywords:{' '}
              {q.keywords.map((k) => (
                <button key={k} className="chip" onClick={() => setAnswer(q.key, (answers[q.key] + ' ' + k).trimStart())}>{k}</button>
              ))}
            </div>
            {fb && <div className="feedback bad" style={{ marginTop: 6 }}>{fb}</div>}
            {!fb && answers[q.key].trim().length >= 20 && (
              <div className="feedback good" style={{ marginTop: 6 }}>A clear point with reasoning linked to the project — well structured.</div>
            )}
          </div>
        );
      })}
      {!complete && <p className="small muted">Answer all four questions (a couple of sentences each) to continue.</p>}
    </div>
  );
}
