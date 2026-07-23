import { useEffect, useState } from 'react';
import { StepProps } from '../Journey';
import { typeCards } from '../../content/mindmap';
import { MindMapType } from '../../types';

/** Miniature visual example for each mind-map type. */
function MiniMap({ type }: { type: MindMapType }) {
  const stroke = 'var(--ink-soft)';
  const node = (x: number, y: number, w: number, fill: string, key?: string) => (
    <rect key={key} x={x - w / 2} y={y - 9} width={w} height={18} rx={9} fill={fill} stroke={stroke} strokeWidth={1} />
  );
  if (type === 'library') {
    const pts: [number, number][] = [[40, 20], [180, 20], [40, 90], [180, 90]];
    return (
      <svg viewBox="0 0 220 110" role="img" aria-label="Library mind map example: a central topic with four category branches" style={{ width: '100%', height: 'auto' }}>
        {pts.map(([x, y], i) => <line key={i} x1={110} y1={55} x2={x} y2={y} stroke={stroke} strokeWidth={1.2} />)}
        {node(110, 55, 64, 'var(--primary-tint)')}
        {pts.map(([x, y], i) => node(x, y, 52, '#fff', `n${i}`))}
        <text x={110} y={59} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink)">Topic</text>
        {['Users', 'Inputs', 'Outputs', 'Access'].map((t, i) => (
          <text key={t} x={pts[i][0]} y={pts[i][1] + 3.5} textAnchor="middle" fontSize="8" fill="var(--ink)">{t}</text>
        ))}
      </svg>
    );
  }
  if (type === 'tunnel') {
    return (
      <svg viewBox="0 0 220 110" role="img" aria-label="Tunnel Timeline example: a central problem with paths of actions leading towards the solution" style={{ width: '100%', height: 'auto' }}>
        <line x1={60} y1={55} x2={128} y2={22} stroke={stroke} strokeWidth={1.2} />
        <line x1={60} y1={55} x2={128} y2={55} stroke={stroke} strokeWidth={1.2} />
        <line x1={60} y1={55} x2={128} y2={88} stroke={stroke} strokeWidth={1.2} />
        <line x1={128} y1={22} x2={190} y2={22} stroke={stroke} strokeWidth={1.2} />
        <line x1={128} y1={55} x2={190} y2={55} stroke={stroke} strokeWidth={1.2} />
        <rect x={18} y={40} width={84} height={30} rx={15} fill="var(--primary-tint)" stroke={stroke} />
        <text x={60} y={53} textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink)">Problem to</text>
        <text x={60} y={63} textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--ink)">solve</text>
        {[22, 55, 88].map((y, i) => <rect key={y} x={104} y={y - 8} width={48} height={16} rx={8} fill="#fff" stroke={stroke} />)}
        {['Path A', 'Path B', 'Path C'].map((t, i) => (
          <text key={t} x={128} y={[22, 55, 88][i] + 3} textAnchor="middle" fontSize="8" fill="var(--ink)">{t}</text>
        ))}
        {[22, 55].map((y) => <rect key={y} x={168} y={y - 7} width={44} height={14} rx={7} fill="#fff" stroke={stroke} />)}
        {['Action', 'Action'].map((t, i) => (
          <text key={i} x={190} y={[22, 55][i] + 3} textAnchor="middle" fontSize="7.5" fill="var(--ink)">{t}</text>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 110" role="img" aria-label="Presentation mind map example: a topic with ordered sections and sub-points for an audience" style={{ width: '100%', height: 'auto' }}>
      {[35, 110, 185].map((x) => <line key={x} x1={110} y1={30} x2={x} y2={70} stroke={stroke} strokeWidth={1.2} />)}
      <line x1={35} y1={70} x2={35} y2={95} stroke={stroke} strokeWidth={1.2} />
      <line x1={110} y1={70} x2={110} y2={95} stroke={stroke} strokeWidth={1.2} />
      <rect x={74} y={18} width={72} height={22} rx={11} fill="var(--primary-tint)" stroke={stroke} />
      <text x={110} y={32} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--ink)">Topic</text>
      {[35, 110, 185].map((x, i) => (
        <g key={x}>
          <rect x={x - 28} y={62} width={56} height={16} rx={8} fill="#fff" stroke={stroke} />
          <text x={x} y={73} textAnchor="middle" fontSize="8" fill="var(--ink)">{`Section ${i + 1}`}</text>
        </g>
      ))}
      {[35, 110].map((x) => (
        <g key={x}>
          <rect x={x - 24} y={90} width={48} height={13} rx={6.5} fill="#fff" stroke={stroke} />
          <text x={x} y={99.5} textAnchor="middle" fontSize="7.5" fill="var(--ink)">Sub-point</text>
        </g>
      ))}
    </svg>
  );
}

