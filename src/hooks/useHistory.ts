import { useCallback, useRef, useState } from 'react';

/** Simple snapshot-based undo/redo. Call commit(snapshot) BEFORE applying a change. */
export function useHistory<T>(limit = 60) {
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [, bump] = useState(0);

  const commit = useCallback((snapshot: T) => {
    past.current.push(snapshot);
    if (past.current.length > limit) past.current.shift();
    future.current = [];
    bump((n) => n + 1);
  }, [limit]);

  const undo = useCallback((current: T): T | null => {
    const prev = past.current.pop();
    if (prev === undefined) return null;
    future.current.push(current);
    bump((n) => n + 1);
    return prev;
  }, []);

  const redo = useCallback((current: T): T | null => {
    const next = future.current.pop();
    if (next === undefined) return null;
    past.current.push(current);
    bump((n) => n + 1);
    return next;
  }, []);

  const clear = useCallback(() => {
    past.current = [];
    future.current = [];
    bump((n) => n + 1);
  }, []);

  return {
    commit, undo, redo, clear,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
