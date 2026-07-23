import { ArtifactData, ArtifactNode, CheckResult, MindMapType } from '../types';

const BRIEF_TERMS = [
  'patient', 'appointment', 'hospital', 'reception', 'accessib', 'confirm',
  'find', 'touch', 'screen', 'reference', 'date of birth', 'check', 'kiosk',
  'user', 'input', 'output', 'staff', 'nhs', 'booking', 'wheelchair', 'audio',
  'contrast', 'font', 'simple', 'security', 'hardware', 'software', 'need',
];

function label(n: ArtifactNode): string {
  return String(n.data.label ?? '').trim();
}
function words(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

interface MapShape {
  central: ArtifactNode | null;
  centrals: ArtifactNode[];
  mains: ArtifactNode[]; // depth 1 from central
  subs: ArtifactNode[]; // depth 2+
  orphans: ArtifactNode[]; // not connected to central
  childrenOf: (id: string) => ArtifactNode[];
}

export function analyseMap(art: ArtifactData): MapShape {
  const centrals = art.nodes.filter((n) => n.data.kind === 'central');
  const central = centrals[0] ?? null;
  const byId = new Map(art.nodes.map((n) => [n.id, n]));
  const adj = new Map<string, Set<string>>();
  for (const n of art.nodes) adj.set(n.id, new Set());
  for (const e of art.edges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    }
  }
  const depth = new Map<string, number>();
  if (central) {
    depth.set(central.id, 0);
    const queue = [central.id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of adj.get(cur) ?? []) {
        if (!depth.has(nb)) {
          depth.set(nb, depth.get(cur)! + 1);
          queue.push(nb);
        }
      }
    }
  }
  const mains: ArtifactNode[] = [];
  const subs: ArtifactNode[] = [];
  const orphans: ArtifactNode[] = [];
  for (const n of art.nodes) {
    if (central && n.id === central.id) continue;
    const d = depth.get(n.id);
    if (d === undefined) orphans.push(n);
    else if (d === 1) mains.push(n);
    else subs.push(n);
  }
  const childrenOf = (id: string) => {
    const d = depth.get(id);
    if (d === undefined) return [];
    return [...(adj.get(id) ?? [])]
      .map((cid) => byId.get(cid)!)
      .filter((c) => (depth.get(c.id) ?? -1) === d + 1);
  };
  return { central, centrals, mains, subs, orphans, childrenOf };
}

function commonChecks(art: ArtifactData, s: MapShape): CheckResult[] {
  const out: CheckResult[] = [];

  if (s.centrals.length === 0) {
    out.push({ id: 'central', label: 'Central topic', status: 'fail', message: 'Add one central node to hold your main topic.' });
  } else if (s.centrals.length > 1) {
    out.push({ id: 'central', label: 'Central topic', status: 'fail', message: 'Your map has more than one central node. A mind map needs one clear central theme.' });
  } else if (!label(s.central!)) {
    out.push({ id: 'central', label: 'Central topic', status: 'fail', message: 'Your central node is empty. Give it a clear topic.' });
  } else {
    out.push({ id: 'central', label: 'Central topic', status: 'pass', message: `Central topic: “${label(s.central!)}”.` });
  }

  if (s.orphans.length > 0) {
    const first = label(s.orphans[0]) || 'One node';
    out.push({ id: 'connected', label: 'Everything connected', status: 'fail', message: `“${first}” is not connected to the map. Connect every node with a branch.` });
  } else if (art.nodes.length > 1) {
    out.push({ id: 'connected', label: 'Everything connected', status: 'pass', message: 'All of your nodes are connected with branches.' });
  }

  const long = art.nodes.filter((n) => words(label(n)) > 12);
  if (long.length > 0) {
    out.push({ id: 'keywords', label: 'Keywords and short phrases', status: 'warn', message: `“${label(long[0]).slice(0, 40)}…” — use a keyword or short phrase instead of a long paragraph.` });
  } else if (art.nodes.length > 0) {
    out.push({ id: 'keywords', label: 'Keywords and short phrases', status: 'pass', message: 'Your nodes use keywords and short phrases.' });
  }

  const empty = art.nodes.filter((n) => n.data.kind !== 'central' && !label(n));
  if (empty.length > 0) {
    out.push({ id: 'empty', label: 'No empty nodes', status: 'warn', message: `${empty.length} node${empty.length > 1 ? 's have' : ' has'} no text yet. Add a keyword to each node.` });
  }

  const allText = art.nodes.map((n) => label(n).toLowerCase()).join(' ');
  const hits = BRIEF_TERMS.filter((t) => allText.includes(t)).length;
  out.push(
    hits >= 3
      ? { id: 'brief', label: 'Relevant to the brief', status: 'pass', message: 'Your ideas relate to the hospital appointment system brief.' }
      : { id: 'brief', label: 'Relevant to the brief', status: 'warn', message: 'Not much of your map mentions the hospital brief yet. Use ideas from the project brief (patients, appointments, accessibility…).' }
  );
  return out;
}

