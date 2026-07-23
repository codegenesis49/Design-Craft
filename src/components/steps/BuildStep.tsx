import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { StepProps } from '../Journey';
import MindMapBuilder from '../MindMapBuilder';
import FlowchartBuilder from '../FlowchartBuilder';
import LayoutBuilder from '../LayoutBuilder';

export default function BuildStep({ moduleId, record, update, setCanContinue }: StepProps) {
  const [status, setStatus] = useState({ nodeCount: 0, passed: false });

  const ready = record.supportLevel != null && (moduleId !== 'mindmap' || record.selectedMindMapType != null);

  useEffect(() => {
    const enough = status.nodeCount >= 3;
    const gate = record.supportLevel === 'guided' ? enough && status.passed : enough;
    setCanContinue(ready && gate);
  }, [status, ready, record.supportLevel, setCanContinue]);

  if (!ready) {
    return (
      <div className="card card-pad">
        <h2>Almost there</h2>
        <p className="muted">Go back and choose {moduleId === 'mindmap' ? 'a mind-map type and ' : ''}a support level before opening the builder.</p>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      {moduleId === 'mindmap'
        ? <MindMapBuilder record={record} update={update} onStatus={setStatus} />
        : moduleId === 'flowchart'
          ? <FlowchartBuilder record={record} update={update} onStatus={setStatus} />
          : <LayoutBuilder moduleId={moduleId} record={record} update={update} onStatus={setStatus} />}
      {record.supportLevel === 'guided' && !status.passed && (
        <p className="small muted no-print" style={{ margin: '8px 2px 0' }}>
          Guided mode: the Continue button unlocks once your design meets the essential checklist requirements shown on the right.
        </p>
      )}
    </ReactFlowProvider>
  );
}
