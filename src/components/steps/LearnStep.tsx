import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { StepProps } from '../Journey';
import { mindmapLearnTabs, LearnTab } from '../../content/mindmap';
import { flowchartLearnTabs } from '../../content/flowchart';
import { FlowchartSequenceExample, FlowchartSymbolGuide } from '../FlowchartLearnVisuals';
import { visualisationLearnTabs, wireframeLearnTabs } from '../../content/layoutTools';
import { LearningResources } from '../LearningResources';
import { GlossaryContent } from '../Glossary';
import { ExamPractice } from '../ExamPractice';

export default function LearnStep({ moduleId, setCanContinue }: StepProps) {
  const tabs: LearnTab[] =
    moduleId === 'mindmap' ? mindmapLearnTabs :
    moduleId === 'flowchart' ? flowchartLearnTabs :
    moduleId === 'visualisation' ? visualisationLearnTabs : wireframeLearnTabs;
  const [active, setActive] = useState(tabs[0].id);
  const [visited, setVisited] = useState<Set<string>>(() => {try {const saved=JSON.parse(localStorage.getItem(`designcraft.read.v1.${moduleId}`)||'[]');return new Set([tabs[0].id,...(Array.isArray(saved)?saved.filter(x=>typeof x==='string'):[])]);}catch{return new Set([tabs[0].id]);}});
  const [readError,setReadError] = useState(false);

  useEffect(() => { setCanContinue(true); }, [setCanContinue]);

  const tab = tabs.find((t) => t.id === active)!;
  return (
    <div className="card card-pad">
      <div className="eyebrow"><BookOpen size={12} style={{ verticalAlign: '-1px' }} /> Read and Learn</div>
      <h2>{moduleId === 'mindmap' ? 'Mind maps' : moduleId === 'flowchart' ? 'Flowcharts' : moduleId === 'visualisation' ? 'Visualisation diagrams' : 'Wireframes'}: what, when and why</h2>
      <p className="muted small">Work through each section below. Short sections, no walls of text — take what you need into the builder.</p>
      <div className="tabs" role="tablist" aria-label="Learning sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            className={`tab ${t.id === active ? 'active' : ''}`}
            onClick={() => { setActive(t.id); const next=new Set(visited).add(t.id);setVisited(next);try{localStorage.setItem(`designcraft.read.v1.${moduleId}`,JSON.stringify([...next]));setReadError(false);}catch{setReadError(true);} }}
          >
            {t.title}{visited.has(t.id) && t.id !== active ? ' ✓' : ''}
          </button>
        ))}
      </div>
      <GlossaryContent><div role="tabpanel" aria-label={tab.title}>
        {tab.blocks.map((b, i) => (
          <div key={i}>
            {b.heading && <h3>{b.heading}</h3>}
            {b.text && <p>{b.text}</p>}
            {b.bullets && <ul>{b.bullets.map((x, j) => <li key={j}>{x}</li>)}</ul>}
            {b.visual === 'flowchart-symbols' && <FlowchartSymbolGuide />}
            {b.visual === 'flowchart-sequence' && <FlowchartSequenceExample />}
            {b.note && <div className="note">{b.note}</div>}
          </div>
        ))}
      </div></GlossaryContent>
      <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
        Sections read: {visited.size} of {tabs.length}
      </p>
      {readError && <p className="feedback bad" role="alert">Reading progress could not be saved on this browser.</p>}
      <LearningResources key={moduleId} tool={moduleId} />
      <details className="read-more"><summary>Check this topic: five R050-style MCQs</summary><ExamPractice key={moduleId} tool={moduleId}/></details>
    </div>
  );
}
