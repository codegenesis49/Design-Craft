import { describe, expect, it } from 'vitest';
import { MemoryStore, LocalStorageDataService } from '../data/dataService';
import { ProjectStore, projectKey, validArtifact, ProjectTool } from '../data/projects';
import { newRecord } from '../types';
import { practiceBanks, finalBank } from '../content/examPractice';
import { scoreQuiz } from '../logic/quiz';

describe('Existing progress and independent projects',()=>{
  it('copies legacy work once without changing any original bytes or scores',()=>{
    const storage=new MemoryStore();const lessons=new LocalStorageDataService(storage);
    lessons.save({...newRecord('mindmap'),maxStep:7,selectedMindMapType:'tunnel',supportLevel:'guided',firstScore:{score:7,total:10,answers:{a:'b'},at:'2026-09-10'},artifactData:{nodes:[{id:'c',type:'mind',position:{x:22,y:40},data:{label:'Saved original',kind:'central'}}],edges:[]}});
    const raw=storage.getItem('designcraft.v1.mindmap');
    const svc=new ProjectStore(storage);expect(svc.list()).toHaveLength(1);expect(svc.list()).toHaveLength(1);
    const p=svc.list()[0];expect(p.record.maxStep).toBe(7);expect(p.record.firstScore?.score).toBe(7);
    svc.save({...p,name:'Renamed copy'});expect(storage.getItem('designcraft.v1.mindmap')).toBe(raw);
    svc.remove(p.id);expect(svc.list()).toHaveLength(0);expect(storage.getItem('designcraft.v1.mindmap')).toBe(raw);
  });
  it('keeps five tool types and multiple mind maps separate across reopening',()=>{
    const storage=new MemoryStore(),svc=new ProjectStore(storage);
    const tools:ProjectTool[]=['mindmap','flowchart','visualisation','wireframe','moodboard','mindmap'];
    const projects=tools.map((tool,i)=>svc.create(`Design ${i}`,tool,'My own task'));
    const p=projects[0];svc.save({...p,record:{...p.record,artifactData:{nodes:[{id:'a',type:'mind',position:{x:10,y:20},data:{label:'First',kind:'central'}}],edges:[]}}});
    const reopened=new ProjectStore(storage);expect(reopened.list()).toHaveLength(6);expect(reopened.get(p.id)?.record.artifactData?.nodes[0].data.label).toBe('First');expect(reopened.get(projects[5].id)?.record.artifactData?.nodes).toHaveLength(0);
    expect(storage.getItem('designcraft.v1.mindmap')).toBeNull();
  });
  it('duplicates as an independent editable copy and imports without overwriting',()=>{
    const svc=new ProjectStore(new MemoryStore());const p=svc.create('Original','wireframe');const copy=svc.duplicate(p);expect(copy.id).not.toBe(p.id);
    svc.importProjects({format:'designcraft-project',version:1,project:p});expect(svc.list()).toHaveLength(3);expect(svc.get(p.id)?.name).toBe('Original');
  });
  it('rejects stale-tab writes without replacing saved work',()=>{
    const svc=new ProjectStore(new MemoryStore());const p=svc.create('Original','mindmap');svc.save({...p,name:'Latest'});expect(()=>svc.save({...p,name:'Stale'})).toThrow(/another tab/);expect(svc.get(p.id)?.name).toBe('Latest');
  });
  it('preserves unsupported or corrupt collections instead of resetting them',()=>{
    const storage=new MemoryStore();storage.setItem(projectKey,'{broken');const svc=new ProjectStore(storage);expect(()=>svc.create('New','flowchart')).toThrow();expect(storage.getItem(projectKey)).toBe('{broken');
  });
  it('rejects the entire import if any project is invalid',()=>{
    const storage=new MemoryStore(),svc=new ProjectStore(storage);const p=svc.create('Keep','mindmap');const before=storage.getItem(projectKey);
    expect(()=>svc.importProjects({format:'designcraft-backup',version:1,projects:[p,{name:'Bad'}]})).toThrow();expect(storage.getItem(projectKey)).toBe(before);
  });
  it('rejects unsafe images and invalid labels before rendering',()=>{
    const art={nodes:[{id:'a',type:'layout',position:{x:0,y:0},data:{image:'https://untrusted.invalid/image.jpg',label:'x'}}],edges:[]};expect(validArtifact(art)).toBe(false);
    expect(validArtifact({nodes:[{id:'a',type:'mind',position:{x:0,y:0},data:{label:{bad:true}}}],edges:[]})).toBe(false);
  });
  it('restores missing lesson and assessment records but never overwrites present ones',()=>{
    const storage=new MemoryStore(),svc=new ProjectStore(storage);const r={...newRecord('flowchart'),maxStep:4};const practice={version:1,draft:{a:'answer'},attempts:[],reviewing:false};
    const backup={format:'designcraft-backup',version:1,projects:[],raw:{'designcraft.v1.flowchart':JSON.stringify(r),'designcraft.practice.v1.flowchart':JSON.stringify(practice)}};
    svc.importProjects(backup,true);expect(JSON.parse(storage.getItem('designcraft.v1.flowchart')!).maxStep).toBe(4);expect(storage.getItem('designcraft.practice.v1.flowchart')).toBe(JSON.stringify(practice));
    svc.importProjects({...backup,raw:{'designcraft.v1.flowchart':JSON.stringify({...r,maxStep:0})}},true);expect(JSON.parse(storage.getItem('designcraft.v1.flowchart')!).maxStep).toBe(4);
  });
  it('keeps failed saves in memory and leaves the stored copy intact',()=>{
    const storage=new MemoryStore();let fail=false;const guarded={getItem:(k:string)=>storage.getItem(k),removeItem:(k:string)=>storage.removeItem(k),setItem:(k:string,v:string)=>{if(fail)throw new Error('quota');storage.setItem(k,v);}};
    const svc=new LocalStorageDataService(guarded);svc.save({...newRecord('mindmap'),maxStep:1});fail=true;svc.save({...svc.load('mindmap'),maxStep:5});expect(svc.load('mindmap').maxStep).toBe(5);expect(JSON.parse(storage.getItem('designcraft.v1.mindmap')!).maxStep).toBe(1);
  });
});
describe('Paper-informed practice',()=>{
  it('has five distinct valid questions per tool and a separate ten-question final check',()=>{
    const all=[...Object.values(practiceBanks).flat(),...finalBank];expect(new Set(all.map(q=>q.id)).size).toBe(35);
    for(const bank of Object.values(practiceBanks)){expect(bank).toHaveLength(5);expect(scoreQuiz(bank,Object.fromEntries(bank.map(q=>[q.id,q.options[q.answer]]))).score).toBe(5);}
    expect(finalBank).toHaveLength(10);for(const q of all){expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);expect(q.explanation).toMatch(/because/);expect(q.source.length).toBeGreaterThan(5);}
  });
});
