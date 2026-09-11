import { GlossaryContent } from '../Glossary';
import { useEffect } from 'react';
import { Compass, LifeBuoy, Rocket } from 'lucide-react';
import { StepProps } from '../Journey';
import { SupportLevel } from '../../types';

const LEVELS: { id: SupportLevel; name: string; icon: JSX.Element; points: string[] }[] = [
  {
    id: 'guided', name: 'Guided', icon: <Compass size={20} />,
    points: [
      'The central topic is supplied for you',
      'One prompt at a time explains which component to add',
      'Relevant categories are suggested',
      'You can only finish once the essentials are in place',
    ],
  },
  {
    id: 'supported', name: 'Supported', icon: <LifeBuoy size={20} />,
    points: [
      'Optional idea cards you can add with one click',
      'Hints and a live checklist while you build',
      'You write your own content',
    ],
  },
  {
    id: 'independent', name: 'Independent', icon: <Rocket size={20} />,
    points: [
      'Just the brief and an empty canvas',
      'You construct the complete design yourself',
      'The checklist is still there when you want to review',
    ],
  },
];

export default function SupportSelectStep({ record, update, setCanContinue, moduleId }: StepProps) {
  useEffect(() => { setCanContinue(record.supportLevel != null); }, [record.supportLevel, setCanContinue]);
  return (
    <GlossaryContent><div className="card card-pad">
      <div className="eyebrow">Support level</div>
      <h2>How much support would you like?</h2>
      <p className="muted small">Pick the level that fits how confident you feel. Your choice is recorded in your saved evidence.</p>
      {(moduleId === 'wireframe' || moduleId === 'visualisation') && <div className="note small">In Guided mode, the element palette and live checklist explain what to add. The tool gives support but does not complete the design for you.</div>}
      <div className="choice-grid">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`choice-card ${record.supportLevel === l.id ? 'selected' : ''}`}
            onClick={() => update({ supportLevel: l.id })}
            aria-pressed={record.supportLevel === l.id}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--primary-deep)' }}>
              {l.icon}<h3 style={{ margin: 0 }}>{l.name}</h3>
            </div>
            <ul className="small" style={{ marginBottom: 0 }}>
              {l.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </button>
        ))}
      </div>
    </div></GlossaryContent>
  );
}
