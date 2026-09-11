import { ModuleId, SavedRecord, newRecord } from '../types';

/**
 * Storage abstraction. The rest of the app only ever talks to this interface,
 * so localStorage can later be replaced by a database-backed implementation
 * without rebuilding the editors.
 */
export interface DataService {
  load(moduleId: ModuleId): SavedRecord;
  save(record: SavedRecord): SavedRecord;
  reset(moduleId: ModuleId): SavedRecord;
  listAll(): SavedRecord[];
}

const KEY_PREFIX = 'designcraft.v1.';
const MODULES: ModuleId[] = ['mindmap', 'flowchart', 'visualisation', 'wireframe'];

/** Minimal storage shape so the service can be unit-tested without a browser. */
export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStore implements KVStore {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

export class LocalStorageDataService implements DataService {
  private unsaved = new Map<ModuleId, SavedRecord>();
  constructor(private store: KVStore) {}

  private key(moduleId: ModuleId) {
    return `${KEY_PREFIX}${moduleId}`;
  }

  load(moduleId: ModuleId): SavedRecord {
    if (this.unsaved.has(moduleId)) return this.unsaved.get(moduleId)!;
    const raw = this.store.getItem(this.key(moduleId));
    if (!raw) return newRecord(moduleId);
    try {
      const parsed = JSON.parse(raw) as SavedRecord;
      if (parsed.schemaVersion !== 1) return newRecord(moduleId);
      // fill any fields added since the record was written
      return { ...newRecord(moduleId), ...parsed };
    } catch {
      return newRecord(moduleId);
    }
  }

  save(record: SavedRecord): SavedRecord {
    const updated: SavedRecord = {
      ...record,
      startedAt: record.startedAt ?? new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      completionStatus:
        record.completionStatus === 'complete' ? 'complete' : 'in-progress',
    };
    try {
      const old=this.store.getItem(this.key(record.moduleId));
      if(old){let incompatible=false;try{incompatible=JSON.parse(old).schemaVersion!==1;}catch{incompatible=true;}if(incompatible)this.store.setItem(`${this.key(record.moduleId)}.recovery.${Date.now()}`,old);}
      this.store.setItem(this.key(record.moduleId), JSON.stringify(updated));
      this.unsaved.delete(record.moduleId);
      if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('designcraft-storage-warning',{detail:this.unsaved.size?'Some lesson changes are not saved. Download the open lesson records before leaving.':''}));
    } catch {
      this.unsaved.set(record.moduleId,updated);
      if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('designcraft-storage-warning',{detail:'Browser saving failed. Current lesson work is only in this open page. Download it before leaving.'}));
    }
    return updated;
  }

  reset(moduleId: ModuleId): SavedRecord {
    this.unsaved.delete(moduleId);
    this.store.removeItem(this.key(moduleId));
    return newRecord(moduleId);
  }

  listAll(): SavedRecord[] {
    return MODULES.map((m) => this.load(m));
  }
}

function resolveStore(): KVStore {
  if (typeof window !== 'undefined') {
    return {getItem:(k)=>{try{return window.localStorage.getItem(k);}catch{return null;}},setItem:(k,v)=>window.localStorage.setItem(k,v),removeItem:(k)=>window.localStorage.removeItem(k)};
  }
  return new MemoryStore();
}

export const dataService: DataService = new LocalStorageDataService(resolveStore());
