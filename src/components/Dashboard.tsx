import { Link } from 'react-router-dom';
import { Network, GitBranch, LayoutTemplate, Image, Palette, ArrowRight, FileCheck2, Clock3 } from 'lucide-react';
import { dataService } from '../data/dataService';
import { PROJECT_BRIEF, SavedRecord } from '../types';
import { stepTitles, totalSteps } from './journeySteps';
import { toolNames } from '../data/projects';

const AVAILABLE = [
  {
    id: 'mindmap' as const,
    title: 'Mind Maps',
    icon: <Network size={22} />,
    desc: 'Organise and connect ideas around a central theme. Learn the Library, Tunnel Timeline and Presentation types.',
  },
  {
    id: 'flowchart' as const,
    title: 'Flowcharts',
    icon: <GitBranch size={22} />,
    desc: 'Plan a process with standard symbols — sequence, decisions, inputs, outputs and labelled routes.',
  },
  {
    id: 'visualisation' as const,
    title: 'Visualisation Diagrams',
    icon: <Image size={22} />,
    desc: 'Sketch how a static product will look, including its layout, text, images, colours and annotations.',
  },
  {
    id: 'wireframe' as const,
    title: 'Wireframes',
    icon: <LayoutTemplate size={22} />,
    desc: 'Plan what a screen contains and where each element will go using low- or high-fidelity layouts.',
  },
];

const UPCOMING = [
  { title: 'Mood Boards', icon: <Palette size={22} />, desc: 'Explore colours, fonts, imagery and the visual theme of a solution.' },
];

function progressOf(r: SavedRecord): number {
  if (r.completionStatus === 'complete') return 100;
  if (r.completionStatus === 'not-started') return 0;
  return Math.round((r.maxStep / (totalSteps(r.moduleId) - 1)) * 100);
}

export default function Dashboard() {
  const records = dataService.listAll();
  const inProgress = records.filter((r) => r.completionStatus === 'in-progress');
  const saved = records.filter((r) => r.completionStatus !== 'not-started');

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Design Lab</div>
          <h1>Plan an IT solution like a professional designer</h1>
          <p className="muted" style={{ maxWidth: 560 }}>
            In the Design Lab, you will learn when different design tools should be used, explore their
            advantages and disadvantages, and create your own designs for a realistic IT project.
          </p>
          <p className="small muted" style={{ maxWidth: 560 }}>
            DesignCraft is part of a wider suite: plan here, then build the interface in FormCraft,
            configure the system in SystemCraft and secure it in CyberCraft.
          </p>
        </div>
        <div className="hero-side card card-pad">
          <div className="eyebrow">Current project</div>
          <h3>Hospital self-service appointments</h3>
          <p className="small muted" style={{ marginBottom: 0 }}>{PROJECT_BRIEF}</p>
        </div>
      </section>
      <div className="note project-actions"><strong>Keep every design</strong><span>Create and reopen your own projects, including mood boards.</span><Link className="btn btn-primary" to="/projects">My Projects</Link><Link className="btn btn-secondary" to="/resources">Visual examples</Link><Link className="btn btn-secondary" to="/assessment">End-of-module assessment</Link></div>

      {inProgress.length > 0 && (
        <>
          <div className="section-title">
            <h2>Continue learning</h2>
          </div>
          <div className="grid-modules">
            {inProgress.map((r) => (
              <div key={r.moduleId} className="card module-card">
                <span className="badge badge-amber"><Clock3 size={12} /> In progress</span>
                <h3 style={{ margin: 0 }}>{toolNames[r.moduleId]}</h3>
                <p className="small muted" style={{ margin: 0 }}>
                  Next up: {stepTitles(r.moduleId)[Math.min(r.maxStep, totalSteps(r.moduleId) - 1)]}
                </p>
                <div className="progress-track" aria-label={`Progress ${progressOf(r)}%`}>
                  <div className="progress-fill" style={{ width: `${progressOf(r)}%` }} />
                </div>
                <Link to={`/lab/${r.moduleId}`} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Resume lesson <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-title">
        <h2>Design-tool lessons</h2>
        <span className="muted small">Available now</span>
      </div>
      <div className="grid-modules">
        {AVAILABLE.map((m) => {
          const rec = records.find((r) => r.moduleId === m.id)!;
          const pct = progressOf(rec);
          return (
            <div key={m.id} className="card module-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="glyph">{m.icon}</span>
                {rec.completionStatus === 'complete' ? (
                  <span className="badge badge-teal">Complete</span>
                ) : (
                  <span className="badge badge-blue">Available</span>
                )}
              </div>
              <h3 style={{ margin: 0 }}>{m.title}</h3>
              <p className="small muted" style={{ margin: 0, flex: 1 }}>{m.desc}</p>
              <div className="progress-track" aria-label={`Progress ${pct}%`}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="small muted">{pct}% of the lesson journey</div>
              <Link to={`/lab/${m.id}`} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                {pct === 0 ? 'Start lesson' : pct === 100 ? 'Review lesson' : 'Continue'} <ArrowRight size={15} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="section-title">
        <h2>Mood boards</h2>
        <span className="muted small">Create now in My Projects; a guided lesson is coming later</span>
      </div>
      <div className="grid-modules">
        {UPCOMING.map((m) => (
          <div key={m.title} className="card module-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="glyph">{m.icon}</span>
              <span className="badge badge-teal">Project editor available</span>
            </div>
            <h3 style={{ margin: 0 }}>{m.title}</h3>
            <p className="small muted" style={{ margin: 0 }}>{m.desc}</p>
            <Link className="btn btn-primary" to="/projects">Create a mood board</Link>
            <Link className="btn btn-secondary" to="/resources?tool=moodboard">Examples and MCQs</Link>
          </div>
        ))}
      </div>

      <div className="section-title">
        <h2>Saved work</h2>
      </div>
      <div className="card">
        {saved.length === 0 ? (
          <div className="card-pad muted small">
            Nothing saved yet. Start the Mind Maps lesson to begin building evidence for the hospital project.
          </div>
        ) : (
          saved.map((r) => (
            <div className="saved-row" key={r.moduleId}>
              <FileCheck2 size={18} color="var(--primary-deep)" aria-hidden="true" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{toolNames[r.moduleId]}</strong>
                <span className="muted small"> · Hospital appointment system</span>
                <div className="small muted">
                  {r.selectedMindMapType ? `Type: ${r.selectedMindMapType === 'tunnel' ? 'Tunnel Timeline' : r.selectedMindMapType[0].toUpperCase() + r.selectedMindMapType.slice(1)} · ` : ''}
                  {r.supportLevel ? `Support: ${r.supportLevel} · ` : ''}
                  {r.lastSavedAt ? `Last saved ${new Date(r.lastSavedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}` : ''}
                </div>
              </div>
              {r.firstScore && <span className="badge badge-blue">First: {r.firstScore.score}/10</span>}
              {r.retryScore && <span className="badge badge-teal">Retry: {r.retryScore.score}/10</span>}
              <Link className="btn btn-secondary btn-sm" to={`/evidence/${r.moduleId}`}>Evidence</Link>
              <Link className="btn btn-ghost btn-sm" to={`/lab/${r.moduleId}`}>Open</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
