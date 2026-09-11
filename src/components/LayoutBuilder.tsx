import { DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, Background, BackgroundVariant, Node, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { Trash2, Plus } from 'lucide-react';
import { ArtifactData, ModuleId, PROJECT_BRIEF, SavedRecord } from '../types';
import { validateLayout, layoutChecklistPassed } from '../logic/validateLayout';
import { useHistory } from '../hooks/useHistory';
import { BuilderToolbar, ChecklistPanel } from './builderShared';

type LayoutModule = Extract<ModuleId,'visualisation'|'wireframe'>;
type Kind = 'heading'|'text'|'image'|'annotation'|'colour'|'input'|'button'|'nav';
const LABELS: Record<Kind,string> = {
  heading:'Page heading', text:'Text area', image:'Image placeholder', annotation:'Annotation',
  colour:'Colour / theme', input:'Input field', button:'Button', nav:'Navigation / help',
};

export function LayoutNode({data}:{data:any}) {
  const kind = data.kind as Kind;
  return (
    <div className={`layout-node layout-${kind}`} style={{background:String(data.colour || '') || undefined}}>
      {kind === 'image' && <div className="image-cross" aria-hidden="true" />}
      {kind === 'colour' && <span className="swatch-dot" aria-hidden="true" />}
      <span>{String(data.label || LABELS[kind])}</span>
    </div>
  );
}
const nodeTypes = { layout: LayoutNode };

export default function LayoutBuilder({moduleId,record,update,onStatus}:{moduleId:LayoutModule;record:SavedRecord;update:(p:Partial<SavedRecord>)=>void;onStatus:(s:{nodeCount:number;passed:boolean})=>void}) {
  const initial = record.artifactData ?? {nodes:[],edges:[]};
  const [nodes,setNodes,onNodesChange] = useNodesState(initial.nodes as Node[]);
  const [edges,setEdges,onEdgesChange] = useEdgesState(initial.edges as any[]);
  const [selected,setSelected] = useState<string|null>(null);
  const [saveState,setSaveState] = useState<'saved'|'saving'|'idle'>('idle');
  const wrap = useRef<HTMLDivElement>(null);
  const {screenToFlowPosition,fitView} = useReactFlow();
  const history = useHistory<ArtifactData>();
  const results = useMemo(()=>validateLayout({nodes:nodes as any,edges:[]},moduleId),[nodes,moduleId]);
  const selectedNode = nodes.find(n=>n.id===selected);
  const title = moduleId === 'wireframe' ? 'Wireframe' : 'Visualisation diagram';
  const kinds: Kind[] = moduleId === 'wireframe'
    ? ['heading','text','image','input','button','nav']
    : ['heading','text','image','annotation','colour'];

  const snapshot=()=>({nodes:nodes as any,edges:[]});
  const commit=()=>history.commit(snapshot());
  const add = useCallback((kind:Kind,pos?:{x:number;y:number})=>{
    commit();
    setNodes(ns=>[...ns,{id:`layout-${Date.now()}-${Math.random()}`,type:'layout',position:pos??{x:180+ns.length*18,y:100+ns.length*22},data:{kind,label:LABELS[kind],colour:kind==='colour'?'#dbe4ff':''},style:{width:kind==='heading'?300:kind==='text'?260:kind==='image'?220:kind==='input'?260:kind==='button'?150:kind==='nav'?170:220}}]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[setNodes,nodes,history]);
  const onDragStart=(e:DragEvent,kind:Kind)=>{e.dataTransfer.setData('application/designcraft-kind',kind);e.dataTransfer.effectAllowed='copy';};
  const onDrop=(e:DragEvent)=>{e.preventDefault();const k=e.dataTransfer.getData('application/designcraft-kind') as Kind;if(k)add(k,screenToFlowPosition({x:e.clientX,y:e.clientY}));};
  const save=useCallback(()=>{
    setSaveState('saving');
    update({artifactData:{nodes:nodes as any,edges:[]}});
    setTimeout(()=>setSaveState('saved'),180);
  },[nodes,update]);
  useEffect(()=>{save();},[nodes,save]);
  useEffect(()=>onStatus({nodeCount:nodes.length,passed:layoutChecklistPassed(results)}),[nodes.length,results,onStatus]);
  const updateSelected=(patch:any)=>setNodes(ns=>ns.map(n=>n.id===selected?{...n,data:{...n.data,...patch}}:n));
  const remove=()=>{if(!selected)return;commit();setNodes(ns=>ns.filter(n=>n.id!==selected));setSelected(null)};
  const reset=()=>{if(confirm('Start this design again? Your current layout will be cleared.')){commit();setNodes([]);setEdges([]);update({artifactData:{nodes:[],edges:[]}})}};
  const restore=(s:ArtifactData)=>{setNodes(s.nodes as any);setEdges([])};

  return <>
    <BuilderToolbar moduleId={moduleId} undo={()=>{const s=history.undo(snapshot());if(s)restore(s)}} redo={()=>{const s=history.redo(snapshot());if(s)restore(s)}} canUndo={history.canUndo} canRedo={history.canRedo}
      onAutoLayout={()=>{commit();setNodes(ns=>ns.map((n,i)=>({...n,position:{x:80+(i%3)*300,y:70+Math.floor(i/3)*150}})));setTimeout(()=>fitView({padding:.15}),50)}}
      onSave={save} onReset={reset} nodes={nodes} saveState={saveState}
      helpText="Drag an element from the left, then select it to edit its label, size and colour." />
    <div className="builder" ref={wrap}>
      <aside className="builder-left">
        <div className="panel-h">Project brief</div><p className="small">{record.customBrief ?? PROJECT_BRIEF}</p>
        <div className="panel-h">Elements</div>
        {kinds.map(k=><button key={k} className="palette-item" draggable onDragStart={e=>onDragStart(e,k)} onClick={()=>add(k)}><Plus size={15}/><span>{LABELS[k]}</span></button>)}
        <div className="note small">{moduleId==='wireframe'?'Use simple, meaningful labels. Arrange fields and buttons in the order the user will use them.':'Plan one static screen or document. Add annotations that explain your size, position, font and colour choices.'}</div>
      </aside>
      <div className="builder-canvas" onDrop={onDrop} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'}}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes}
          onSelectionChange={({nodes:s})=>setSelected(s[0]?.id??null)} onNodeDragStart={commit} fitView proOptions={{hideAttribution:true}}>
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#d8dce8"/>
        </ReactFlow>
      </div>
      <aside className="builder-right">
        <div className="panel-h">Properties</div>
        {selectedNode ? <>
          <label className="field-label" htmlFor="layout-label">Label or content</label>
          <textarea id="layout-label" className="text-input" rows={3} value={String(selectedNode.data.label??'')} onFocus={commit} onChange={e=>updateSelected({label:e.target.value})}/>
          <label className="field-label" htmlFor="layout-colour">Element colour</label>
          <input id="layout-colour" type="color" value={String(selectedNode.data.colour||'#ffffff')} onFocus={commit} onChange={e=>updateSelected({colour:e.target.value})}/>
          <button className="btn btn-danger btn-sm" style={{marginTop:12}} onClick={remove}><Trash2 size={14}/> Delete element</button>
        </>:<p className="small muted">Select an element to edit it.</p>}
        {record.supportLevel!=='independent'&&<><div className="panel-h">Live checklist</div><ChecklistPanel results={results} compact/></>}
      </aside>
    </div>
  </>;
}
