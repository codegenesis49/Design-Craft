import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { PenTool } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Journey from './components/Journey';
import Evidence from './components/Evidence';

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
          <Link className="btn btn-ghost btn-sm" to="/lab/mindmap">Mind Maps</Link>
          <Link className="btn btn-ghost btn-sm" to="/lab/flowchart">Flowcharts</Link>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lab/mindmap" element={<Journey moduleId="mindmap" />} />
          <Route path="/lab/flowchart" element={<Journey moduleId="flowchart" />} />
          <Route path="/evidence/:moduleId" element={<Evidence />} />
        </Routes>
      </main>
    </div>
  );
}
