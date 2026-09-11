import { GlossaryContent } from '../Glossary';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { StepProps } from '../Journey';

/** Library mind map worked example: a school library search kiosk (a different brief, so it never gives away the hospital answer). */
function MindmapExample() {
  const branch = (x2: number, y2: number) => <line x1={380} y1={200} x2={x2} y2={y2} stroke="var(--ink-soft)" strokeWidth={1.6} />;
  const twig = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-strong)" strokeWidth={1.4} />;
  const pill = (x: number, y: number, w: number, text: string, color: string, small = false) => (
    <g>
      <rect x={x - w / 2} y={y - (small ? 12 : 15)} width={w} height={small ? 24 : 30} rx={small ? 12 : 15} fill="#fff" stroke={color} strokeWidth={2} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={small ? 11 : 12.5} fontWeight={600} fill="var(--ink)">{text}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 760 400" role="img" aria-label="Worked example of a Library mind map for a school library search kiosk, with four coloured category branches and keyword sub-nodes" style={{ width: '100%', height: 'auto', background: 'var(--paper)', borderRadius: 8 }}>
      {branch(170, 90)}{branch(590, 90)}{branch(170, 310)}{branch(590, 310)}
      {twig(170, 90, 80, 45)}{twig(170, 90, 90, 130)}
      {twig(590, 90, 680, 45)}{twig(590, 90, 670, 130)}
      {twig(170, 310, 80, 270)}{twig(170, 310, 90, 355)}
      {twig(590, 310, 680, 270)}{twig(590, 310, 670, 355)}
      <g>
        <rect x={290} y={175} width={180} height={50} rx={25} fill="var(--primary-tint)" stroke="var(--primary)" strokeWidth={2.4} />
        <text x={380} y={196} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="var(--ink)">Library search</text>
        <text x={380} y={212} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="var(--ink)">kiosk</text>
      </g>
      {pill(170, 90, 100, 'Users', '#3d5ae0')}
      {pill(80, 45, 100, 'Students', '#3d5ae0', true)}
      {pill(90, 130, 100, 'Librarians', '#3d5ae0', true)}
      {pill(590, 90, 100, 'Inputs', '#0e8a7b')}
      {pill(680, 45, 110, 'Book title', '#0e8a7b', true)}
      {pill(670, 130, 120, 'Author name', '#0e8a7b', true)}
      {pill(170, 310, 110, 'Outputs', '#b45309')}
      {pill(80, 270, 120, 'Shelf location', '#b45309', true)}
      {pill(90, 355, 110, 'Availability', '#b45309', true)}
      {pill(590, 310, 130, 'Accessibility', '#7c3aed')}
      {pill(680, 270, 110, 'Large text', '#7c3aed', true)}
      {pill(670, 355, 120, 'Audio option', '#7c3aed', true)}
    </svg>
  );
}

