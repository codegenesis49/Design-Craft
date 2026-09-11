import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow, Background, BackgroundVariant, Handle, Position, addEdge, useNodesState,
  useEdgesState, useReactFlow, Connection, Edge, Node, OnSelectionChangeParams, MarkerType,
} from '@xyflow/react';
import {
  User, Users, Monitor, Keyboard, Accessibility, ShieldCheck, CalendarDays, Bell,
  Volume2, Heart, Lightbulb, MapPin, Plus, CircleDot, GitFork, Trash2, ChevronRight,
} from 'lucide-react';
import { ArtifactData, MindMapType, PROJECT_BRIEF, SavedRecord, SupportLevel } from '../types';
import { guidedPrompts, ideaCards, supportedHints, typeCards } from '../content/mindmap';
import { validateMindmap, checklistPassed } from '../logic/validateMindmap';
import { radialLayout } from '../logic/layout';
import { useHistory } from '../hooks/useHistory';
import { BuilderToolbar, ChecklistPanel } from './builderShared';

export const MM_ICONS: Record<string, any> = {
  user: User, users: Users, monitor: Monitor, keyboard: Keyboard, accessibility: Accessibility,
  shield: ShieldCheck, calendar: CalendarDays, bell: Bell, audio: Volume2, heart: Heart,
  idea: Lightbulb, pin: MapPin,
};

const PALETTE = ['#3d5ae0', '#0e8a7b', '#b45309', '#7c3aed', '#be185d', '#0369a1', '#4d7c0f', '#334155'];

