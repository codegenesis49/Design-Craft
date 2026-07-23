import { DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow, Background, BackgroundVariant, Handle, Position, addEdge, reconnectEdge,
  useNodesState, useEdgesState, useReactFlow, Connection, Edge, Node, OnSelectionChangeParams, MarkerType,
} from '@xyflow/react';
import { Trash2, ChevronRight } from 'lucide-react';
import { ArtifactData, PROJECT_BRIEF, SavedRecord, SupportLevel } from '../types';
import { flowchartGuidedPrompts, flowchartSupportedHints } from '../content/flowchart';
import { validateFlowchart, checklistPassed, SymbolKind } from '../logic/validateFlowchart';
import { flowchartLayout } from '../logic/layout';
import { useHistory } from '../hooks/useHistory';
import { BuilderToolbar, ChecklistPanel } from './builderShared';

const DIM: Record<SymbolKind, { w: number; h: number }> = {
  start: { w: 150, h: 54 }, end: { w: 150, h: 54 }, process: { w: 180, h: 62 },
  decision: { w: 190, h: 110 }, io: { w: 190, h: 62 }, connector: { w: 44, h: 44 },
};

export function FcNode({ data }: { data: any }) {
  const kind = data.symbol as SymbolKind;
  const { w, h } = DIM[kind];
  const stroke = kind === 'start' || kind === 'end' ? 'var(--primary)' : kind === 'decision' ? 'var(--amber)' : kind === 'io' ? 'var(--teal)' : 'var(--ink-soft)';
  return (
    <div className="fc-node" style={{ width: w, height: h }}>
      <svg className="fc-shape" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        {kind === 'start' || kind === 'end' ? (
          <rect x={1.5} y={1.5} width={w - 3} height={h - 3} rx={(h - 3) / 2} fill="#fff" stroke={stroke} strokeWidth={2.2} />
        ) : kind === 'process' ? (
          <rect x={1.5} y={1.5} width={w - 3} height={h - 3} fill="#fff" stroke={stroke} strokeWidth={2.2} />
        ) : kind === 'decision' ? (
          <polygon points={`${w / 2},2 ${w - 2},${h / 2} ${w / 2},${h - 2} 2,${h / 2}`} fill="#fff" stroke={stroke} strokeWidth={2.2} />
        ) : kind === 'io' ? (
          <polygon points={`${w * 0.14},2 ${w - 2},2 ${w * 0.86},${h - 2} 2,${h - 2}`} fill="#fff" stroke={stroke} strokeWidth={2.2} />
        ) : (
          <circle cx={w / 2} cy={h / 2} r={w / 2 - 2} fill="#fff" stroke={stroke} strokeWidth={2.2} />
        )}
      </svg>
      <span className="fc-label" style={kind === 'decision' ? { maxWidth: w - 56 } : undefined}>
        {data.label || <span className="muted" style={{ fontWeight: 400 }}>{kind === 'connector' ? 'A' : 'Label…'}</span>}
      </span>
      {kind !== 'start' && <Handle type="target" position={Position.Top} id="t" />}
      {kind !== 'start' && kind !== 'end' && <Handle type="target" position={Position.Left} id="l" style={{ top: '50%' }} />}
      {kind !== 'end' && <Handle type="source" position={Position.Bottom} id="b" />}
      {kind !== 'start' && kind !== 'end' && <Handle type="source" position={Position.Right} id="r" style={{ top: '50%' }} />}
    </div>
  );
}

const nodeTypes = { fc: FcNode };

const PALETTE: { symbol: SymbolKind; name: string; hint: string }[] = [
  { symbol: 'start', name: 'Start', hint: 'Terminator — where the process begins' },
  { symbol: 'end', name: 'End', hint: 'Terminator — where a route finishes' },
  { symbol: 'process', name: 'Process', hint: 'Rectangle — an action the system performs' },
  { symbol: 'decision', name: 'Decision', hint: 'Diamond — a question with alternative routes' },
  { symbol: 'io', name: 'Input / Output', hint: 'Parallelogram — data going in or out' },
  { symbol: 'connector', name: 'Connector (optional)', hint: 'Circle — links sections of large diagrams' },
];

