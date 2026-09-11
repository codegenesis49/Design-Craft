import { useEffect, useMemo, useState } from 'react';
import { GlossaryText } from '../Glossary';
import { GraduationCap, RefreshCcw } from 'lucide-react';
import { StepProps } from '../Journey';
import { mindmapQuiz } from '../../content/mindmap';
import { flowchartQuiz } from '../../content/flowchart';
import { prepareQuiz, scoreQuiz, masteryLevel, topicsToRevisit, improvement } from '../../logic/quiz';
import { AttemptResult, QuizQuestion } from '../../types';
import { visualisationQuiz, wireframeQuiz } from '../../content/layoutTools';

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const r = 44, c = 2 * Math.PI * r;
  const colour = score >= 9 ? 'var(--teal)' : score >= 7 ? 'var(--primary)' : score >= 5 ? 'var(--amber)' : 'var(--red)';
  return (
    <svg className="score-ring" viewBox="0 0 108 108" role="img" aria-label={`Score ${score} out of ${total}, ${pct} percent`}>
      <circle cx={54} cy={54} r={r} fill="none" stroke="var(--border)" strokeWidth={10} />
      <circle cx={54} cy={54} r={r} fill="none" stroke={colour} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 54 54)" />
      <text x={54} y={50} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--ink)" fontFamily="var(--font-display)">{score}/{total}</text>
      <text x={54} y={70} textAnchor="middle" fontSize={13} fill="var(--ink-soft)">{pct}%</text>
    </svg>
  );
}

function AttemptForm({ bank, seed, onSubmit, title, draft, onDraft }: { draft?:Record<string,string>;onDraft:(a:Record<string,string>)=>void; bank: QuizQuestion[]; seed: number; onSubmit: (a: Record<string, string>) => void; title: string }) {
  const prepared = useMemo(() => prepareQuiz(bank, seed), [bank, seed]);
  const [answers, setAnswers] = useState<Record<string, string>>(draft ?? {});
  const allAnswered = prepared.every((q) => answers[q.id] !== undefined);
  return (
    <>
      <h2>{title}</h2>
      <p className="muted small">10 questions. Choose an answer for each — correct answers and explanations are revealed after you submit.</p>
      {prepared.map((q, qi) => (
        <fieldset key={q.id} style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.prompt}</legend>
          {q.shuffledOptions.map((opt) => (
            <button
              key={opt}
              className={`option-row ${answers[q.id] === opt ? 'selected' : ''}`}
              onClick={() => {const next={...answers,[q.id]:opt};setAnswers(next);onDraft(next);}}
              aria-pressed={answers[q.id] === opt}
            >
              {opt}
            </button>
          ))}
        </fieldset>
      ))}
      <button className="btn btn-primary" disabled={!allAnswered} onClick={() => onSubmit(answers)}
        data-tip={allAnswered ? undefined : 'Answer every question first'}>
        Submit answers
      </button>
    </>
  );
}

function AttemptReview({ bank, attempt, heading }: { bank: QuizQuestion[]; attempt: AttemptResult; heading: string }) {
  const topics = topicsToRevisit(bank, attempt);
  return (
    <>
      <div className="score-hero" style={{ marginBottom: 18 }}>
        <ScoreRing score={attempt.score} total={attempt.total} />
        <div>
          <h2 style={{ marginBottom: 4 }}>{heading}</h2>
          <span className={`badge ${attempt.score >= 7 ? 'badge-teal' : attempt.score >= 5 ? 'badge-amber' : 'badge-red'}`}>
            {masteryLevel(attempt.score)}
          </span>
          {topics.length > 0 ? (
            <p className="small muted" style={{ margin: '8px 0 0' }}>
              Topics to revisit in Read and Learn: <strong>{topics.join(', ')}</strong>
            </p>
          ) : (
            <p className="small muted" style={{ margin: '8px 0 0' }}>Nothing to revisit — every topic secure.</p>
          )}
        </div>
      </div>
      <h3>Every question, reviewed</h3>
      {bank.map((q, qi) => {
        const chosen = attempt.answers[q.id];
        const correct = chosen === q.options[q.answer];
        return (
          <div className="review-q" key={q.id}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span className={`badge ${correct ? 'badge-teal' : 'badge-red'}`}>{correct ? 'Correct' : 'Incorrect'}</span>
              <span className="badge badge-grey">{q.topic}</span>
            </div>
            <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>{qi + 1}. {q.prompt}</p>
            {!correct && <p className="small" style={{ margin: '0 0 2px' }}>Your answer: <span style={{ color: 'var(--red)' }}>{chosen}</span></p>}
            <p className="small" style={{ margin: '0 0 6px' }}>Correct answer: <strong>{q.options[q.answer]}</strong></p>
            <p className="small muted" style={{ margin: 0 }}><GlossaryText text={q.explanation}/></p>
          </div>
        );
      })}
    </>
  );
}

