import { ArtifactData, ArtifactNode, CheckResult } from '../types';

export type SymbolKind = 'start' | 'end' | 'process' | 'decision' | 'io' | 'connector';

const BRIEF_TERMS = [
  'appointment', 'patient', 'reference', 'date of birth', 'dob', 'confirm',
  'welcome', 'detail', 'valid', 'error', 'help', 'display', 'check', 'retrieve',
  'hospital', 'find',
];

function label(n: ArtifactNode): string {
  return String(n.data.label ?? '').trim();
}
function kind(n: ArtifactNode): SymbolKind {
  return n.data.symbol as SymbolKind;
}

const INPUT_OUTPUT_VERBS = /^(enter|input|type|scan|select|choose|display|show|output|print|read)\b/i;
const QUESTION_HINT = /\?|^(is|are|was|were|does|do|has|have|can|did|should)\b/i;
const ACTION_VERBS = /^(display|calculate|retrieve|save|add|update|store|search|check|send|open|close|reset|create|delete|load)\b/i;

/** Smart, non-silent feedback on symbol usage — the student decides what to change. */
export function smartSymbolFeedback(art: ArtifactData): CheckResult[] {
  const out: CheckResult[] = [];
  for (const n of art.nodes) {
    const text = label(n);
    if (!text) continue;
    if (kind(n) === 'process' && INPUT_OUTPUT_VERBS.test(text)) {
      out.push({
        id: `smart-${n.id}`, label: 'Symbol choice', status: 'warn',
        message: `“${text}” describes data going in or out. An Input/Output parallelogram may suit it better than a process rectangle.`,
      });
    } else if (kind(n) === 'process' && QUESTION_HINT.test(text)) {
      out.push({
        id: `smart-${n.id}`, label: 'Symbol choice', status: 'warn',
        message: `“${text}” looks like a question. A decision diamond may suit it better than a process rectangle.`,
      });
    } else if (kind(n) === 'decision' && !QUESTION_HINT.test(text) && ACTION_VERBS.test(text)) {
      out.push({
        id: `smart-${n.id}`, label: 'Symbol choice', status: 'warn',
        message: `“${text}” looks like an action, not a question. A process rectangle may suit it better than a decision diamond.`,
      });
    }
  }
  return out;
}

