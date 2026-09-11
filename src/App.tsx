import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { PenTool } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Journey from './components/Journey';
import Evidence from './components/Evidence';
import Projects, { ProjectEditor } from './components/Projects';
import WordBank from './components/Glossary';
import ResourcesPage from './components/LearningResources';
import AssessmentPage from './components/ExamPractice';
import StorageNotice from './components/StorageNotice';

export default function App() {
  const loc = useLocation();
  const inEvidence = loc.pathname.startsWith('/evidence');
  return (
    <div className="shell">
      <header className={`topbar ${inEvidence ? 'no-print' : ''}`}>
        <Link to="/" className="brand" aria-label="DesignCraft dashboard">
          <span className="brand-mark" aria-hidden="true"><PenTool size={16} /></span>
          <span className="brand-name">DesignCraft</span>
        </Link>
        <span className="brand-suite">Design Lab · OCR J836 · R050 Topic Area 1</span>
        <nav className="topbar-nav" aria-label="Main navigation">
          <Link className="btn btn-ghost btn-sm" to="/">Dashboard</Link>
          <Link className="btn btn-ghost btn-sm" to="/projects">My Projects</Link>
          <Link className="btn btn-ghost btn-sm" to="/resources">Examples</Link>
          <Link className="btn btn-ghost btn-sm" to="/glossary">Word bank</Link>
          <Link className="btn btn-ghost btn-sm" to="/assessment">Final assessment</Link>
          <Link className="btn btn-ghost btn-sm" to="/lab/mindmap">Mind Maps</Link>
          <Link className="btn btn-ghost btn-sm" to="/lab/flowchart">Flowcharts</Link>
          <Link className="btn btn-ghost btn-sm" to="/lab/visualisation">Visualisation</Link>
          <Link className="btn btn-ghost btn-sm" to="/lab/wireframe">Wireframes</Link>
        </nav>
      </header>
      <main className="main">
        <StorageNotice />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lab/mindmap" element={<Journey key="mindmap" moduleId="mindmap" />} />
          <Route path="/lab/flowchart" element={<Journey key="flowchart" moduleId="flowchart" />} />
          <Route path="/lab/visualisation" element={<Journey key="visualisation" moduleId="visualisation" />} />
          <Route path="/lab/wireframe" element={<Journey key="wireframe" moduleId="wireframe" />} />
          <Route path="/evidence/:moduleId" element={<Evidence />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectEditor />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/glossary" element={<WordBank />} />
          <Route path="/assessment" element={<AssessmentPage />} />
        </Routes>
      </main>
    </div>
  );
}