const SUITABILITY_Q = {
  prompt:
    'Your first task in the hospital project is to organise the brief: group the users, inputs, outputs and accessibility requirements. Which mind-map type is the best match?',
  options: ['Library', 'Tunnel Timeline', 'Presentation'] as const,
  answer: 0,
  feedback: {
    correct:
      'Library is correct because it sorts and organises collected information into categories, giving you a clear reference before you start designing.',
    wrong:
      'A Library mind map is the best match because this task is about sorting collected information into categories. A Tunnel Timeline is mainly for showing paths towards solving a problem, and a Presentation map organises ideas for an audience.',
  },
};

export default function TypeSelectStep({ record, update, setCanContinue }: StepProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null || record.selectedMindMapType != null;

  useEffect(() => { setCanContinue(record.selectedMindMapType != null); }, [record.selectedMindMapType, setCanContinue]);

  return (
    <div className="card card-pad">
      <div className="eyebrow">Mind-map type</div>
      <h2>Choose the right type for the job</h2>
      <p className="muted small">
        OCR R050 names three types of mind map. Answer the suitability question first, then choose the type you will build.
      </p>

      <div className="note" style={{ marginBottom: 14 }}>
        <strong>Suitability check.</strong> {SUITABILITY_Q.prompt}
        <div style={{ marginTop: 10 }}>
          {SUITABILITY_Q.options.map((opt, i) => {
            let cls = 'option-row';
            if (answered && i === SUITABILITY_Q.answer) cls += ' correct';
            else if (picked !== null && i === picked && picked !== SUITABILITY_Q.answer) cls += ' wrong';
            return (
              <button key={opt} className={cls} disabled={answered && picked === null ? true : picked !== null} onClick={() => setPicked(i)}>
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`feedback ${picked === SUITABILITY_Q.answer ? 'good' : 'bad'}`} style={{ marginBottom: 0 }}>
            {picked === SUITABILITY_Q.answer ? SUITABILITY_Q.feedback.correct : SUITABILITY_Q.feedback.wrong}
          </div>
        )}
      </div>

      <div className="choice-grid" aria-label="Mind-map types">
        {typeCards.map((c) => (
          <button
            key={c.type}
            className={`choice-card ${record.selectedMindMapType === c.type ? 'selected' : ''}`}
            disabled={!answered}
            data-tip={!answered ? 'Answer the suitability check first' : undefined}
            onClick={() => update({ selectedMindMapType: c.type })}
            aria-pressed={record.selectedMindMapType === c.type}
          >
            <h3 style={{ margin: 0 }}>{c.name}</h3>
            <div className="mini-example"><MiniMap type={c.type} /></div>
            <p className="small" style={{ margin: 0 }}>{c.definition}</p>
            <div className="small"><strong>Use it for:</strong>
              <ul style={{ margin: '4px 0 0' }}>{c.whenToUse.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
            <div className="small"><strong>Suitable scenario:</strong> <span className="muted">{c.scenario}</span></div>
            <div className="small"><strong>Not suitable for:</strong> <span className="muted">{c.unsuitable}</span></div>
          </button>
        ))}
      </div>
      {record.selectedMindMapType && (
        <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
          Selected: <strong>{typeCards.find((t) => t.type === record.selectedMindMapType)?.name}</strong>. The builder’s prompts and checklist will adapt to this type.
        </p>
      )}
    </div>
  );
}