export function validateFlowchart(art: ArtifactData): CheckResult[] {
  const out: CheckResult[] = [];
  const starts = art.nodes.filter((n) => kind(n) === 'start');
  const ends = art.nodes.filter((n) => kind(n) === 'end');
  const decisions = art.nodes.filter((n) => kind(n) === 'decision');

  out.push(
    starts.length === 1
      ? { id: 'start', label: 'Exactly one Start', status: 'pass', message: 'Your flowchart begins with one Start terminator.' }
      : { id: 'start', label: 'Exactly one Start', status: 'fail', message: starts.length === 0 ? 'Add a Start terminator so the reader knows where the process begins.' : 'A flowchart should have exactly one Start. Remove the extra Start symbols.' }
  );

  out.push(
    ends.length >= 1
      ? { id: 'end', label: 'At least one End', status: 'pass', message: `Your flowchart has ${ends.length} End terminator${ends.length > 1 ? 's' : ''}.` }
      : { id: 'end', label: 'At least one End', status: 'fail', message: 'Add an End terminator so every route can finish.' }
  );

  const outgoing = new Map<string, typeof art.edges>();
  const touched = new Set<string>();
  for (const e of art.edges) {
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    outgoing.get(e.source)!.push(e);
    touched.add(e.source);
    touched.add(e.target);
  }

  if (starts.length >= 1) {
    out.push(
      (outgoing.get(starts[0].id)?.length ?? 0) >= 1
        ? { id: 'start-out', label: 'Start leads somewhere', status: 'pass', message: 'Your Start has an outgoing flow line.' }
        : { id: 'start-out', label: 'Start leads somewhere', status: 'fail', message: 'Draw a flow line from Start to the first step.' }
    );
  }

  const disconnected = art.nodes.filter((n) => !touched.has(n.id));
  out.push(
    art.nodes.length > 1 && disconnected.length === 0
      ? { id: 'connected', label: 'All symbols connected', status: 'pass', message: 'Every symbol is joined by flow lines.' }
      : art.nodes.length <= 1
        ? { id: 'connected', label: 'All symbols connected', status: 'fail', message: 'Add symbols and connect them with flow lines.' }
        : { id: 'connected', label: 'All symbols connected', status: 'fail', message: `“${label(disconnected[0]) || 'A symbol'}” has no flow lines. Connect it into the process.` }
  );

  // reachability from Start following arrow direction
  if (starts.length >= 1) {
    const reach = new Set<string>([starts[0].id]);
    const queue = [starts[0].id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const e of outgoing.get(cur) ?? []) {
        if (!reach.has(e.target)) { reach.add(e.target); queue.push(e.target); }
      }
    }
    const unreachable = art.nodes.filter((n) => !reach.has(n.id));
    out.push(
      unreachable.length === 0
        ? { id: 'reachable', label: 'No unreachable symbols', status: 'pass', message: 'Every symbol can be reached by following the arrows from Start.' }
        : { id: 'reachable', label: 'No unreachable symbols', status: 'fail', message: `“${label(unreachable[0]) || 'A symbol'}” cannot be reached from Start. Check your arrow directions.` }
    );
    const endReached = ends.some((e) => reach.has(e.id));
    out.push(
      ends.length > 0 && endReached
        ? { id: 'route', label: 'A route reaches End', status: 'pass', message: 'At least one valid route runs from Start to an End.' }
        : { id: 'route', label: 'A route reaches End', status: 'fail', message: 'Follow your arrows from Start — no route reaches an End yet.' }
    );
  }

  // decisions: 2+ labelled routes
  if (decisions.length > 0) {
    const under = decisions.find((d) => (outgoing.get(d.id)?.length ?? 0) < 2);
    out.push(
      !under
        ? { id: 'decision-routes', label: 'Decisions branch', status: 'pass', message: 'Every decision has at least two outgoing routes.' }
        : { id: 'decision-routes', label: 'Decisions branch', status: 'fail', message: `The decision “${label(under)}” needs at least two outgoing routes, such as Yes and No.` }
    );
    const unlabelled = decisions.find((d) =>
      (outgoing.get(d.id) ?? []).some((e) => !String(e.label ?? '').trim())
    );
    out.push(
      !unlabelled
        ? { id: 'decision-labels', label: 'Routes are labelled', status: 'pass', message: 'Your decision routes carry meaningful labels such as Yes/No.' }
        : { id: 'decision-labels', label: 'Routes are labelled', status: 'fail', message: `Label each route leaving “${label(unlabelled)}” — for example Yes/No or True/False.` }
    );
  } else if (art.nodes.length > 2) {
    out.push({ id: 'decision-routes', label: 'Decisions branch', status: 'warn', message: 'Your process has no decisions. Real systems usually check something — for example, “Are the details valid?”.' });
  }

  out.push(...smartSymbolFeedback(art));

  const allText = art.nodes.map((n) => label(n).toLowerCase()).join(' ');
  const hits = BRIEF_TERMS.filter((t) => allText.includes(t)).length;
  out.push(
    hits >= 3
      ? { id: 'brief', label: 'Addresses the brief', status: 'pass', message: 'Your flowchart addresses the hospital appointment brief.' }
      : { id: 'brief', label: 'Addresses the brief', status: 'warn', message: 'Bring in steps from the brief — finding an appointment, checking details and confirming it.' }
  );

  return out;
}

export function checklistPassed(results: CheckResult[]): boolean {
  return results.every((r) => r.status !== 'fail');
}
