import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng, toSvg } from 'html-to-image';
import { getNodesBounds, getViewportForBounds, useReactFlow } from '@xyflow/react';
import {
  Undo2, Redo2, ZoomIn, ZoomOut, Maximize, Wand2, Save, ImageDown,
  Printer, RotateCcw, HelpCircle, CheckCircle2, AlertTriangle, XCircle, FileCode2,
} from 'lucide-react';
import { CheckResult, ModuleId } from '../types';

async function exportImage(format: 'png' | 'svg', flowEl: HTMLElement, nodes: any[], filename: string) {
  const viewport = flowEl.querySelector('.react-flow__viewport') as HTMLElement | null;
  if (!viewport || nodes.length === 0) return;
  const bounds = getNodesBounds(nodes);
  const w = Math.min(2000, Math.max(700, bounds.width + 120));
  const h = Math.min(2000, Math.max(500, bounds.height + 120));
  const vp = getViewportForBounds(bounds, w, h, 0.4, 2, 0.08);
  const opts = {
    backgroundColor: '#f6f7fa',
    width: w,
    height: h,
    style: {
      width: `${w}px`,
      height: `${h}px`,
      transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`,
    },
    filter: (el: HTMLElement) => !el.classList?.contains('react-flow__handle'),
  };
  const dataUrl = format === 'png' ? await toPng(viewport, opts) : await toSvg(viewport, opts);
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export interface ToolbarProps {
  moduleId: ModuleId;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAutoLayout: () => void;
  onSave: () => void;
  onReset: () => void;
  nodes: any[];
  helpText: string;
  extra?: ReactNode;
  saveState: 'saved' | 'saving' | 'idle';
}

export function BuilderToolbar(p: ToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const navigate = useNavigate();

  const doExport = async (format: 'png' | 'svg') => {
    const el = document.querySelector('.builder-canvas') as HTMLElement | null;
    if (el) await exportImage(format, el, p.nodes, `designcraft-${p.moduleId}.${format}`);
  };

  return (
    <div className="builder-toolbar no-print" role="toolbar" aria-label="Design tools">
      <button className="icon-btn" data-tip="Undo" aria-label="Undo" onClick={p.undo} disabled={!p.canUndo}><Undo2 size={17} /></button>
      <button className="icon-btn" data-tip="Redo" aria-label="Redo" onClick={p.redo} disabled={!p.canRedo}><Redo2 size={17} /></button>
      <span className="toolbar-sep" aria-hidden="true" />
      <button className="icon-btn" data-tip="Zoom in" aria-label="Zoom in" onClick={() => zoomIn()}><ZoomIn size={17} /></button>
      <button className="icon-btn" data-tip="Zoom out" aria-label="Zoom out" onClick={() => zoomOut()}><ZoomOut size={17} /></button>
      <button className="icon-btn" data-tip="Fit to screen" aria-label="Fit design to screen" onClick={() => fitView({ padding: 0.2 })}><Maximize size={17} /></button>
      <button className="icon-btn" data-tip="Auto-arrange layout" aria-label="Auto-arrange layout" onClick={p.onAutoLayout}><Wand2 size={17} /></button>
      <span className="toolbar-sep" aria-hidden="true" />
      <button className="icon-btn" data-tip="Save now" aria-label="Save now" onClick={p.onSave}><Save size={17} /></button>
      <button className="icon-btn" data-tip="Export as PNG" aria-label="Export as PNG image" onClick={() => doExport('png')} disabled={p.nodes.length === 0}><ImageDown size={17} /></button>
      <button className="icon-btn" data-tip="Export as SVG" aria-label="Export as SVG image" onClick={() => doExport('svg')} disabled={p.nodes.length === 0}><FileCode2 size={17} /></button>
      <button className="icon-btn" data-tip="Print evidence view" aria-label="Open printable evidence view" onClick={() => navigate(`/evidence/${p.moduleId}`)}><Printer size={17} /></button>
      <span className="toolbar-sep" aria-hidden="true" />
      <button className="icon-btn" data-tip="Start again" aria-label="Start this design again" onClick={p.onReset}><RotateCcw size={17} /></button>
      <span className="icon-btn" tabIndex={0} data-tip={p.helpText} aria-label="Help"><HelpCircle size={17} /></span>
      {p.extra}
      <span className="small muted" style={{ marginLeft: 'auto' }} role="status" aria-live="polite">
        {p.saveState === 'saving' ? 'Saving…' : p.saveState === 'saved' ? 'All changes saved' : 'Progress saves automatically'}
      </span>
    </div>
  );
}

export function CheckIcon({ status }: { status: CheckResult['status'] }) {
  if (status === 'pass') return <CheckCircle2 className="check-ico check-pass" size={17} aria-label="Passed" />;
  if (status === 'warn') return <AlertTriangle className="check-ico check-warn" size={17} aria-label="Suggestion" />;
  return <XCircle className="check-ico check-fail" size={17} aria-label="Needs fixing" />;
}

export function ChecklistPanel({ results, compact }: { results: CheckResult[]; compact?: boolean }) {
  if (results.length === 0) {
    return <p className="small muted">Add some content to your design and the checklist will respond here.</p>;
  }
  return (
    <div>
      {results.map((r) => (
        <div className="check-row" key={r.id}>
          <CheckIcon status={r.status} />
          <div>
            {!compact && <strong style={{ display: 'block', fontSize: '0.88rem' }}>{r.label}</strong>}
            <span className={compact ? '' : 'muted'}>{r.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