export function validateMindmap(art: ArtifactData, type: MindMapType): CheckResult[] {
  const s = analyseMap(art);
  const out = commonChecks(art, s);

  if (type === 'library') {
    out.push(
      s.mains.length >= 4
        ? { id: 'categories', label: 'At least four categories', status: 'pass', message: `You have ${s.mains.length} main categories.` }
        : { id: 'categories', label: 'At least four categories', status: 'fail', message: `A Library mind map needs at least four logical categories — you have ${s.mains.length}. Try users, inputs, outputs and accessibility.` }
    );
    const developed = s.mains.filter((m) => s.childrenOf(m.id).length > 0);
    out.push(
      s.mains.length > 0 && developed.length >= Math.min(3, s.mains.length)
        ? { id: 'subnodes', label: 'Categories are developed', status: 'pass', message: 'Your categories are developed with sub-nodes.' }
        : { id: 'subnodes', label: 'Categories are developed', status: 'fail', message: 'Add at least one sub-node to develop each idea. Your map contains information, but it does not yet show how the ideas are related.' }
    );
    const labels = s.mains.map((m) => label(m).toLowerCase()).filter(Boolean);
    const dupes = labels.length !== new Set(labels).size;
    out.push(
      dupes
        ? { id: 'grouping', label: 'Logical grouping', status: 'warn', message: 'Two of your categories have the same name. Merge them or give them different focuses.' }
        : { id: 'grouping', label: 'Logical grouping', status: 'pass', message: 'Your categories are distinct, which makes the grouping clear.' }
    );
  }

  if (type === 'tunnel') {
    const centralLabel = s.central ? label(s.central).toLowerCase() : '';
    const looksLikeProblem =
      centralLabel.length > 0 &&
      (words(centralLabel) >= 3 ||
        /(create|design|build|improve|solve|reduce|make|how)/.test(centralLabel));
    out.push(
      looksLikeProblem
        ? { id: 'problem', label: 'Problem or outcome in the centre', status: 'pass', message: 'Your central node states the problem to solve or the intended outcome.' }
        : { id: 'problem', label: 'Problem or outcome in the centre', status: 'warn', message: 'A Tunnel Timeline’s central node should state the problem to solve or the intended outcome, e.g. “Create an accessible hospital appointment system”.' }
    );
    out.push(
      s.mains.length >= 3
        ? { id: 'paths', label: 'Paths towards the solution', status: 'pass', message: `You have ${s.mains.length} paths or actions leading from the problem.` }
        : { id: 'paths', label: 'Paths towards the solution', status: 'fail', message: 'A Tunnel Timeline should show paths towards solving a problem or reaching an outcome. Add at least three, such as “Investigate user needs” or “Test accessibility”.' }
    );
    const complete = s.mains.some((m) => s.childrenOf(m.id).length > 0);
    out.push(
      complete
        ? { id: 'complete-path', label: 'A developed path', status: 'pass', message: 'At least one path is developed with the actions or ideas it needs.' }
        : { id: 'complete-path', label: 'A developed path', status: 'fail', message: 'Develop at least one path with sub-nodes so it shows a complete route towards a possible solution.' }
    );
    if (s.mains.length >= 4 && s.subs.length === 0 && !complete) {
      out.push({ id: 'sorting', label: 'Solving, not just sorting', status: 'warn', message: 'This design mainly sorts information. A Library mind map may be more suitable — or develop your paths to show how each one helps solve the problem.' });
    }
  }

  if (type === 'presentation') {
    out.push(
      s.mains.length >= 3
        ? { id: 'sections', label: 'Main sections', status: 'pass', message: `You have ${s.mains.length} main sections for your audience to follow.` }
        : { id: 'sections', label: 'Main sections', status: 'fail', message: 'Add at least three main sections so the audience can follow the topic in an organised way.' }
    );
    const developed = s.mains.filter((m) => s.childrenOf(m.id).length > 0);
    out.push(
      developed.length >= 2
        ? { id: 'support', label: 'Supporting sub-points', status: 'pass', message: 'Your sections include supporting sub-points.' }
        : { id: 'support', label: 'Supporting sub-points', status: 'fail', message: 'Add sub-points beneath your sections so the audience gets enough detail.' }
    );
    const wordy = [...s.mains, ...s.subs].filter((n) => words(label(n)) > 8);
    out.push(
      wordy.length === 0
        ? { id: 'audience', label: 'Audience-friendly wording', status: 'pass', message: 'Your wording is short and clear for the audience.' }
        : { id: 'audience', label: 'Audience-friendly wording', status: 'warn', message: `“${label(wordy[0]).slice(0, 40)}…” is long for a presentation. Keep points short so the audience can read them at a glance.` }
    );
    if (s.orphans.length === 0 && s.mains.length >= 3) {
      out.push({ id: 'flow', label: 'No unexplained jumps', status: 'pass', message: 'Every idea links back to your topic, so there are no unexplained jumps.' });
    }
  }

  return out;
}

export function checklistPassed(results: CheckResult[]): boolean {
  return results.every((r) => r.status !== 'fail');
}
