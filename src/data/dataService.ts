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
const MODULES: ModuleId[] = ['mindmap', 'flowchart'];

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
  constructor(private store: KVStore) {}

  private key(moduleId: ModuleId) {
    return `${KEY_PREFIX}${moduleId}`;
  }

  load(moduleId: ModuleId): SavedRecord {
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
    this.store.setItem(this.key(record.moduleId), JSON.stringify(updated));
    return updated;
  }

  reset(moduleId: ModuleId): SavedRecord {
    this.store.removeItem(this.key(moduleId));
    return newRecord(moduleId);
  }

  listAll(): SavedRecord[] {
    return MODULES.map((m) => this.load(m));
  }
}

function resolveStore(): KVStore {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return new MemoryStore();
}

export const dataService: DataService = new LocalStorageDataService(resolveStore());
