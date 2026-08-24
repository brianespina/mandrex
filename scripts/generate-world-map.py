#!/usr/bin/env python3
"""Generate src/lib/world-map-data.ts from Natural Earth 110m country data.

Natural Earth is in the public domain. Fetch the source once with:

  curl -sLo /tmp/world.json \
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson

then run:  python3 scripts/generate-world-map.py /tmp/world.json

Each country becomes one <path> plus a label point (the area centroid of its
largest landmass, so the pin lands on the mainland rather than being dragged
out to sea by distant territories). Which countries are highlighted is decided
in the CMS, not here.
"""
import json, math, sys

# Equirectangular. Cropping at these latitudes drops Antarctica and the empty
# polar space, which otherwise waste most of the frame.
W, LAT_TOP, LAT_BOT = 1000.0, 84.0, -56.0
H = (LAT_TOP - LAT_BOT) / 360.0 * W
TOL = 1.1        # Douglas-Peucker tolerance, in viewBox units
MIN_SPAN = 2.0   # drop islands smaller than this; invisible at render size

def project(lon, lat):
    return ((lon + 180.0) / 360.0 * W, (LAT_TOP - lat) / 360.0 * W)

def perp(p, a, b):
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

def rdp(pts, tol):
    if len(pts) < 3:
        return pts
    dmax = idx = 0
    for i in range(1, len(pts) - 1):
        d = perp(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        return rdp(pts[:idx + 1], tol)[:-1] + rdp(pts[idx:], tol)
    return [pts[0], pts[-1]]

def area_centroid(pts):
    a = cx = cy = 0.0
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]; x1, y1 = pts[i + 1]
        cross = x0 * y1 - x1 * y0
        a += cross; cx += (x0 + x1) * cross; cy += (y0 + y1) * cross
    if abs(a) < 1e-9:
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        return sum(xs) / len(xs), sum(ys) / len(ys), 0.0
    a *= 0.5
    return cx / (6 * a), cy / (6 * a), abs(a)

def ring_path(ring):
    pts = [project(x, y) for x, y in ring]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    if (max(xs) - min(xs)) < MIN_SPAN and (max(ys) - min(ys)) < MIN_SPAN:
        return None, None
    simple = rdp(pts, TOL)
    out, last = [], None
    for x, y in simple:
        c = (round(x), round(y))
        if c != last:
            out.append(c); last = c
    if len(out) < 4:
        return None, None
    return 'M' + 'L'.join(f'{x} {y}' for x, y in out) + 'Z', area_centroid(pts)

def main(src):
    sys.setrecursionlimit(20000)
    data = json.load(open(src))
    countries = []
    for f in data['features']:
        name, geom = f['properties'].get('NAME'), f['geometry']
        if not name or not geom:
            continue
        polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
        ds, best = [], None
        for poly in polys:
            d, cen = ring_path(poly[0])
            if not d:
                continue
            ds.append(d)
            if best is None or cen[2] > best[2]:
                best = cen
        if not ds:
            continue
        countries.append({'name': name, 'd': ''.join(ds),
                          'x': round(best[0], 1), 'y': round(best[1], 1)})
    countries.sort(key=lambda c: c['name'])

    out = [
        '// GENERATED FILE — do not hand-edit.',
        '// Source: Natural Earth 110m admin-0 countries (public domain).',
        '// Regenerate with scripts/generate-world-map.py',
        '',
        'export type MapCountry = {',
        '  /** Natural Earth NAME, matched against the CMS location list. */',
        '  name: string;',
        '  /** SVG path in viewBox units. */',
        '  d: string;',
        '  /** Label point: centroid of the largest landmass. */',
        '  x: number;',
        '  y: number;',
        '};',
        '',
        f'export const MAP_WIDTH = {W:.0f};',
        f'export const MAP_HEIGHT = {H:.0f};',
        '',
        'export const COUNTRIES: MapCountry[] = [',
    ]
    for c in countries:
        out.append(f'  {{ name: {json.dumps(c["name"])}, x: {c["x"]}, y: {c["y"]}, d: {json.dumps(c["d"])} }},')
    out.append('];')
    open('src/lib/world-map-data.ts', 'w').write('\n'.join(out) + '\n')
    print(f'wrote src/lib/world-map-data.ts — {len(countries)} countries')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/tmp/world.json')