function shapeGlyph(symbol: SymbolKind) {
  const s = 'var(--ink-soft)';
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      {symbol === 'start' || symbol === 'end' ? <rect x={1} y={4} width={28} height={12} rx={6} fill="none" stroke={s} strokeWidth={1.6} />
        : symbol === 'process' ? <rect x={2} y={4} width={26} height={12} fill="none" stroke={s} strokeWidth={1.6} />
        : symbol === 'decision' ? <polygon points="15,1 29,10 15,19 1,10" fill="none" stroke={s} strokeWidth={1.6} />
        : symbol === 'io' ? <polygon points="6,4 29,4 24,16 1,16" fill="none" stroke={s} strokeWidth={1.6} />
        : <circle cx={15} cy={10} r={7} fill="none" stroke={s} strokeWidth={1.6} />}
    </svg>
  );
}

export function seedFlowchart(level: SupportLevel): ArtifactData {
  if (level === 'guided') {
    return { nodes: [{ id: 'start', type: 'fc', position: { x: 0, y: 0 }, data: { symbol: 'start', label: 'Start' } }], edges: [] };
  }
  return { nodes: [], edges: [] };
}

let idc = 1;
const nextId = () => `f${Date.now().toString(36)}${idc++}`;

interface Props {
  record: SavedRecord;
  update: (patch: Partial<SavedRecord>) => void;
  onStatus: (s: { nodeCount: number; passed: boolean }) => void;
}

