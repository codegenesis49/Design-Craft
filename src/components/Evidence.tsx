import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant } from '@xyflow/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { dataService } from '../data/dataService';
import { ModuleId, PROJECT_BRIEF } from '../types';
import { MindNode } from './MindMapBuilder';
import { FcNode } from './FlowchartBuilder';
import { LayoutNode } from './LayoutBuilder';
import { CheckIcon } from './builderShared';
import { masteryLevel } from '../logic/quiz';

const nodeTypes = { mind: MindNode, fc: FcNode, layout: LayoutNode };

export default function Evidence() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>();
  const record = useMemo(() => dataService.load((moduleId as ModuleId) ?? 'mindmap'), [moduleId]);
  const art = record.artifactData ?? { nodes: [], edges: [] };
  const toolName = record.selectedTool;
  const typeName = record.selectedMindMapType
    ? record.selectedMindMapType === 'tunnel' ? 'Tunnel Timeline' : record.selectedMindMapType[0].toUpperCase() + record.selectedMindMapType.slice(1)
    : null;
  const completed = record.submittedAt ?? record.lastSavedAt;
  const just = record.writtenJustification;

  return (
    <div className="page evidence-sheet">
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Link className="btn btn-secondary btn-sm" to={`/lab/${record.moduleId}`}><ArrowLeft size={15} /> Back to the lesson</Link>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Printer size={15} /> Print or save as PDF</button>
      </div>

      <div className="card card-pad">
        <div className="eyebrow">DesignCraft · Design Lab · Evidence of learning</div>
        <h1 style={{ fontSize: '1.4rem' }}>{toolName}{typeName ? ` — ${typeName}` : ''}: Hospital appointment system</h1>

        <h3 style={{ marginTop: 18 }}>Project brief</h3>
        <p className="small">{PROJECT_BRIEF}</p>

        <h3 style={{ marginTop: 12 }}>Lesson record</h3>
        <div className="evidence-meta">
          <div><div className="small muted">Selected design tool</div><strong>{record.selectedTool}</strong></div>
          {typeName && <div><div className="small muted">Mind-map type</div><strong>{typeName}</strong></div>}
          <div><div className="small muted">Support level</div><strong>{record.supportLevel ?? '—'}</strong></div>
          <div><div className="small muted">First knowledge-check score</div><strong>{record.firstScore ? `${record.firstScore.score}/10 (${masteryLevel(record.firstScore.score)})` : 'Not taken'}</strong></div>
          <div><div className="small muted">Retry score</div><strong>{record.retryScore ? `${record.retryScore.score}/10 (${masteryLevel(record.retryScore.score)})` : 'Not taken'}</strong></div>
          <div><div className="small muted">Completion date</div><strong>{completed ? new Date(completed).toLocaleDateString('en-GB', { dateStyle: 'long' }) : '—'}</strong></div>
        </div>

        <h3 style={{ marginTop: 18 }}>Completed design</h3>
        {art.nodes.length === 0 ? (
          <p className="small muted">No design has been built yet.</p>
        ) : (
          <div className="evidence-canvas">
            <ReactFlowProvider>
              <ReactFlow
                nodes={art.nodes as any} edges={art.edges as any}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
                zoomOnScroll={false} panOnDrag={false} zoomOnPinch={false} zoomOnDoubleClick={false}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#dde0ea" />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        )}

        <h3 style={{ marginTop: 18 }}>Automated checklist results</h3>
        {record.checklistResults && record.checklistResults.length > 0 ? (
          record.checklistResults.map((r) => (
            <div className="check-row" key={r.id}>
              <CheckIcon status={r.status} />
              <div><strong style={{ display: 'block', fontSize: '0.88rem' }}>{r.label}</strong><span className="muted small">{r.message}</span></div>
            </div>
          ))
        ) : (
          <p className="small muted">The checklist has not been run yet — complete the review step.</p>
        )}

        <h3 style={{ marginTop: 18 }}>Student justification</h3>
        {just ? (
          <>
            <p className="small"><strong>Why was this design tool suitable?</strong><br />{just.suitable || '—'}</p>
            <p className="small"><strong>How did it help you plan the product?</strong><br />{just.helped || '—'}</p>
            <p className="small"><strong>One limitation of the tool</strong><br />{just.limitation || '—'}</p>
            <p className="small"><strong>Which design tool should be used next, and why?</strong><br />{just.next || '—'}</p>
          </>
        ) : (
          <p className="small muted">Not written yet — complete the “Explain your choices” step.</p>
        )}
      </div>
    </div>
  );
}
