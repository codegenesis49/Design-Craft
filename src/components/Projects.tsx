import { useCallback, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import { Project, ProjectTool, projectStore, toolNames, backupAll, downloadJSON } from '../data/projects';
import { SavedRecord } from '../types';
import MindMapBuilder from './MindMapBuilder';
import FlowchartBuilder from './FlowchartBuilder';
import LayoutBuilder from './LayoutBuilder';
import MoodBoardBuilder from './MoodBoardBuilder';
import { LearningResources } from './LearningResources';
import { SaveWarningContext } from './builderShared';

const noop = () => {};
const message = (e:unknown) => e instanceof Error ? e.message : 'Saving failed. Download a backup and check that browser storage is available.';
export function ProjectThumbnail({project}:{project:Project}) {
  const art=project.record.artifactData;
  const nodes=art?.nodes ?? [];
  if (!nodes.length) return <div className="project-thumb muted">Empty {toolNames[project.tool].toLowerCase()}</div>;
  const minX=Math.min(...nodes.map(n=>n.position.x))-20,minY=Math.min(...nodes.map(n=>n.position.y))-20;
  const w=Math.max(...nodes.map(n=>n.position.x+220))-minX+20,h=Math.max(...nodes.map(n=>n.position.y+90))-minY+20;
  return <svg className="project-thumb" viewBox={`${minX} ${minY} ${w} ${h}`} role="img" aria-label={`Preview of ${project.name}`}>
    {art?.edges.map(e=>{const a=nodes.find(n=>n.id===e.source),b=nodes.find(n=>n.id===e.target);return a&&b?<line key={e.id} x1={a.position.x+80} y1={a.position.y+30} x2={b.position.x+80} y2={b.position.y+30} stroke="#8994b6" strokeWidth="3"/>:null;})}
    {nodes.map(n=><g key={n.id} transform={`translate(${n.position.x},${n.position.y})`}><rect width="200" height="70" rx="10" fill={String(n.data.colour || '#ffffff')} stroke={String(n.data.color || '#3d5ae0')} strokeWidth="2"/>{n.data.image ? <image href={String(n.data.image)} width="70" height="50" x="5" y="5"/>:null}<text x="10" y="40" fontSize="15" fill="#172347">{String(n.data.label || 'Untitled').slice(0,24)}</text></g>)}
  </svg>;
}
export default function Projects() {
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [projects,setProjects]=useState<Project[]>(()=>{try{return projectStore().list();}catch(e){setError(message(e));return [];}});
  const [name,setName]=useState(''),[brief,setBrief]=useState(''),[tool,setTool]=useState<ProjectTool>('mindmap');
  const file=useRef<HTMLInputElement>(null);
  const [restore,setRestore]=useState(false);
  function act(fn:()=>void){try{fn();setProjects(projectStore().list());setError('');}catch(e){setError(message(e));}}
  async function importFile(f?:File){if(!f)return;try{if(f.size>15_000_000)throw new Error('This backup is too large (maximum 15 MB).');const n=projectStore().importProjects(JSON.parse(await f.text()),restore);setProjects(projectStore().list());setNotice(`Imported ${n} project(s) as new copies. Existing work was not overwritten.${restore?' Missing lesson and assessment progress was also restored when available.':''}`);setError('');}catch(e){setError(message(e));}if(file.current)file.current.value='';}
  return <div className="page"><div className="section-title"><h1>My Projects</h1><button className="btn btn-secondary" onClick={()=>act(backupAll)}>Download full backup</button><button className="btn btn-secondary" onClick={()=>file.current?.click()}>Import project / backup</button><input ref={file} type="file" accept=".json,application/json" hidden onChange={e=>importFile(e.target.files?.[0])}/></div>
    <p className="note">Saved on this browser only—not a private student account. Download a backup before changing computers or clearing browser data. Imports add project copies; they do not overwrite lesson progress.</p>
    <label className="backup-option"><input type="checkbox" checked={restore} onChange={e=>setRestore(e.target.checked)}/> When importing a full backup, also restore lesson and assessment progress if it is missing on this browser. Never overwrite existing progress.</label>
    {error&&<p role="alert" className="feedback bad">{error}</p>}{notice&&<p role="status" className="feedback good">{notice}</p>}
    <form className="card card-pad project-create" onSubmit={e=>{e.preventDefault();act(()=>{projectStore().create(name,tool,brief);setName('');setBrief('');});}}>
      <h2>New project</h2><label>Project name<input className="text-input" required maxLength={160} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Lost and found app"/></label>
      <label>Design tool<select className="text-input" value={tool} onChange={e=>setTool(e.target.value as ProjectTool)}>{Object.entries(toolNames).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label>
      <label>Purpose / brief (optional)<textarea className="text-input" maxLength={2000} rows={2} value={brief} onChange={e=>setBrief(e.target.value)}/></label><button className="btn btn-primary">Create project</button>
    </form>
    <div className="grid-modules" style={{marginTop:24}}>{projects.map(p=><article className="card card-pad" key={p.id}><ProjectThumbnail project={p}/><span className="badge badge-blue">{toolNames[p.tool]}</span><h2>{p.name}</h2><p className="small muted">Created {new Date(p.createdAt).toLocaleDateString('en-GB')}<br/>Edited {new Date(p.updatedAt).toLocaleString('en-GB')}</p><div className="project-actions"><Link className="btn btn-primary" to={`/projects/${p.id}`}>Open</Link><button className="btn btn-secondary" onClick={()=>act(()=>{const n=prompt('Project name',p.name);if(n?.trim())projectStore().save({...p,name:n.trim().slice(0,160)});})}>Rename</button><button className="btn btn-secondary" onClick={()=>act(()=>{projectStore().duplicate(p);})}>Duplicate</button><button className="btn btn-secondary" onClick={()=>downloadJSON({format:'designcraft-project',version:1,project:p},`${p.name}.json`)}>Download</button><button className="btn btn-danger" onClick={()=>{if(confirm(`Delete “${p.name}” from this browser? Download a copy first if you want to keep it.`))act(()=>projectStore().remove(p.id));}}>Delete</button></div></article>)}</div>
    {!projects.length&&!error&&<p>No projects yet. Create one above. Recognised existing lesson work is copied here once, without changing the lesson. These copies are separate from your ongoing guided lessons.</p>}
  </div>;
}
export function ProjectEditor() {
  const {id}=useParams();
  return <ProjectEditorBody key={id} id={id || ''}/>;
}
function ProjectEditorBody({id}:{id:string}) {
  const [error,setError]=useState('');
  const [project,setProject]=useState<Project|undefined>(()=>{try{return projectStore().get(id);}catch{return undefined;}});
  const latest=useRef(project);
  const update=useCallback((patch:Partial<SavedRecord>)=>{
    if(!latest.current)return;
    const next={...latest.current,record:{...latest.current.record,...patch}};
    latest.current=next;
    try{const saved=projectStore().save(next);latest.current=saved;setProject(saved);setError('');}catch(e){setProject(next);setError(message(e));}
  },[]);
  if(!project)return <div className="page"><h1>Project unavailable</h1><p>It may have been deleted, or this browser cannot read its stored data. No data has been reset.</p><Link to="/projects">Back to My Projects</Link></div>;
  return <div className="page" style={{maxWidth:'none'}}><div className="section-title"><Link className="btn btn-secondary" to="/projects">← My Projects</Link><h1>{project.name}</h1><span className="badge badge-blue">{toolNames[project.tool]}</span><button className="btn btn-secondary" onClick={()=>downloadJSON({format:'designcraft-project',version:1,project:latest.current},`${project.name}.json`)}>Download editable project</button></div>
    {error&&<div className="feedback bad" role="alert">Not saved to this browser: {error} Your current design is still open. Download it now.<button className="btn btn-secondary" onClick={()=>update({})}>Retry save</button></div>}
    {project.tool==='mindmap'&&<label>Mind-map type <select className="text-input" style={{width:'auto',display:'inline-block'}} value={project.record.selectedMindMapType || 'library'} onChange={e=>update({selectedMindMapType:e.target.value as SavedRecord['selectedMindMapType']})}><option value="library">Library / reference</option><option value="tunnel">Tunnel timeline</option><option value="presentation">Presentation</option></select></label>}
    <SaveWarningContext.Provider value={error}><ReactFlowProvider>{project.tool==='mindmap'?<MindMapBuilder record={project.record} update={update} onStatus={noop}/>:project.tool==='flowchart'?<FlowchartBuilder record={project.record} update={update} onStatus={noop}/>:project.tool==='moodboard'?<MoodBoardBuilder record={project.record} update={update}/>:<LayoutBuilder moduleId={project.tool} record={project.record} update={update} onStatus={noop}/>}</ReactFlowProvider></SaveWarningContext.Provider>
    <details className="card card-pad" style={{marginTop:20}}><summary>Examples and learning resources</summary><LearningResources tool={project.tool}/></details>
  </div>;
}