export default function FlowchartBuilder({ record, update, onStatus }: Props) {
  const level = (record.supportLevel ?? 'independent') as SupportLevel;
  const initial = record.artifactData ?? seedFlowchart(level);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges as Edge[]);
  const [selected, setSelected] = useState<{ node: Node | null; edge: Edge | null }>({ node: null, edge: null });
  const [promptIdx, setPromptIdx] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const history = useHistory<ArtifactData>();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);

  const snapshot = useCallback((): ArtifactData => ({
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  }), [nodes, edges]);
  const applyArt = useCallback((a: ArtifactData) => { setNodes(a.nodes as Node[]); setEdges(a.edges as Edge[]); }, [setNodes, setEdges]);

  const results = useMemo(() => validateFlowchart({ nodes: nodes as any, edges: edges as any }), [nodes, edges]);
  useEffect(() => {
    onStatus({ nodeCount: nodes.length, passed: checklistPassed(results) });
    setSaveState('saving');
    const t = setTimeout(() => {
      update({ artifactData: { nodes: nodes as any, edges: edges as any } });
      setSaveState('saved');
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const addSymbol = useCallback((symbol: SymbolKind, position?: { x: number; y: number }) => {
    history.commit(snapshot());
    const id = nextId();
    const pos = position ?? { x: 40 + (nodes.length % 4) * 60, y: 40 + nodes.length * 40 };
    const label = symbol === 'start' ? 'Start' : symbol === 'end' ? 'End' : '';
    setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), { id, type: 'fc', position: pos, selected: true, data: { symbol, label } }] as Node[]);
    setTimeout(() => labelRef.current?.focus(), 50);
  }, [history, snapshot, nodes.length, setNodes]);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('application/designcraft') as SymbolKind;
    if (!symbol) return;
    addSymbol(symbol, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
  }, [addSymbol, screenToFlowPosition]);

  const onConnect = useCallback((c: Connection) => {
    history.commit(snapshot());
    const sourceNode = nodes.find((n) => n.id === c.source);
    const isDecision = sourceNode?.data.symbol === 'decision';
    setEdges((es) => addEdge({ ...c, type: 'smoothstep', label: isDecision ? 'Yes' : undefined, markerEnd: { type: MarkerType.ArrowClosed, color: '#4a5268', width: 18, height: 18 } }, es));
  }, [history, snapshot, nodes, setEdges]);

  const onReconnect = useCallback((oldEdge: Edge, c: Connection) => {
    history.commit(snapshot());
    setEdges((es) => reconnectEdge(oldEdge, c, es));
  }, [history, snapshot, setEdges]);

  const onSelectionChange = useCallback(({ nodes: sn, edges: se }: OnSelectionChangeParams) => {
    setSelected({ node: sn[0] ?? null, edge: se[0] ?? null });
  }, []);

  const updateNodeLabel = useCallback((label: string) => {
    const id = selected.node?.id;
    if (!id) return;
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)));
    setSelected((s) => (s.node ? { ...s, node: { ...s.node, data: { ...s.node.data, label } } } : s));
  }, [selected.node, setNodes]);

  const updateEdgeLabel = useCallback((label: string) => {
    const id = selected.edge?.id;
    if (!id) return;
    setEdges((es) => es.map((e) => (e.id === id ? { ...e, label } : e)));
    setSelected((s) => (s.edge ? { ...s, edge: { ...s.edge, label } } : s));
  }, [selected.edge, setEdges]);

  const deleteSelected = useCallback(() => {
    history.commit(snapshot());
    if (selected.node) {
      const id = selected.node.id;
      setNodes((ns) => ns.filter((n) => n.id !== id));
      setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
    } else if (selected.edge) {
      const id = selected.edge.id;
      setEdges((es) => es.filter((e) => e.id !== id));
    }
    setSelected({ node: null, edge: null });
  }, [selected, history, snapshot, setNodes, setEdges]);

  const doUndo = useCallback(() => { const p = history.undo(snapshot()); if (p) applyArt(p); }, [history, snapshot, applyArt]);
  const doRedo = useCallback(() => { const n = history.redo(snapshot()); if (n) applyArt(n); }, [history, snapshot, applyArt]);
  const autoLayout = useCallback(() => {
    history.commit(snapshot());
    applyArt(flowchartLayout(snapshot()));
    setTimeout(() => fitView({ padding: 0.2 }), 60);
  }, [history, snapshot, applyArt, fitView]);
  const reset = useCallback(() => {
    if (!window.confirm('Start this flowchart again? Your current design will be removed.')) return;
    const seed = seedFlowchart(level);
    applyArt(seed);
    history.clear();
    setPromptIdx(0);
    update({ artifactData: seed });
  }, [level, applyArt, history, update]);

  const selectedSymbol = selected.node?.data.symbol as SymbolKind | undefined;

  return (
    <>
      <BuilderToolbar
        moduleId="flowchart"
        undo={doUndo} redo={doRedo} canUndo={history.canUndo} canRedo={history.canRedo}
        onAutoLayout={autoLayout}
        onSave={() => { update({ artifactData: snapshot() }); setSaveState('saved'); }}
        onReset={reset}
        nodes={nodes}
        saveState={saveState}
        helpText="Drag symbols from the library onto the canvas, then drag between handles to draw flow lines"
      />
      <div className="builder" ref={wrapRef}>
        <aside className="builder-left" aria-label="Brief and symbol library">
          <div className="panel-h">Project brief</div>
          <p className="small muted">{PROJECT_BRIEF}</p>
          <p className="small muted">Plan the process a patient follows to find and confirm an appointment at the kiosk.</p>
          <div className="panel-h">Symbol library</div>
          {PALETTE.map((p) => (
            <button
              key={p.symbol}
              className="palette-item"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/designcraft', p.symbol)}
              onClick={() => addSymbol(p.symbol)}
              data-tip={p.hint}
              aria-label={`Add ${p.name} symbol — ${p.hint}`}
            >
              {shapeGlyph(p.symbol)} {p.name}
            </button>
          ))}
          <p className="small muted">Drag a symbol onto the canvas, or click to place it. Drag from a handle on one symbol to another to draw a flow line.</p>

          {level === 'guided' && (
            <>
              <div className="panel-h">Guided prompt {promptIdx + 1} of {flowchartGuidedPrompts.length}</div>
              <div className="note" style={{ margin: 0 }}>
                <span className="badge badge-blue" style={{ marginBottom: 6 }}>{flowchartGuidedPrompts[promptIdx].component}</span>
                <p className="small" style={{ margin: 0 }}>{flowchartGuidedPrompts[promptIdx].text}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPromptIdx((i) => Math.max(0, i - 1))} disabled={promptIdx === 0}>Previous</button>
                <button className="btn btn-primary btn-sm" onClick={() => setPromptIdx((i) => Math.min(flowchartGuidedPrompts.length - 1, i + 1))} disabled={promptIdx === flowchartGuidedPrompts.length - 1}>
                  Next prompt <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
          {level === 'supported' && (
            <>
              <div className="panel-h">Hints</div>
              <ul className="small muted" style={{ paddingLeft: 18 }}>
                {flowchartSupportedHints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </>
          )}
          {level === 'independent' && (
            <>
              <div className="panel-h">Independent build</div>
              <p className="small muted">Construct the complete flowchart from the brief. The checklist appears at the review step.</p>
            </>
          )}
        </aside>

        <div className="builder-canvas" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onReconnect={onReconnect}
            onSelectionChange={onSelectionChange}
            onNodeDragStart={() => history.commit(snapshot())}
            onBeforeDelete={async (p) => { history.commit(snapshot()); return p; }}
            nodeTypes={nodeTypes}
            fitView
            edgesReconnectable
            deleteKeyCode={['Backspace', 'Delete']}
            minZoom={0.25} maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="#c9cede" />
          </ReactFlow>
          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
              <div className="card card-pad" style={{ maxWidth: 340, textAlign: 'center' }}>
                <h3>An empty canvas</h3>
                <p className="small muted" style={{ margin: 0 }}>Every flowchart begins the same way — drag a Start terminator from the symbol library.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="builder-right" aria-label="Properties and checklist">
          <div className="panel-h">Selected</div>
          {selected.node ? (
            <>
              <p className="small muted" style={{ marginBottom: 4 }}>
                {PALETTE.find((p) => p.symbol === selectedSymbol)?.name} symbol
              </p>
              <label className="field-label" htmlFor="fc-label">Text</label>
              <input
                id="fc-label" ref={labelRef} className="text-input"
                value={(selected.node.data.label as string) ?? ''}
                onFocus={() => history.commit(snapshot())}
                onChange={(e) => updateNodeLabel(e.target.value)}
                placeholder={selectedSymbol === 'decision' ? 'Ask a question…' : 'Describe the step…'}
              />
              <button className="btn btn-danger btn-sm" style={{ marginTop: 12 }} onClick={deleteSelected}>
                <Trash2 size={14} /> Delete symbol
              </button>
            </>
          ) : selected.edge ? (
            <>
              <label className="field-label" htmlFor="edge-label">Route label</label>
              <input
                id="edge-label" className="text-input"
                value={String(selected.edge.label ?? '')}
                onFocus={() => history.commit(snapshot())}
                onChange={(e) => updateEdgeLabel(e.target.value)}
                placeholder="e.g. Yes"
              />
              <div style={{ marginTop: 8 }}>
                {['Yes', 'No', 'True', 'False'].map((l) => (
                  <button key={l} className="chip" onClick={() => { history.commit(snapshot()); updateEdgeLabel(l); }}>{l}</button>
                ))}
              </div>
              <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }} onClick={deleteSelected}>
                <Trash2 size={14} /> Delete flow line
              </button>
            </>
          ) : (
            <p className="small muted">Select a symbol to edit its text, or select a flow line to label its route.</p>
          )}

          {level !== 'independent' && (
            <>
              <div className="panel-h">Live checklist</div>
              <ChecklistPanel results={results} compact />
            </>
          )}
        </aside>
      </div>
    </>
  );
}