export default function QuizStep({ moduleId, record, update, setCanContinue }: StepProps) {
  const bank = moduleId === 'mindmap' ? mindmapQuiz : moduleId === 'flowchart' ? flowchartQuiz : moduleId === 'visualisation' ? visualisationQuiz : wireframeQuiz;
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const [retrying, setRetrying] = useState(false);
  const [view, setView] = useState<'first' | 'retry'>('retry');

  useEffect(() => { setCanContinue(record.firstScore != null); }, [record.firstScore, setCanContinue]);

  const submitFirst = (answers: Record<string, string>) => {
    const result = scoreQuiz(bank, answers);
    update({ firstScore: result, attemptNumber: 1, submittedAt: new Date().toISOString() });
    window.scrollTo({ top: 0 });
  };
  const submitRetry = (answers: Record<string, string>) => {
    const result = scoreQuiz(bank, answers);
    update({ retryScore: result, attemptNumber: 2 });
    setRetrying(false);
    window.scrollTo({ top: 0 });
  };

  const { firstScore, retryScore } = record;

  return (
    <div className="card card-pad">
      <div className="eyebrow"><GraduationCap size={12} style={{ verticalAlign: '-1px' }} /> Knowledge check</div>

      {!firstScore && <AttemptForm draft={record.quizDrafts?.first} onDraft={first=>update({quizDrafts:{...record.quizDrafts,first}})} bank={bank} seed={seed} onSubmit={submitFirst} title={`${moduleId === 'mindmap' ? 'Mind maps' : moduleId === 'flowchart' ? 'Flowcharts' : moduleId === 'visualisation' ? 'Visualisation diagrams' : 'Wireframes'}: knowledge check`} />}

      {firstScore && retrying && <AttemptForm draft={record.quizDrafts?.retry} onDraft={retry=>update({quizDrafts:{...record.quizDrafts,retry}})} bank={bank} seed={seed + 1} onSubmit={submitRetry} title="Retry: knowledge check" />}

      {firstScore && !retrying && (
        <>
          {retryScore && (
            <div className="note" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <strong>First attempt: {firstScore.score}/10</strong>
              <strong>Retry: {retryScore.score}/10</strong>
              <span className={`badge ${improvement(firstScore, retryScore)! > 0 ? 'badge-teal' : 'badge-grey'}`}>
                {improvement(firstScore, retryScore)! > 0 ? `Improved by ${improvement(firstScore, retryScore)}` : improvement(firstScore, retryScore)! === 0 ? 'Same score' : `Down by ${-improvement(firstScore, retryScore)!}`}
              </span>
              <span style={{ marginLeft: 'auto' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setView('first')} disabled={view === 'first'}>First attempt</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setView('retry')} disabled={view === 'retry'}>Retry</button>
              </span>
            </div>
          )}
          <AttemptReview
            bank={bank}
            attempt={retryScore && view === 'retry' ? retryScore : firstScore}
            heading={retryScore && view === 'retry' ? 'Retry result' : 'First attempt result'}
          />
          {!retryScore && (
            <div className="note" style={{ marginTop: 14 }}>
              <strong>One retry available.</strong> Read the feedback above first — then have another go with the questions and options reshuffled. Both scores are kept in your evidence.
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setRetrying(true); window.scrollTo({ top: 0 }); }}>
                  <RefreshCcw size={14} /> Retry after reviewing feedback
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
