import { useEffect, useState } from 'react';
import { ListChecks } from 'lucide-react';
import { StepProps } from '../Journey';
import { mindmapQuickCheck, QuickQuestion } from '../../content/mindmap';
import { flowchartQuickCheck } from '../../content/flowchart';

export default function QuickCheckStep({ moduleId, record, update, setCanContinue }: StepProps) {
  const questions: QuickQuestion[] = moduleId === 'mindmap' ? mindmapQuickCheck : flowchartQuickCheck;
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  useEffect(() => {
    setCanContinue(record.quickCheckDone || allAnswered);
    if (allAnswered && !record.quickCheckDone) update({ quickCheckDone: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAnswered, record.quickCheckDone]);

  return (
    <div className="card card-pad">
      <div className="eyebrow"><ListChecks size={12} style={{ verticalAlign: '-1px' }} /> Check Your Understanding</div>
      <h2>Quick check before you build</h2>
      <p className="muted small">Answer each question — you get instant feedback, and these do not count towards your knowledge-check score.</p>
      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const answered = chosen !== undefined;
        return (
          <fieldset key={q.id} style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
            <legend style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.prompt}</legend>
            {q.options.map((opt, oi) => {
              let cls = 'option-row';
              if (answered && oi === q.answer) cls += ' correct';
              else if (answered && oi === chosen) cls += ' wrong';
              return (
                <button
                  key={oi}
                  className={cls}
                  disabled={answered}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                >
                  {opt}
                </button>
              );
            })}
            {answered && (
              <div className={`feedback ${chosen === q.answer ? 'good' : 'bad'}`}>
                {chosen === q.answer ? 'Correct. ' : 'Not quite. '}{q.feedback}
              </div>
            )}
          </fieldset>
        );
      })}
      {record.quickCheckDone && !allAnswered && (
        <p className="small muted">You have completed this check before — answer again to refresh your memory, or continue.</p>
      )}
    </div>
  );
}
