import { describe, expect, it } from 'vitest';
import { ArtifactData } from '../types';
import { validateMindmap, checklistPassed } from '../logic/validateMindmap';
import { validateFlowchart, smartSymbolFeedback, checklistPassed as fcPassed } from '../logic/validateFlowchart';

const mm = (id: string, kind: string, label: string): any => ({ id, type: 'mind', position: { x: 0, y: 0 }, data: { kind, label } });
const edge = (s: string, t: string, label?: string): any => ({ id: `${s}-${t}`, source: s, target: t, label });
const fc = (id: string, symbol: string, label: string): any => ({ id, type: 'fc', position: { x: 0, y: 0 }, data: { symbol, label } });

function goodLibrary(): ArtifactData {
  return {
    nodes: [
      mm('c', 'central', 'Hospital appointment system'),
      mm('m1', 'main', 'Users'), mm('m2', 'main', 'Inputs'), mm('m3', 'main', 'Outputs'), mm('m4', 'main', 'Accessibility'),
      mm('s1', 'sub', 'Patients'), mm('s2', 'sub', 'Appointment reference'), mm('s3', 'sub', 'Confirmation message'), mm('s4', 'sub', 'Large text'),
    ],
    edges: [edge('c', 'm1'), edge('c', 'm2'), edge('c', 'm3'), edge('c', 'm4'), edge('m1', 's1'), edge('m2', 's2'), edge('m3', 's3'), edge('m4', 's4')],
  };
}

describe('Library validation', () => {
  it('passes a well-formed library map', () => {
    const results = validateMindmap(goodLibrary(), 'library');
    expect(checklistPassed(results)).toBe(true);
  });
  it('fails with fewer than four categories', () => {
    const art = goodLibrary();
    art.nodes = art.nodes.filter((n) => !['m3', 'm4', 's3', 's4'].includes(n.id));
    art.edges = art.edges.filter((e) => !e.id.includes('m3') && !e.id.includes('m4'));
    const results = validateMindmap(art, 'library');
    expect(results.find((r) => r.id === 'categories')?.status).toBe('fail');
  });
  it('flags disconnected nodes', () => {
    const art = goodLibrary();
    art.nodes.push(mm('orphan', 'main', 'Floating idea'));
    const results = validateMindmap(art, 'library');
    expect(results.find((r) => r.id === 'connected')?.status).toBe('fail');
    expect(results.find((r) => r.id === 'connected')?.message).toContain('not connected');
  });
  it('warns about long paragraphs instead of keywords', () => {
    const art = goodLibrary();
    art.nodes[1].data.label = 'this is a very long sentence that should really be a keyword or short phrase not a paragraph of text';
    const results = validateMindmap(art, 'library');
    expect(results.find((r) => r.id === 'keywords')?.status).toBe('warn');
  });
  it('fails when no central node exists', () => {
    const art = goodLibrary();
    art.nodes = art.nodes.filter((n) => n.id !== 'c');
    const results = validateMindmap(art, 'library');
    expect(results.find((r) => r.id === 'central')?.status).toBe('fail');
  });
});

describe('Tunnel Timeline validation', () => {
  function goodTunnel(): ArtifactData {
    return {
      nodes: [
        mm('c', 'central', 'Create an accessible hospital appointment system'),
        mm('m1', 'main', 'Investigate user needs'), mm('m2', 'main', 'Design the interface'), mm('m3', 'main', 'Test accessibility'),
        mm('s1', 'sub', 'Interview patients'), mm('s2', 'sub', 'Screen reader check'),
      ],
      edges: [edge('c', 'm1'), edge('c', 'm2'), edge('c', 'm3'), edge('m1', 's1'), edge('m3', 's2')],
    };
  }
  it('passes a problem-solving map without any dates or milestones', () => {
    const results = validateMindmap(goodTunnel(), 'tunnel');
    expect(checklistPassed(results)).toBe(true);
    // no check should ever demand dates or chronological order
    expect(results.some((r) => /date|chronolog|milestone/i.test(r.label))).toBe(false);
  });
  it('fails when there are too few paths', () => {
    const art = goodTunnel();
    art.nodes = art.nodes.filter((n) => !['m2', 'm3', 's2'].includes(n.id));
    art.edges = art.edges.filter((e) => ['c-m1', 'm1-s1'].includes(e.id));
    const results = validateMindmap(art, 'tunnel');
    expect(results.find((r) => r.id === 'paths')?.status).toBe('fail');
    expect(results.find((r) => r.id === 'paths')?.message).toContain('paths towards solving a problem');
  });
  it('fails when no path is developed towards a solution', () => {
    const art = goodTunnel();
    art.nodes = art.nodes.filter((n) => n.data.kind !== 'sub');
    art.edges = art.edges.filter((e) => e.source === 'c');
    const results = validateMindmap(art, 'tunnel');
    expect(results.find((r) => r.id === 'complete-path')?.status).toBe('fail');
  });
});