/** Flowchart worked example: a cinema ticket kiosk (a different brief, so the hospital chart stays for the student to design). */
function FlowchartExample() {
  const cx = 380;
  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-soft)" strokeWidth={1.7} markerEnd="url(#arr)" />
  );
  const label = (x: number, y: number, t: string) => (
    <g><rect x={x - 15} y={y - 10} width={30} height={17} rx={4} fill="#fff" /><text x={x} y={y + 3} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--ink)">{t}</text></g>
  );
  const text = (x: number, y: number, t: string, dy = 0) => (
    <text x={x} y={y + 4 + dy} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ink)">{t}</text>
  );
  return (
    <svg viewBox="0 0 760 560" role="img" aria-label="Worked example flowchart for a cinema ticket kiosk with a decision, labelled Yes and No routes and an error loop" style={{ width: '100%', height: 'auto', background: 'var(--paper)', borderRadius: 8 }}>
      <defs>
        <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 z" fill="var(--ink-soft)" />
        </marker>
      </defs>
      <rect x={cx - 60} y={16} width={120} height={38} rx={19} fill="#fff" stroke="var(--primary)" strokeWidth={2} />
      {text(cx, 35, 'Start')}
      {arrow(cx, 54, cx, 78)}
      <polygon points={`${cx - 95},82 ${cx + 95},82 ${cx + 75},118 ${cx - 115},118`} fill="#fff" stroke="var(--teal)" strokeWidth={2} />
      {text(cx - 10, 100, 'Display welcome screen')}
      {arrow(cx, 118, cx, 142)}
      <polygon points={`${cx - 95},146 ${cx + 95},146 ${cx + 75},182 ${cx - 115},182`} fill="#fff" stroke="var(--teal)" strokeWidth={2} />
      {text(cx - 10, 164, 'Input booking code')}
      {arrow(cx, 182, cx, 206)}
      <rect x={cx - 85} y={210} width={170} height={40} fill="#fff" stroke="var(--ink-soft)" strokeWidth={2} />
      {text(cx, 230, 'Check the code')}
      {arrow(cx, 250, cx, 274)}
      <polygon points={`${cx},278 ${cx + 105},330 ${cx},382 ${cx - 105},330`} fill="#fff" stroke="var(--amber)" strokeWidth={2} />
      {text(cx, 322, 'Is the code', 0)}{text(cx, 338, 'valid?', 0)}
      {/* No route: error, loop back to input */}
      {arrow(cx - 105, 330, 190, 330)}
      {label(275, 322, 'No')}
      <polygon points={`110,312 210,312 195,348 95,348`} fill="#fff" stroke="var(--teal)" strokeWidth={2} />
      {text(152, 330, 'Display error')}
      {arrow(152, 312, 152, 164)}
      {arrow(152, 164, cx - 115, 164)}
      {/* Yes route */}
      {arrow(cx, 382, cx, 406)}
      {label(cx + 24, 398, 'Yes')}
      <rect x={cx - 85} y={410} width={170} height={40} fill="#fff" stroke="var(--ink-soft)" strokeWidth={2} />
      {text(cx, 430, 'Retrieve the booking')}
      {arrow(cx, 450, cx, 474)}
      <polygon points={`${cx - 95},478 ${cx + 95},478 ${cx + 75},514 ${cx - 115},514`} fill="#fff" stroke="var(--teal)" strokeWidth={2} />
      {text(cx - 10, 496, 'Output the tickets')}
      {arrow(cx + 75, 496, 600, 496)}
      <rect x={604} y={477} width={110} height={38} rx={19} fill="#fff" stroke="var(--primary)" strokeWidth={2} />
      {text(659, 496, 'End')}
    </svg>
  );
}
function LayoutExample({wireframe}:{wireframe:boolean}) {
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label={wireframe?'Worked high-fidelity wireframe for a library search kiosk':'Worked visualisation diagram for a library event poster'} className="worked-layout">
      <rect x="70" y="35" width="620" height="350" rx="10" fill="#fff" stroke="#8b93a7" strokeWidth="2"/>
      {wireframe ? <>
        <rect x="70" y="35" width="620" height="62" rx="10" fill="#edf0f8"/><text x="100" y="74" fontWeight="700" fontSize="20">LIBRARY SEARCH</text>
        <rect x="120" y="128" width="520" height="58" rx="8" fill="#fff" stroke="#8b93a7"/><text x="140" y="163" fill="#4a5268">Book title or author</text>
        <rect x="120" y="205" width="245" height="54" rx="8" fill="#3d5ae0"/><text x="242" y="239" textAnchor="middle" fill="#fff" fontWeight="700">Search</text>
        <rect x="395" y="205" width="245" height="54" rx="8" fill="#fff" stroke="#3d5ae0"/><text x="517" y="239" textAnchor="middle" fill="#2b41ad" fontWeight="700">Clear</text>
        <rect x="120" y="290" width="520" height="60" rx="8" fill="#f6f7fa"/><text x="145" y="326">Results and shelf location appear here</text>
      </> : <>
        <rect x="70" y="35" width="620" height="95" rx="10" fill="#263b7a"/><text x="380" y="78" textAnchor="middle" fill="#fff" fontWeight="700" fontSize="28">READING FESTIVAL</text><text x="380" y="105" textAnchor="middle" fill="#dbe4ff">Discover a new story</text>
        <rect x="105" y="160" width="220" height="150" fill="#e4f4f1" stroke="#0e8a7b"/><path d="M105 310L185 225l50 50 38-42 52 77" fill="none" stroke="#0e8a7b" strokeWidth="3"/><text x="215" y="335" textAnchor="middle" fontSize="12">Large event photograph</text>
        <text x="375" y="182" fontWeight="700" fontSize="21">Saturday 18 October</text><text x="375" y="220">Author talks · Book swap · Workshops</text><rect x="375" y="250" width="230" height="55" rx="8" fill="#f2a93b"/><text x="490" y="284" textAnchor="middle" fontWeight="700">BOOK YOUR PLACE</text>
        <line x1="630" y1="275" x2="704" y2="245" stroke="#b45309"/><text x="574" y="360" fontSize="12" fill="#7c3a04">Annotation: orange button, 18pt bold</text>
      </>}
    </svg>
  );
}

