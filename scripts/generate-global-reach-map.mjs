#!/usr/bin/env node
/**
 * Generate src/lib/world-map-data.ts for the Global reach section.
 *
 * The design handoff's prototype loaded d3 + topojson from a CDN and projected
 * the map in the browser on every resize. We do the projection here instead, at
 * build time, so the page ships plain SVG: no d3 at runtime, no CDN fetch, no
 * offline fallback path, and no layout shift. The handoff explicitly allows for
 * this ("consider also pre-rendering the base SVG server-side and hydrating only
 * the interactions") and it resolves its "vendor the TopoJSON" action item —
 * the data never reaches the browser at all.
 *
 * Re-projecting on resize is unnecessary because the SVG has a fixed viewBox
 * and scales with CSS; the projected coordinates stay valid at any width.
 *
 * Usage:
 *   curl -sLo /tmp/countries-110m.json \
 *     https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
 *   node scripts/generate-global-reach-map.mjs /tmp/countries-110m.json
 *
 * Source data: Natural Earth 110m via world-atlas@2.0.2 — public domain.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

// viewBox dimensions. The handoff specifies height = width * 0.54.
const W = 1000;
const H = Math.round(W * 0.54);

// Pin geometry and label tuning come from the handoff. The label offsets exist
// to stop the four labels colliding with each other and with the coastlines —
// the handoff says to keep them, so they live in code, not the CMS.
const PINS = [
  { key: 'us', id: '840', coords: [-98.5, 39.8], labelDx: -12, labelDy: -22, anchor: 'end' },
  { key: 'ca', id: '124', coords: [-106.3, 56.1], labelDx: -12, labelDy: -20, anchor: 'end' },
  { key: 'uk', id: '826', coords: [-3.4, 55.4], labelDx: 14, labelDy: -18, anchor: 'start' },
  { key: 'au', id: '036', coords: [133.8, -25.3], labelDx: 0, labelDy: 30, anchor: 'middle' },
];

// Great-circle links drawn between the pins.
const LINKS = [['ca', 'us'], ['us', 'uk'], ['uk', 'au']];

// Antarctica and the Fr. S. Antarctic Lands are dropped so fitExtent frames the
// inhabited world rather than wasting the bottom third of the card.
const EXCLUDE = new Set(['010', '260']);

const src = process.argv[2] || '/tmp/countries-110m.json';
const topo = JSON.parse(readFileSync(src, 'utf8'));
const all = feature(topo, topo.objects.countries).features;
const features = all.filter((f) => !EXCLUDE.has(String(f.id)));

const projection = geoNaturalEarth1().fitExtent(
  [[10, 10], [W - 10, H - 10]],
  { type: 'FeatureCollection', features },
);
const path = geoPath(projection);

// The 110m source carries more vertices than this renders at. Douglas-Peucker
// removes the ones that cannot be seen, and integer rounding drops decimals
// that are sub-pixel here. Together these roughly halve the payload.
const TOL = 1.0;      // simplification tolerance, in viewBox units
const MIN_SPAN = 1.5; // drop subpaths smaller than this — invisible either way

const perp = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
};

const rdp = (pts, tol) => {
  if (pts.length < 3) return pts;
  let dmax = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perp(pts[i], pts[0], pts[pts.length - 1]);
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax > tol) return rdp(pts.slice(0, idx + 1), tol).slice(0, -1).concat(rdp(pts.slice(idx), tol));
  return [pts[0], pts[pts.length - 1]];
};

const toPoints = (sub) => {
  const nums = sub.match(/-?\d+(?:\.\d+)?/g);
  if (!nums) return [];
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
  return pts;
};

const simplify = (d, tol = TOL) => {
  if (!d) return '';
  return d
    .split('M')
    .filter(Boolean)
    .map((sub) => {
      const closed = /Z\s*$/.test(sub);
      let pts = toPoints(sub);
      if (pts.length < 2) return null;
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      if (span < MIN_SPAN) return null;
      if (tol > 0) pts = rdp(pts, tol);
      const out = [];
      let last = null;
      for (const [x, y] of pts) {
        const c = `${Math.round(x)},${Math.round(y)}`;
        if (c !== last) { out.push(c); last = c; }
      }
      if (out.length < (closed ? 3 : 2)) return null;
      return 'M' + out.join('L') + (closed ? 'Z' : '');
    })
    .filter(Boolean)
    .join('');
};

const served = new Set(PINS.map((p) => p.id));
const lands = features
  .map((f) => ({ id: String(f.id), served: served.has(String(f.id)), d: simplify(path(f) || '') }))
  .filter((l) => l.d);

const byKey = Object.fromEntries(PINS.map((p) => [p.key, p]));
const arcs = LINKS.map(([a, b]) =>
  simplify(path({ type: 'LineString', coordinates: [byKey[a].coords, byKey[b].coords] }) || '', 0),
).filter(Boolean);

const pins = PINS.map((p) => {
  const [x, y] = projection(p.coords);
  return {
    key: p.key,
    id: p.id,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    labelDx: p.labelDx,
    labelDy: p.labelDy,
    anchor: p.anchor,
  };
});

const out = `// GENERATED FILE — do not hand-edit.
// Source: Natural Earth 110m via world-atlas@2.0.2 (public domain).
// Regenerate with scripts/generate-global-reach-map.mjs
//
// Projected at build time with d3-geo's geoNaturalEarth1, so no mapping
// library ships to the browser. Coordinates are in viewBox units and stay
// valid at any rendered width, because the SVG scales via CSS.

export type MapLand = { id: string; served: boolean; d: string };
export type MapPin = {
  key: string;
  id: string;
  /** Projected position, in viewBox units. */
  x: number;
  y: number;
  /** Label offsets from the handoff; they stop the labels colliding. */
  labelDx: number;
  labelDy: number;
  anchor: string;
};

export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};

/** Great-circle paths linking the served countries. */
export const ARCS: string[] = ${JSON.stringify(arcs, null, 2)};

export const PINS: MapPin[] = ${JSON.stringify(pins, null, 2)};

export const LANDS: MapLand[] = [
${lands.map((l) => `  { id: ${JSON.stringify(l.id)}, served: ${l.served}, d: ${JSON.stringify(l.d)} },`).join('\n')}
];
`;

writeFileSync('src/lib/world-map-data.ts', out);
console.log(
  `wrote src/lib/world-map-data.ts — ${lands.length} countries, ` +
    `${lands.filter((l) => l.served).length} served, ${arcs.length} arcs`,
);
