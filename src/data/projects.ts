import { ArtifactData, ModuleId, SavedRecord, newRecord } from '../types';
import { KVStore } from './dataService';

export type ProjectTool = ModuleId | 'moodboard';
export const toolNames: Record<ProjectTool, string> = { mindmap: 'Mind map', flowchart: 'Flowchart', visualisation: 'Visualisation diagram', wireframe: 'Wireframe', moodboard: 'Mood board' };
export const projectKey = 'designcraft.projects.v1';
export interface Project { id: string; name: string; tool: ProjectTool; createdAt: string; updatedAt: string; record: SavedRecord; }
interface Collection { version: 1; projects: Project[]; migrated: string[]; }
const modules: ModuleId[] = ['mindmap', 'flowchart', 'visualisation', 'wireframe'];
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
export function validArtifact(a: unknown): a is ArtifactData {
  if (!a || typeof a !== 'object') return false;
  const v = a as ArtifactData;
  if (!Array.isArray(v.nodes) || !Array.isArray(v.edges) || v.nodes.length > 2000 || v.edges.length > 5000) return false;
  const ids = new Set<string>();
  for (const n of v.nodes) {
    if (!n || typeof n.id !== 'string' || ids.has(n.id) || !['mind', 'fc', 'layout'].includes(n.type) || !n.position || !Number.isFinite(n.position.x) || !Number.isFinite(n.position.y) || !n.data || typeof n.data !== 'object') return false;
    if (n.type === 'fc' && !['start','end','process','decision','io','connector'].includes(String(n.data.symbol))) return false;
    if (n.data.label != null && typeof n.data.label !== 'string') return false;
    if (n.data.icon != null && !['user','users','monitor','keyboard','accessibility','shield','calendar','bell','audio','heart','idea','pin'].includes(String(n.data.icon))) return false;
    if (n.data.image && !/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(String(n.data.image))) return false;
    ids.add(n.id);
  }
  return v.edges.every(e => e && typeof e.id === 'string' && ids.has(e.source) && ids.has(e.target));
}
export function validRecord(r: any): r is SavedRecord {
  return r && r.schemaVersion === 1 && modules.includes(r.moduleId) && Number.isInteger(r.maxStep) && r.maxStep >= 0 && (r.artifactData == null || validArtifact(r.artifactData)) && [null,'guided','supported','independent'].includes(r.supportLevel) && [null,'library','tunnel','presentation'].includes(r.selectedMindMapType);
}
export function validProject(p: any): p is Project {
  return p && typeof p.id === 'string' && typeof p.name === 'string' && p.name.length <= 160 && Object.keys(toolNames).includes(p.tool) && typeof p.createdAt === 'string' && typeof p.updatedAt === 'string' && validRecord(p.record) && p.record.moduleId === (p.tool === 'moodboard' ? 'visualisation' : p.tool);
}
export class ProjectStore {
  constructor(private storage: KVStore) {}
  private read(): Collection {
    const raw = this.storage.getItem(projectKey);
    if (!raw) return {version: 1, projects: [], migrated: []};
    const c = JSON.parse(raw);
    if (c.version !== 1 || !Array.isArray(c.projects) || !c.projects.every(validProject) || !Array.isArray(c.migrated)) throw new Error('Project data could not be read. It has not been replaced. Download a backup before trying a repair.');
    return c;
  }
  private write(c: Collection) { this.storage.setItem(projectKey, JSON.stringify(c)); }
  list(): Project[] {
    const c = this.read();
    let changed = false;
    for (const m of modules) {
      if (c.migrated.includes(m)) continue;
      const raw = this.storage.getItem(`designcraft.v1.${m}`);
      if (!raw) continue;
      try {
        const r = JSON.parse(raw);
        if (!validRecord(r) || (!r.artifactData && !r.startedAt)) continue;
        const now = new Date().toISOString();
        c.projects.push({id: `legacy-${m}`, name: `Hospital appointments — ${toolNames[m]}`, tool:m, createdAt:r.startedAt || now, updatedAt:r.lastSavedAt || now, record:clone(r)});
        c.migrated.push(m); changed = true;
      } catch { /* Leave unrecognised legacy data untouched. */ }
    }
    if (changed) this.write(c);
    return c.projects.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  get(id: string) { return this.list().find(p => p.id === id); }
  create(name: string, tool: ProjectTool, brief = '') {
    this.list();
    const now = new Date().toISOString();
    const p: Project = {id:crypto.randomUUID(), name:name.trim().slice(0,160) || `Untitled ${toolNames[tool]}`, tool, createdAt:now, updatedAt:now, record:{...newRecord(tool === 'moodboard' ? 'visualisation' : tool), supportLevel:'independent', selectedMindMapType:tool === 'mindmap' ? 'library' : null, customBrief:brief || 'Create your own design. Choose a purpose and organise your ideas clearly.', artifactData:{nodes:[],edges:[]}}};
    const c = this.read(); c.projects.push(p); this.write(c); return p;
  }
  save(p: Project) {
    if (!validProject(p)) throw new Error('This project contains unsupported data. The saved copy has not been changed.');
    const c = this.read();
    if (!c.projects.some(x=>x.id===p.id)) throw new Error('This project was removed in another tab. Download your design before leaving.');
    const existing=c.projects.find(x=>x.id===p.id)!;
    if(existing.updatedAt!==p.updatedAt)throw new Error('This project changed in another tab. Download your open version, then reopen the saved project to avoid overwriting it.');
    const updated = {...p, updatedAt:new Date(Math.max(Date.now(),Date.parse(p.updatedAt)+1)).toISOString()};
    c.projects = c.projects.map(x=>x.id===p.id ? updated : x); this.write(c); return updated;
  }
  duplicate(p: Project) {
    const c = this.read(); const now = new Date().toISOString();
    const copy = {...clone(p), id:crypto.randomUUID(), name:`${p.name.slice(0,150)} (copy)`, createdAt:now, updatedAt:now};
    c.projects.push(copy); this.write(c); return copy;
  }
  remove(id: string) { const c=this.read(); c.projects=c.projects.filter(p=>p.id!==id); this.write(c); }
  importProjects(input: unknown, restoreMissingProgress = false) {
    const v = input as any;
    const items = v?.format === 'designcraft-backup' ? v.projects : v?.format === 'designcraft-project' ? [v.project] : null;
    if (v?.version !== 1 || !Array.isArray(items) || items.length > 500 || !items.every(validProject)) throw new Error('Choose a valid DesignCraft project or backup JSON file. No saved work has been changed.');
    const c = this.read(); const now = new Date().toISOString();
    const copies = items.map((p:Project)=>({...clone(p),id:crypto.randomUUID(),name:`${p.name.slice(0,148)} (imported)`,updatedAt:now}));
    const restores: [string,string][]=[];
    if (restoreMissingProgress && v.format === 'designcraft-backup' && v.raw && typeof v.raw === 'object') {
      for (const [key,raw] of Object.entries(v.raw)) {
        if(typeof raw!=='string' || this.storage.getItem(key)!==null)continue;
        if(/^designcraft\.v1\.(mindmap|flowchart|visualisation|wireframe)$/.test(key)) {
          const r=JSON.parse(raw);if(!validRecord(r) || key!==`designcraft.v1.${r.moduleId}`)throw new Error('The backup contains invalid lesson progress. Nothing has been imported.');
          restores.push([key,raw]);
          if(!c.migrated.includes(r.moduleId))c.migrated.push(r.moduleId);
        } else if (/^designcraft\.read\.v1\.(mindmap|flowchart|visualisation|wireframe)$/.test(key)) {
          const r=JSON.parse(raw);if(!Array.isArray(r)||!r.every(x=>typeof x==='string'))throw new Error('Invalid reading progress. Nothing has been imported.');restores.push([key,raw]);
        } else if (/^designcraft\.practice\.v1\.(mindmap|flowchart|visualisation|wireframe|moodboard|final)$/.test(key)) {
          const r=JSON.parse(raw);if(r.version!==1||!r.draft||!Array.isArray(r.attempts)||!r.attempts.every((a:any)=>a&&Number.isFinite(a.score)&&Number.isFinite(a.total)&&a.answers&&typeof a.at==='string'))throw new Error('Invalid assessment progress. Nothing has been imported.');restores.push([key,raw]);
        }
      }
    }
    const previous=this.storage.getItem(projectKey);
    const written:string[]=[];
    try {
      c.projects.push(...copies);this.write(c);
      for(const [key,value] of restores){this.storage.setItem(key,value);written.push(key);}
    } catch(e) {
      for(const key of written)this.storage.removeItem(key);
      if(previous!==null)this.storage.setItem(projectKey,previous);else this.storage.removeItem(projectKey);
      throw e;
    }
    return copies.length;
  }
}
export const projectStore = () => new ProjectStore(window.localStorage);
export function downloadJSON(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value,null,2)], {type:'application/json'}));
  const a=document.createElement('a'); a.href=url; a.download=name.replace(/[^a-zA-Z0-9_.-]/g,'-'); a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function backupAll() {
  let projects:Project[]=[];
  try{projects=projectStore().list();}catch{/* Still allow a raw recovery backup of unreadable data. */}
  const raw: Record<string,string>={};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)!;if(k.startsWith('designcraft.'))raw[k]=localStorage.getItem(k)!;}
  downloadJSON({format:'designcraft-backup',version:1,exportedAt:new Date().toISOString(),projects,raw},'DesignCraft-backup.json');
}