export default function WorkedExampleStep({ moduleId, setCanContinue }: StepProps) {
  useEffect(() => { setCanContinue(true); }, [setCanContinue]);
  const [showNotes, setShowNotes] = useState(true);
  const mindmap = moduleId === 'mindmap';
  const layout = moduleId === 'visualisation' || moduleId === 'wireframe';
  const wireframe = moduleId === 'wireframe';
  const notes = mindmap
    ? [
        'One clear central topic sits in the middle — everything grows from it.',
        'Four categories (Users, Inputs, Outputs, Accessibility) organise the collected information — this is what makes it a Library mind map.',
        'Each category is developed with keyword sub-nodes, never full sentences.',
        'Each branch has its own colour, so groups are easy to tell apart at a glance.',
      ]
    : layout ? (wireframe ? [
        'The screen contains a heading, search field, actions and a clearly labelled results area.',
        'The layout follows the order a user will work through the screen.',
        'Realistic text, colour and button styling make this a high-fidelity example.',
        'Every element has a purpose; the wireframe does not attempt to show process logic.',
      ] : [
        'The sketch shows the proposed appearance of one static poster.',
        'Text, image, colour and position are easy for a client to understand.',
        'The annotation explains a design choice instead of leaving it open to interpretation.',
        'It communicates layout and visual theme, not a process or timeline.',
      ]) : [
        'The process opens and closes with rounded terminators — one Start, one End.',
        'Data going in or out (welcome screen, booking code, tickets) uses parallelograms; system actions use rectangles.',
        'The diamond asks one question, and both routes leaving it are labelled Yes and No.',
        'The No route loops back so the user can try again — loops are fine when they are logically connected.',
      ];
  return (
    <GlossaryContent><div className="card card-pad">
      <div className="eyebrow"><Eye size={12} style={{ verticalAlign: '-1px' }} /> Worked example</div>
      <h2>{mindmap ? 'A Library mind map, done well' : layout ? `A ${wireframe?'high-fidelity wireframe':'visualisation diagram'}, done well` : 'A complete flowchart, done well'}</h2>
      <p className="muted small">
        This example uses a <strong>different brief</strong> — {mindmap ? 'a school library search kiosk' : layout ? (wireframe?'a library search kiosk':'a library event poster') : 'a cinema ticket kiosk'} — so the
        hospital design stays yours to create. Study the structure, not the content.
      </p>
      {mindmap ? <MindmapExample /> : layout ? <LayoutExample wireframe={wireframe}/> : <FlowchartExample />}
      <div style={{ marginTop: 14 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowNotes((s) => !s)} aria-expanded={showNotes}>
          {showNotes ? 'Hide' : 'Show'} what makes this example work
        </button>
        {showNotes && <ul style={{ marginTop: 10 }}>{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
      </div>
    </div></GlossaryContent>
  );
}
