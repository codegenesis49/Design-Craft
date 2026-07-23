import { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { StepProps } from '../Journey';
import { validateMindmap } from '../../logic/validateMindmap';
import { validateFlowchart } from '../../logic/validateFlowchart';
import { ChecklistPanel } from '../builderShared';
import { validateLayout } from '../../logic/validateLayout';

const HOSPITAL_MODEL_FLOW = [
  'Start (terminator)',
  'Display welcome screen (output)',
  'Input appointment reference (input)',
  'Input date of birth (input)',
  'Check details (process)',
  'Decision: Are the details valid? — No: display an error and allow another attempt (loop back); Yes: continue',
  'Retrieve appointment (process)',
  'Decision: Was an appointment found? — No: display help instructions; Yes: continue',
  'Display the appointment (output)',
  'Ask the patient to confirm (process)',
  'Output confirmation (output)',
  'End (terminator)',
];

const HOSPITAL_MODEL_MAP = [
  'Central topic: Hospital appointment system',
  'Purpose — find appointments, confirm attendance, reduce queues',
  'Users — patients, elderly visitors, wheelchair users, reception staff',
  'Inputs — appointment reference, date of birth, confirmation tap',
  'Outputs — appointment details, confirmation message, help instructions',
  'Accessibility — large text, high contrast, audio support, lowered screen',
  'Hardware — touchscreen kiosk, receipt printer, speaker',
  'Security — no personal data left on screen, session timeout',
];
const HOSPITAL_MODEL_VIS = ['Heading: Find your hospital appointment','Calm blue and teal colour theme','Photograph or hospital graphic','Short instructions in large, readable text','Clearly positioned call to action','Annotations for font sizes, image size, colours and spacing'];
const HOSPITAL_MODEL_WIRE = ['Hospital logo and screen title','Short accessible instructions','Appointment reference input','Date of birth input','Find appointment button','Clear or Back button','Help and accessibility controls','Area for results and confirmation'];

export default function ReviewStep({ moduleId, record, update, setCanContinue }: StepProps) {
  const art = record.artifactData ?? { nodes: [], edges: [] };
  const results = useMemo(
    () => (moduleId === 'mindmap'
      ? validateMindmap(art, record.selectedMindMapType ?? 'library')
      : moduleId === 'flowchart' ? validateFlowchart(art) : validateLayout(art,moduleId)),
    [art, moduleId, record.selectedMindMapType]
  );
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    update({ checklistResults: results });
    setCanContinue(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fails = results.filter((r) => r.status === 'fail').length;
  const warns = results.filter((r) => r.status === 'warn').length;

  return (
    <div className="card card-pad">
      <div className="eyebrow"><ClipboardCheck size={12} style={{ verticalAlign: '-1px' }} /> Review</div>
      <h2>Your design against the checklist</h2>
      <p className="muted small">
        {fails === 0 && warns === 0 && 'Every check passed — strong work. These results are saved into your evidence.'}
        {fails === 0 && warns > 0 && `No essential problems, with ${warns} suggestion${warns > 1 ? 's' : ''} worth considering. These results are saved into your evidence.`}
        {fails > 0 && `${fails} essential requirement${fails > 1 ? 's' : ''} still need${fails > 1 ? '' : 's'} attention. You can go back to the builder to fix them — the checklist will update.`}
      </p>
      <ChecklistPanel results={results} />
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowModel((s) => !s)} aria-expanded={showModel}>
          {showModel ? 'Hide' : 'Compare with'} a model answer
        </button>
        {showModel && (
          <div className="note" style={{ marginTop: 10 }}>
            <p className="small" style={{ marginBottom: 6 }}>
              <strong>One good answer</strong> (there are many): compare the structure with yours — don’t copy it word for word.
            </p>
            <ul className="small" style={{ marginBottom: 0 }}>
              {(moduleId === 'mindmap' ? HOSPITAL_MODEL_MAP : moduleId === 'flowchart' ? HOSPITAL_MODEL_FLOW : moduleId === 'visualisation' ? HOSPITAL_MODEL_VIS : HOSPITAL_MODEL_WIRE).map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