export function MindNode({ data }: { data: any }) {
  const Icon = data.icon ? MM_ICONS[data.icon] : null;
  return (
    <div className={`mm-node ${data.kind}`} style={{ borderColor: data.color || '#3d5ae0' }}>
      <Handle type="target" position={Position.Top} />
      {Icon && <Icon size={data.kind === 'sub' ? 13 : 15} color={data.color} aria-hidden="true" />}
      <span className="mm-label">{data.label || <span className="muted" style={{ fontWeight: 400 }}>New idea…</span>}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { mind: MindNode };

function centralLabelFor(type: MindMapType): string {
  if (type === 'tunnel') return 'Create an accessible hospital appointment system';
  if (type === 'presentation') return 'Proposed hospital appointment kiosk';
  return 'Hospital appointment system';
}

export function seedMindmap(type: MindMapType, level: SupportLevel): ArtifactData {
  if (level === 'independent' || level === 'supported') return { nodes: [], edges: [] };
  return {
    nodes: [{
      id: 'central', type: 'mind', position: { x: 0, y: 0 },
      data: { label: centralLabelFor(type), kind: 'central', color: '#3d5ae0', icon: null },
    }],
    edges: [],
  };
}

let idCounter = 1;
const nextId = () => `n${Date.now().toString(36)}${idCounter++}`;

interface Props {
  record: SavedRecord;
  update: (patch: Partial<SavedRecord>) => void;
  onStatus: (s: { nodeCount: number; passed: boolean }) => void;
}

export default function MindMapBuilder({ record, update, onStatus }: Props) {
  const type = (record.selectedMindMapType ?? 'library') as MindMapType;
  const level = (record.supportLevel ?? 'independent') as SupportLevel;
  const initial = record.artifactData ?? seedMindmap(type, level);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges as Edge[]);
  const [selected, setSelected] = useState<{ node: Node | null; edge: Edge | null }>({ node: null, edge: null });
  const [promptIdx, setPromptIdx] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const history = useHistory<ArtifactData>();
  const { fitView, screenToFlowPosition } = useReactFlow();
  const labelRef = useRef<HTMLInputElement>(null);

  const snapshot = useCallback((): ArtifactData => ({
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  }), [nodes, edges]);

  const applyArt = useCallback((art: ArtifactData) => {
    setNodes(art.nodes as Node[]);
    setEdges(art.edges as Edge[]);
  }, [setNodes, setEdges]);

  // autosave + live validation
  const results = useMemo(() => validateMindmap({ nodes: nodes as any, edges: edges as any }, type), [nodes, edges, type]);
  useEffect(() => {
    onStatus({ nodeCount: nodes.length, passed: checklistPassed(results) });
    setSaveState('saving');
    update({ artifactData: { nodes: nodes as any, edges: edges as any } });
    setSaveState('saved');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const central = nodes.find((n) => n.data.kind === 'central');

  const addNode = useCallback((kind: 'central' | 'main' | 'sub' | 'sibling', label = '') => {
    history.commit(snapshot());
    const id = nextId();
    let parent: Node | undefined;
    let nodeKind: string = kind;
    if (kind === 'central') {
      if (central) return;
      setNodes((ns) => [...ns, { id, type: 'mind', position: { x: 0, y: 0 }, selected: true, data: { label: label || '', kind: 'central', color: '#3d5ae0', icon: null } } as Node].map((n) => ({ ...n, selected: n.id === id })));
      setTimeout(() => labelRef.current?.focus(), 50);
      return;
    }
    if (kind === 'main') { parent = central; nodeKind = 'main'; }
    if (kind === 'sub') { parent = selected.node ?? central; nodeKind = 'sub'; }
    if (kind === 'sibling') {
      const sel = selected.node;
      if (!sel || sel.data.kind === 'central') { parent = central; nodeKind = 'main'; }
      else {
        const pid = (sel.data.parentId as string) || edges.find((e) => e.target === sel.id)?.source || edges.find((e) => e.source === sel.id)?.target;
        parent = nodes.find((n) => n.id === pid) ?? central;
        nodeKind = sel.data.kind as string;
      }
    }
    if (!parent) return;
    const siblings = edges.filter((e) => e.source === parent!.id).length;
    const pos = {
      x: parent.position.x + 190 + (siblings % 2 === 0 ? 30 : -30),
      y: parent.position.y + (siblings - 1) * 74 + 60,
    };
    const color = nodeKind === 'sub' ? (parent.data.color as string) : PALETTE[siblings % PALETTE.length];
    const node: Node = { id, type: 'mind', position: pos, selected: true, data: { label, kind: nodeKind, color, icon: null, parentId: parent.id } };
    setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), node] as Node[]);
    setEdges((es) => [...es, { id: `e-${parent!.id}-${id}`, source: parent!.id, target: id }]);
    setTimeout(() => labelRef.current?.focus(), 50);
  }, [central, selected, nodes, edges, history, snapshot, setNodes, setEdges]);

  const onConnect = useCallback((c: Connection) => {
    history.commit(snapshot());
    setEdges((es) => addEdge(c, es));
  }, [history, snapshot, setEdges]);

  const onSelectionChange = useCallback(({ nodes: sn, edges: se }: OnSelectionChangeParams) => {
    setSelected({ node: sn[0] ?? null, edge: se[0] ?? null });
  }, []);

  const updateSelected = useCallback((patch: Record<string, unknown>) => {
    const id = selected.node?.id;
    if (!id) return;
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
    setSelected((s) => (s.node ? { ...s, node: { ...s.node, data: { ...s.node.data, ...patch } } } : s));
  }, [selected.node, setNodes]);

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
    applyArt(radialLayout(snapshot()));
    setTimeout(() => fitView({ padding: 0.2 }), 60);
  }, [history, snapshot, applyArt, fitView]);

  const reset = useCallback(() => {
    if (!window.confirm('Start this design again? Your current mind map will be removed.')) return;
    const seed = seedMindmap(type, level);
    applyArt(seed);
    history.clear();
    setPromptIdx(0);
    update({ artifactData: seed });
  }, [type, level, applyArt, history, update]);

  const prompts = guidedPrompts[type];
  const typeName = typeCards.find((t) => t.type === type)?.name;

  return (
    <>
      <BuilderToolbar
        moduleId="mindmap"
        undo={doUndo} redo={doRedo} canUndo={history.canUndo} canRedo={history.canRedo}
        onAutoLayout={autoLayout}
        onSave={() => { update({ artifactData: snapshot() }); setSaveState('saved'); }}
        onReset={reset}
        nodes={nodes}
        saveState={saveState}
        helpText="Select a node, then use the panels: add ideas on the left, edit text and colour on the right"
      />
      <div className="builder">
        <aside className="builder-left" aria-label="Brief and prompts">
          <div className="panel-h">Project brief</div>
          <p className="small muted">{record.customBrief ?? PROJECT_BRIEF}</p>
          <div className="panel-h">Building a {typeName} map</div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: 7 }} onClick={() => addNode('central')} disabled={!!central} data-tip={central ? 'Your map already has a central node' : undefined}>
            <CircleDot size={15} /> Add central node
          </button>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: 7 }} onClick={() => addNode('main')} disabled={!central}>
            <Plus size={15} /> Add main node
          </button>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: 7 }} onClick={() => addNode('sub')} disabled={!selected.node && !central}>
            <GitFork size={15} /> Add sub-node
          </button>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => addNode('sibling')} disabled={!selected.node}>
            <Plus size={15} /> Add sibling node
          </button>
          <p className="small muted" style={{ marginTop: 8 }}>New nodes attach to your selected node. Drag from a node’s lower handle to another node to connect them yourself.</p>

          {level === 'guided' && (
            <>
              <div className="panel-h">Guided prompt {promptIdx + 1} of {prompts.length}</div>
              <div className="note" style={{ margin: 0 }}>
                <span className="badge badge-blue" style={{ marginBottom: 6 }}>{prompts[promptIdx].component}</span>
                <p className="small" style={{ margin: 0 }}>{prompts[promptIdx].text}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPromptIdx((i) => Math.max(0, i - 1))} disabled={promptIdx === 0}>Previous</button>
                <button className="btn btn-primary btn-sm" onClick={() => setPromptIdx((i) => Math.min(prompts.length - 1, i + 1))} disabled={promptIdx === prompts.length - 1}>
                  Next prompt <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}

          {level === 'supported' && (
            <>
              <div className="panel-h">Idea cards (optional)</div>
              <p className="small muted">Click to add an idea, or write your own on the canvas.</p>
              <div>
                {ideaCards[type].map((card) => (
                  <button key={card} className="chip" onClick={() => (central ? addNode(selected.node && selected.node.data.kind !== 'central' ? 'sub' : 'main', card) : addNode('central', card))}>
                    {card}
                  </button>
                ))}
              </div>
              <div className="panel-h">Hints</div>
              <ul className="small muted" style={{ paddingLeft: 18 }}>
                {supportedHints[type].map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </>
          )}

          {level === 'independent' && (
            <>
              <div className="panel-h">Independent build</div>
              <p className="small muted">It’s all yours: construct the complete {typeName} mind map from the brief above. The checklist appears at the review step.</p>
            </>
          )}
        </aside>

        <div className="builder-canvas">
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onNodeDragStart={() => history.commit(snapshot())}
            onBeforeDelete={async (p) => { history.commit(snapshot()); return p; }}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{ type: 'default' }}
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
                <p className="small muted" style={{ margin: 0 }}>Start with “Add central node” on the left, then branch your ideas outwards.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="builder-right" aria-label="Properties and checklist">
          <div className="panel-h">Selected node</div>
          {selected.node ? (
            <>
              <label className="field-label" htmlFor="mm-label">Text (keyword or short phrase)</label>
              <input
                id="mm-label" ref={labelRef} className="text-input"
                value={(selected.node.data.label as string) ?? ''}
                onFocus={() => history.commit(snapshot())}
                onChange={(e) => updateSelected({ label: e.target.value })}
                placeholder="New idea…"
              />
              <span className="field-label">Colour</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PALETTE.map((c) => (
                  <button key={c} className={`swatch ${selected.node!.data.color === c ? 'selected' : ''}`} style={{ background: c }}
                    aria-label={`Set colour ${c}`} onClick={() => { history.commit(snapshot()); updateSelected({ color: c }); }} />
                ))}
              </div>
              <span className="field-label">Icon</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="No icon" data-tip="No icon"
                  onClick={() => { history.commit(snapshot()); updateSelected({ icon: null }); }}>–</button>
                {Object.entries(MM_ICONS).map(([key, Icon]) => (
                  <button key={key} className="icon-btn" style={{ width: 30, height: 30, background: selected.node!.data.icon === key ? 'var(--primary-tint)' : undefined }}
                    aria-label={`Icon ${key}`} data-tip={key}
                    onClick={() => { history.commit(snapshot()); updateSelected({ icon: key }); }}>
                    <Icon size={15} />
                  </button>
                ))}
              </div>
              <button className="btn btn-danger btn-sm" style={{ marginTop: 12 }} onClick={deleteSelected}>
                <Trash2 size={14} /> Delete node
              </button>
            </>
          ) : selected.edge ? (
            <>
              <p className="small muted">A branch is selected.</p>
              <button className="btn btn-danger btn-sm" onClick={deleteSelected}><Trash2 size={14} /> Delete branch</button>
            </>
          ) : (
            <p className="small muted">Select a node on the canvas to edit its text, colour and icon.</p>
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
