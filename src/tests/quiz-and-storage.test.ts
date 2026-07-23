import { describe, expect, it } from 'vitest';
import { prepareQuiz, scoreQuiz, masteryLevel, topicsToRevisit, improvement, seededShuffle } from '../logic/quiz';
import { mindmapQuiz } from '../content/mindmap';
import { flowchartQuiz } from '../content/flowchart';
import { LocalStorageDataService, MemoryStore } from '../data/dataService';
import { newRecord } from '../types';

describe('Knowledge-check scoring', () => {
  it('scores a perfect attempt as 10/10', () => {
    const answers = Object.fromEntries(mindmapQuiz.map((q) => [q.id, q.options[q.answer]]));
    const result = scoreQuiz(mindmapQuiz, answers);
    expect(result.score).toBe(10);
    expect(result.total).toBe(10);
  });
  it('scores partial attempts accurately', () => {
    const answers = Object.fromEntries(
      flowchartQuiz.map((q, i) => [q.id, i < 6 ? q.options[q.answer] : q.options[(q.answer + 1) % q.options.length]])
    );
    expect(scoreQuiz(flowchartQuiz, answers).score).toBe(6);
  });
  it('maps scores to the correct mastery levels', () => {
    expect(masteryLevel(10)).toBe('Mastered');
    expect(masteryLevel(9)).toBe('Mastered');
    expect(masteryLevel(8)).toBe('Secure');
    expect(masteryLevel(7)).toBe('Secure');
    expect(masteryLevel(6)).toBe('Developing');
    expect(masteryLevel(5)).toBe('Developing');
    expect(masteryLevel(4)).toBe('Review Read and Learn');
    expect(masteryLevel(0)).toBe('Review Read and Learn');
  });
  it('collects topics to revisit from incorrect answers only', () => {
    const answers = Object.fromEntries(mindmapQuiz.map((q) => [q.id, q.options[q.answer]]));
    answers['mm6'] = mindmapQuiz.find((q) => q.id === 'mm6')!.options[1]; // wrong software answer
    const topics = topicsToRevisit(mindmapQuiz, scoreQuiz(mindmapQuiz, answers));
    expect(topics).toEqual(['Suitable software']);
  });
  it('randomises question and option order deterministically per seed', () => {
    const a = prepareQuiz(mindmapQuiz, 42);
    const b = prepareQuiz(mindmapQuiz, 42);
    const c = prepareQuiz(mindmapQuiz, 43);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    expect(a.map((q) => q.id)).not.toEqual(c.map((q) => q.id));
    // options are permutations, never lost
    for (const q of a) expect([...q.shuffledOptions].sort()).toEqual([...q.options].sort());
  });
  it('shuffle preserves all items', () => {
    expect(seededShuffle([1, 2, 3, 4, 5], 7).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('Retry logic', () => {
  it('stores first and retry scores separately and reports improvement', () => {
    const svc = new LocalStorageDataService(new MemoryStore());
    let rec = svc.load('mindmap');
    const wrongAnswers = Object.fromEntries(mindmapQuiz.map((q) => [q.id, q.options[(q.answer + 1) % q.options.length]]));
    const first = scoreQuiz(mindmapQuiz, { ...wrongAnswers, mm1: mindmapQuiz[0].options[mindmapQuiz[0].answer] });
    rec = svc.save({ ...rec, firstScore: first, attemptNumber: 1 });
    const rightAnswers = Object.fromEntries(mindmapQuiz.map((q) => [q.id, q.options[q.answer]]));
    const retry = scoreQuiz(mindmapQuiz, rightAnswers);
    rec = svc.save({ ...rec, retryScore: retry, attemptNumber: 2 });

    const loaded = svc.load('mindmap');
    expect(loaded.firstScore?.score).toBe(1);
    expect(loaded.retryScore?.score).toBe(10);
    expect(loaded.attemptNumber).toBe(2);
    expect(improvement(loaded.firstScore, loaded.retryScore)).toBe(9);
  });
});

describe('Saving and restoring', () => {
  it('round-trips a full record including the design, type and support level', () => {
    const svc = new LocalStorageDataService(new MemoryStore());
    const rec = svc.load('mindmap');
    const art = {
      nodes: [{ id: 'c', type: 'mind', position: { x: 1, y: 2 }, data: { kind: 'central', label: 'Hospital appointment system' } }],
      edges: [],
    };
    svc.save({ ...rec, artifactData: art, selectedMindMapType: 'tunnel', supportLevel: 'supported', maxStep: 5 });
    const loaded = svc.load('mindmap');
    expect(loaded.artifactData?.nodes[0].data.label).toBe('Hospital appointment system');
    expect(loaded.selectedMindMapType).toBe('tunnel');
    expect(loaded.supportLevel).toBe('supported');
    expect(loaded.maxStep).toBe(5);
    expect(loaded.completionStatus).toBe('in-progress');
    expect(loaded.lastSavedAt).toBeTruthy();
    expect(loaded.startedAt).toBeTruthy();
  });
  it('keeps modules independent and resets cleanly', () => {
    const svc = new LocalStorageDataService(new MemoryStore());
    svc.save({ ...svc.load('mindmap'), maxStep: 4 });
    svc.save({ ...svc.load('flowchart'), maxStep: 2 });
    expect(svc.load('mindmap').maxStep).toBe(4);
    expect(svc.load('flowchart').maxStep).toBe(2);
    svc.reset('mindmap');
    expect(svc.load('mindmap').maxStep).toBe(0);
    expect(svc.load('flowchart').maxStep).toBe(2);
  });
  it('survives corrupt stored data by returning a fresh record', () => {
    const store = new MemoryStore();
    store.setItem('designcraft.v1.mindmap', '{not json');
    const svc = new LocalStorageDataService(store);
    expect(svc.load('mindmap')).toEqual(newRecord('mindmap'));
  });
  it('records personal-data fields as null (no collection)', () => {
    const rec = newRecord('flowchart');
    expect(rec.studentId).toBeNull();
    expect(rec.classId).toBeNull();
    expect(rec.assignmentId).toBeNull();
    expect(rec.schemaVersion).toBe(1);
  });
});

describe('Mind-map type selection', () => {
  it('persists the selected type into saved evidence', () => {
    const svc = new LocalStorageDataService(new MemoryStore());
    for (const type of ['library', 'tunnel', 'presentation'] as const) {
      svc.save({ ...svc.load('mindmap'), selectedMindMapType: type });
      expect(svc.load('mindmap').selectedMindMapType).toBe(type);
    }
  });
});
