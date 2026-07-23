import dagre from '@dagrejs/dagre';
import { ArtifactData, ArtifactNode } from '../types';

/** Radial layout: central node at origin, mains on a ring, subs fanned in each main's sector. */
export function radialLayout(art: ArtifactData): ArtifactData {
  const central = art.nodes.find((n) => n.data.kind === 'central');
  if (!central) return art;

  const adj = new Map<string, string[]>();
  for (const n of art.nodes) adj.set(n.id, []);
  for (const e of art.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const depth = new Map<string, number>([[central.id, 0]]);
  const parent = new Map<string, string>();
  const queue = [central.id];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of adj.get(cur) ?? []) {
      if (!depth.has(nb)) {
        depth.set(nb, depth.get(cur)! + 1);
        parent.set(nb, cur);
        queue.push(nb);
      }
    }
  }

  const mains = art.nodes.filter((n) => depth.get(n.id) === 1);
  const pos = new Map<string, { x: number; y: number }>();
  pos.set(central.id, { x: 0, y: 0 });
  const angleOf = new Map<string, number>();

  mains.forEach((m, i) => {
    const angle = (i / Math.max(mains.length, 1)) * Math.PI * 2 - Math.PI / 2;
    angleOf.set(m.id, angle);
    pos.set(m.id, { x: Math.cos(angle) * 260, y: Math.sin(angle) * 200 });
  });

  const placeChildren = (id: string, d: number) => {
    const kids = (adj.get(id) ?? []).filter((k) => depth.get(k) === d + 1 && parent.get(k) === id);
    const base = angleOf.get(id) ?? 0;
    const spread = Math.PI / 3.2;
    kids.forEach((k, i) => {
      const a = kids.length === 1 ? base : base - spread / 2 + (i / (kids.length - 1)) * spread;
      angleOf.set(k, a);
      const r = 260 + d * 190;
      pos.set(k, { x: Math.cos(a) * r, y: Math.sin(a) * (r * 0.78) });
      placeChildren(k, d + 1);
    });
  };
  mains.forEach((m) => placeChildren(m.id, 1));

  // orphans in a row below
  let ox = -200;
  const nodes: ArtifactNode[] = art.nodes.map((n) => {
    const p = pos.get(n.id);
    if (p) return { ...n, position: p };
    ox += 200;
    return { ...n, position: { x: ox, y: 460 } };
  });
  return { nodes, edges: art.edges };
}

const SIZES: Record<string, { w: number; h: number }> = {
  start: { w: 150, h: 54 }, end: { w: 150, h: 54 },
  process: { w: 180, h: 62 }, decision: { w: 190, h: 110 },
  io: { w: 190, h: 62 }, connector: { w: 44, h: 44 },
};

/** Top-to-bottom layered layout for flowcharts. */
export function flowchartLayout(art: ArtifactData): ArtifactData {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 55 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of art.nodes) {
    const s = SIZES[String(n.data.symbol)] ?? { w: 170, h: 60 };
    g.setNode(n.id, { width: s.w, height: s.h });
  }
  for (const e of art.edges) g.setEdge(e.source, e.target);
  dagre.layout(g);
  const nodes = art.nodes.map((n) => {
    const p = g.node(n.id);
    if (!p) return n;
    const s = SIZES[String(n.data.symbol)] ?? { w: 170, h: 60 };
    return { ...n, position: { x: p.x - s.w / 2, y: p.y - s.h / 2 } };
  });
  return { nodes, edges: art.edges };
}
