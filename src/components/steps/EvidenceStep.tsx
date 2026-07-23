import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Printer } from 'lucide-react';
import { StepProps } from '../Journey';
import { masteryLevel } from '../../logic/quiz';

export default function EvidenceStep({ moduleId, record, update, setCanContinue }: StepProps) {
  useEffect(() => {
    setCanContinue(true);
    if (record.completionStatus !== 'complete' && record.firstScore) {
      update({ completionStatus: 'complete' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const best = record.retryScore ?? record.firstScore;

  return (
    <div className="card card-pad">
      <div className="eyebrow"><Award size={12} style={{ verticalAlign: '-1px' }} /> Evidence</div>
      <h2>Lesson complete — save your evidence</h2>
      <p className="muted small">
        Everything below is stored automatically on this computer. Open the evidence view to print it or save it as a PDF
        for your OCR portfolio, and use the builder’s export buttons for a PNG or SVG of the design itself.
      </p>
      <div className="evidence-meta" style={{ marginBottom: 16 }}>
        <div><div className="small muted">Design tool</div><strong>{record.selectedTool}</strong></div>
        {record.selectedMindMapType && (
          <div><div className="small muted">Mind-map type</div><strong>{record.selectedMindMapType === 'tunnel' ? 'Tunnel Timeline' : record.selectedMindMapType[0].toUpperCase() + record.selectedMindMapType.slice(1)}</strong></div>
        )}
        <div><div className="small muted">Support level</div><strong>{record.supportLevel ?? '—'}</strong></div>
        <div><div className="small muted">First attempt</div><strong>{record.firstScore ? `${record.firstScore.score}/10` : '—'}</strong></div>
        <div><div className="small muted">Retry</div><strong>{record.retryScore ? `${record.retryScore.score}/10` : 'Not taken'}</strong></div>
        <div><div className="small muted">Mastery</div><strong>{best ? masteryLevel(best.score) : '—'}</strong></div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="btn btn-primary" to={`/evidence/${moduleId}`}><Printer size={16} /> Open printable evidence</Link>
        <Link className="btn btn-secondary" to="/">Back to the dashboard</Link>
      </div>
    </div>
  );
}