describe('Presentation validation', () => {
  function goodPresentation(): ArtifactData {
    return {
      nodes: [
        mm('c', 'central', 'Proposed hospital appointment kiosk'),
        mm('m1', 'main', 'Why it is needed'), mm('m2', 'main', 'Key features'), mm('m3', 'main', 'Benefits for patients'),
        mm('s1', 'sub', 'Shorter queues'), mm('s2', 'sub', 'Accessible design'),
      ],
      edges: [edge('c', 'm1'), edge('c', 'm2'), edge('c', 'm3'), edge('m1', 's1'), edge('m2', 's2')],
    };
  }
  it('passes an audience-ready map', () => {
    expect(checklistPassed(validateMindmap(goodPresentation(), 'presentation'))).toBe(true);
  });
  it('fails without enough main sections', () => {
    const art = goodPresentation();
    art.nodes = art.nodes.filter((n) => !['m2', 'm3', 's2'].includes(n.id));
    art.edges = art.edges.filter((e) => ['c-m1', 'm1-s1'].includes(e.id));
    const results = validateMindmap(art, 'presentation');
    expect(results.find((r) => r.id === 'sections')?.status).toBe('fail');
  });
  it('warns about wording too long for an audience', () => {
    const art = goodPresentation();
    art.nodes[1].data.label = 'a very long section heading that an audience could never read at a glance';
    const results = validateMindmap(art, 'presentation');
    expect(results.find((r) => r.id === 'audience')?.status).toBe('warn');
  });
});

describe('Flowchart validation', () => {
  function goodFlow(): ArtifactData {
    return {
      nodes: [
        fc('st', 'start', 'Start'),
        fc('io1', 'io', 'Display welcome screen'),
        fc('io2', 'io', 'Input appointment reference'),
        fc('p1', 'process', 'Check details'),
        fc('d1', 'decision', 'Are the details valid?'),
        fc('io3', 'io', 'Display error'),
        fc('p2', 'process', 'Retrieve appointment'),
        fc('en', 'end', 'End'),
      ],
      edges: [
        edge('st', 'io1'), edge('io1', 'io2'), edge('io2', 'p1'), edge('p1', 'd1'),
        edge('d1', 'io3', 'No'), edge('io3', 'io2'), edge('d1', 'p2', 'Yes'), edge('p2', 'en'),
      ],
    };
  }
  it('passes a valid flowchart including a loop', () => {
    expect(fcPassed(validateFlowchart(goodFlow()))).toBe(true);
  });
  it('requires exactly one Start', () => {
    const art = goodFlow();
    art.nodes.push(fc('st2', 'start', 'Start'));
    art.edges.push(edge('st2', 'io1'));
    expect(validateFlowchart(art).find((r) => r.id === 'start')?.status).toBe('fail');
  });
  it('requires at least one End and a route that reaches it', () => {
    const art = goodFlow();
    art.nodes = art.nodes.filter((n) => n.id !== 'en');
    art.edges = art.edges.filter((e) => e.target !== 'en');
    const results = validateFlowchart(art);
    expect(results.find((r) => r.id === 'end')?.status).toBe('fail');
  });
  it('detects unreachable symbols via arrow direction', () => {
    const art = goodFlow();
    art.nodes.push(fc('lost', 'process', 'Save log'));
    art.edges.push(edge('lost', 'en')); // points out, but nothing points in
    const results = validateFlowchart(art);
    expect(results.find((r) => r.id === 'reachable')?.status).toBe('fail');
  });
  it('requires two labelled routes out of every decision', () => {
    const art = goodFlow();
    art.edges = art.edges.map((e) => (e.id === 'd1-io3' ? { ...e, label: undefined } : e));
    const results = validateFlowchart(art);
    expect(results.find((r) => r.id === 'decision-labels')?.status).toBe('fail');
  });
  it('suggests an Input/Output symbol for "Enter date of birth" in a process', () => {
    const art = goodFlow();
    art.nodes.push(fc('p9', 'process', 'Enter date of birth'));
    art.edges.push(edge('io2', 'p9'), edge('p9', 'p1'));
    const smart = smartSymbolFeedback(art);
    expect(smart.some((r) => r.message.includes('Input/Output'))).toBe(true);
  });
  it('suggests a Decision symbol for a question in a process rectangle', () => {
    const smart = smartSymbolFeedback({ nodes: [fc('p1', 'process', 'Is the patient registered?')], edges: [] });
    expect(smart.some((r) => r.message.includes('decision diamond'))).toBe(true);
  });
  it('suggests a Process symbol for an action in a decision diamond', () => {
    const smart = smartSymbolFeedback({ nodes: [fc('d1', 'decision', 'Display the appointment')], edges: [] });
    expect(smart.some((r) => r.message.includes('process rectangle'))).toBe(true);
  });
});
