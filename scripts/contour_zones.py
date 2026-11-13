"""
Perspective-aware zone detection using line fitting.
Detects grid boundaries as line equations (y = slope*x + intercept)
rather than constant values, so zones become quadrilaterals that
follow perspective distortion instead of axis-aligned rectangles.
"""
import cv2
import numpy as np
import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGE_DIR = os.path.join(PROJECT_DIR, 'public', 'visualizer')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)


def detect_line_segments(img):
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    h_segs = []
    v_segs = []

    for blur_k in [3, 5]:
        for canny_lo, canny_hi in [(20, 80), (30, 100), (50, 150)]:
            blurred = cv2.GaussianBlur(gray, (blur_k, blur_k), 0)
            edges = cv2.Canny(blurred, canny_lo, canny_hi, apertureSize=3)
            kernel = np.ones((2, 2), np.uint8)
            edges = cv2.dilate(edges, kernel, iterations=1)

            min_len = int(min(w, h) * 0.05)
            lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=50,
                                     minLineLength=min_len, maxLineGap=15)
            if lines is None:
                continue

            for line in lines:
                x1, y1, x2, y2 = line.flatten()
                angle = abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))

                x1p, y1p = x1 / w * 100, y1 / h * 100
                x2p, y2p = x2 / w * 100, y2 / h * 100

                if angle < 15 or angle > 165:
                    if x1p > x2p:
                        x1p, y1p, x2p, y2p = x2p, y2p, x1p, y1p
                    span = x2p - x1p
                    y_avg = (y1p + y2p) / 2
                    h_segs.append({
                        'y_avg': y_avg, 'span': span,
                        'x1': x1p, 'x2': x2p,
                        'y_at_x1': y1p, 'y_at_x2': y2p,
                    })
                elif 75 < angle < 105:
                    if y1p > y2p:
                        x1p, y1p, x2p, y2p = x2p, y2p, x1p, y1p
                    span = y2p - y1p
                    x_avg = (x1p + x2p) / 2
                    v_segs.append({
                        'x_avg': x_avg, 'span': span,
                        'y1': y1p, 'y2': y2p,
                        'x_at_y1': x1p, 'x_at_y2': x2p,
                    })

    return h_segs, v_segs


def cluster_h_boundaries(h_segs, min_span=20, gap=4.0, min_count=2):
    relevant = [s for s in h_segs if s['span'] > min_span]
    if not relevant:
        return []

    relevant = sorted(relevant, key=lambda s: s['y_avg'])

    clusters = [[relevant[0]]]
    for s in relevant[1:]:
        if s['y_avg'] - clusters[-1][-1]['y_avg'] < gap:
            clusters[-1].append(s)
        else:
            clusters.append([s])

    boundaries = []
    for cluster in clusters:
        if len(cluster) < min_count:
            continue

        xs = []
        ys = []
        for seg in cluster:
            xs.extend([seg['x1'], seg['x2']])
            ys.extend([seg['y_at_x1'], seg['y_at_x2']])

        try:
            slope, intercept = np.polyfit(xs, ys, 1)
        except Exception:
            slope = 0
            intercept = np.median([s['y_avg'] for s in cluster])

        boundaries.append({
            'slope': slope,
            'intercept': intercept,
            'y_median': np.median([s['y_avg'] for s in cluster]),
            'count': len(cluster),
        })

    return boundaries


def cluster_v_boundaries(v_segs, y_top, y_bot, min_span_pct=40, gap=5.0, min_count=8):
    band_height = y_bot - y_top
    min_span = band_height * (min_span_pct / 100)

    relevant = []
    for seg in v_segs:
        overlap_top = max(seg['y1'], y_top)
        overlap_bot = min(seg['y2'], y_bot)
        overlap = overlap_bot - overlap_top
        if overlap > min_span:
            relevant.append(seg)

    if not relevant:
        return []

    relevant = sorted(relevant, key=lambda s: s['x_avg'])

    clusters = [[relevant[0]]]
    for s in relevant[1:]:
        if s['x_avg'] - clusters[-1][-1]['x_avg'] < gap:
            clusters[-1].append(s)
        else:
            clusters.append([s])

    boundaries = []
    for cluster in clusters:
        if len(cluster) < min_count:
            continue

        ys = []
        xs = []
        for seg in cluster:
            ys.extend([seg['y1'], seg['y2']])
            xs.extend([seg['x_at_y1'], seg['x_at_y2']])

        try:
            slope, intercept = np.polyfit(ys, xs, 1)
        except Exception:
            slope = 0
            intercept = np.median([s['x_avg'] for s in cluster])

        boundaries.append({
            'slope': slope,
            'intercept': intercept,
            'x_median': np.median([s['x_avg'] for s in cluster]),
            'count': len(cluster),
        })

    return boundaries


def h_y_at(h_bound, x):
    return h_bound['slope'] * x + h_bound['intercept']


def v_x_at(v_bound, y):
    return v_bound['slope'] * y + v_bound['intercept']


def intersect_hv(h_bound, v_bound):
    sh, ih = h_bound['slope'], h_bound['intercept']
    sv, iv = v_bound['slope'], v_bound['intercept']
    denom = 1 - sv * sh
    if abs(denom) < 1e-10:
        return v_bound.get('x_median', iv), h_bound.get('y_median', ih)
    x = (sv * ih + iv) / denom
    y = sh * x + ih
    return x, y


def find_cabinet_extent(h_segs):
    spans = [(s['x1'], s['x2']) for s in h_segs if s['span'] > 8]
    if spans:
        x1 = np.percentile([s[0] for s in spans], 3)
        x2 = np.percentile([s[1] for s in spans], 97)
        return round(max(2, x1), 1), round(min(98, x2), 1)
    return 3, 97


def merge_close_h_boundaries(h_bounds, min_gap=7.0):
    if len(h_bounds) < 2:
        return h_bounds
    merged = [h_bounds[0]]
    for hb in h_bounds[1:]:
        if hb['y_median'] - merged[-1]['y_median'] < min_gap:
            if hb['count'] > merged[-1]['count']:
                merged[-1] = hb
        else:
            merged.append(hb)
    return merged


def make_edge_h(y_val):
    return {'slope': 0, 'intercept': y_val, 'y_median': y_val, 'count': 999}


def make_edge_v(x_val):
    return {'slope': 0, 'intercept': x_val, 'x_median': x_val, 'count': 999}


def clamp(v, lo=0.0, hi=100.0):
    return max(lo, min(hi, round(v, 1)))


def format_quad(corners):
    parts = []
    for x, y in corners:
        parts.append(f"{clamp(x)},{clamp(y)}")
    return ' '.join(parts)


def build_perspective_zones(h_bounds, v_segs, cab_x1, cab_x2):
    zones = []

    for i in range(len(h_bounds) - 1):
        h_top = h_bounds[i]
        h_bot = h_bounds[i + 1]

        y_top_mid = h_y_at(h_top, (cab_x1 + cab_x2) / 2)
        y_bot_mid = h_y_at(h_bot, (cab_x1 + cab_x2) / 2)
        band_h = y_bot_mid - y_top_mid
        if band_h < 4:
            continue

        v_splits = cluster_v_boundaries(v_segs, h_top['y_median'], h_bot['y_median'])
        v_splits = [v for v in v_splits if cab_x1 + 5 < v['x_median'] < cab_x2 - 5]

        left_edge = make_edge_v(cab_x1)
        right_edge = make_edge_v(cab_x2)
        all_v = sorted([left_edge] + v_splits + [right_edge], key=lambda v: v['x_median'])

        for j in range(len(all_v) - 1):
            v_left = all_v[j]
            v_right = all_v[j + 1]

            tl = intersect_hv(h_top, v_left)
            tr = intersect_hv(h_top, v_right)
            br = intersect_hv(h_bot, v_right)
            bl = intersect_hv(h_bot, v_left)

            w_pct = max(tr[0], br[0]) - min(tl[0], bl[0])
            if w_pct < 5:
                continue

            cx = (tl[0] + tr[0] + br[0] + bl[0]) / 4
            cy = (tl[1] + tr[1] + br[1] + bl[1]) / 4

            zones.append({
                'points': format_quad([tl, tr, br, bl]),
                'row': i, 'col': j,
                'cx': cx, 'cy': cy,
                'w_pct': w_pct, 'h_pct': band_h,
            })

    return zones


def label_zone(zone, total_zones):
    cy = zone['cy']
    cx = zone['cx']
    w = zone['w_pct']

    y_max = max(z['cy'] for z in total_zones)
    y_min = min(z['cy'] for z in total_zones)
    total_h = y_max - y_min if y_max > y_min else 100
    rel_y = (cy - y_min) / total_h

    if rel_y < 0.12:
        base = 'ceiling-soffit'
    elif rel_y < 0.30:
        if w > 50:
            base = 'upper-cabinets'
        elif cx < 40:
            base = 'upper-cabinets-left'
        elif cx > 60:
            base = 'upper-cabinets-right'
        else:
            base = 'chimney-hood'
    elif rel_y < 0.40:
        if w > 50:
            base = 'open-shelf'
        elif cx < 40:
            base = 'open-shelf-left'
        elif cx > 60:
            base = 'open-shelf-right'
        else:
            base = 'chimney-area'
    elif rel_y < 0.55:
        base = 'backsplash'
    elif rel_y < 0.62:
        base = 'countertop'
    elif rel_y < 0.82:
        if w > 50:
            base = 'lower-cabinets'
        elif cx < 35:
            base = 'lower-cabinets-left'
        elif cx > 65:
            base = 'lower-cabinets-right'
        else:
            base = 'lower-cabinets-center'
    else:
        base = 'flooring'

    return base


def deduplicate_ids(zones):
    counts = {}
    for z in zones:
        base_id = z['id']
        if base_id in counts:
            counts[base_id] += 1
            z['id'] = f"{base_id}-{counts[base_id]}"
            z['label'] = z['label'] + f" {counts[base_id]}"
        else:
            counts[base_id] = 1
    first_dups = {k for k, v in counts.items() if v > 1}
    for z in zones:
        if z['id'] in first_dups:
            z['id'] = z['id'] + '-1'
            z['label'] = z['label'] + ' 1'


GROUP_RULES = [
    ('upper-cabinets', ['ceiling-soffit', 'upper-cabinets', 'chimney-hood']),
    ('backsplash', ['backsplash']),
    ('lower-cabinets', ['lower-cabinets', 'countertop']),
]


def group_zones(zones):
    grouped = []
    for group_id, prefixes in GROUP_RULES:
        members = []
        for z in zones:
            base = z['id'].rsplit('-', 1)[0] if z['id'][-1].isdigit() and '-' in z['id'] else z['id']
            for pfx in prefixes:
                if base == pfx or base.startswith(pfx + '-'):
                    members.append(z)
                    break

        if not members:
            continue

        members.sort(key=lambda z: (z['cy'], z['cx']))
        points = [m['points'] for m in members]
        if len(points) == 1:
            points = points[0]

        grouped.append({
            'id': group_id,
            'label': group_id.replace('-', ' ').title(),
            'points': points,
        })

    return grouped


def draw_zones_overlay(img, zones, output_path):
    h, w = img.shape[:2]
    overlay = img.copy()
    colors = [
        (66, 133, 244), (52, 168, 83), (234, 67, 53), (251, 188, 4),
        (171, 71, 188), (0, 172, 193), (255, 112, 67), (124, 179, 66),
        (233, 30, 99), (121, 85, 72), (63, 81, 181), (0, 150, 136),
        (255, 152, 0), (96, 125, 139), (244, 67, 54), (76, 175, 80),
    ]
    for i, zone in enumerate(zones):
        color = colors[i % len(colors)]
        label = zone.get('label', zone.get('id', f'Zone {i}'))
        pts_str = zone['points']
        pts_list = pts_str if isinstance(pts_str, list) else [pts_str]

        for j, ps in enumerate(pts_list):
            coords = []
            for pair in ps.strip().split(' '):
                x, y = pair.split(',')
                px = int(float(x) / 100 * w)
                py = int(float(y) / 100 * h)
                coords.append([px, py])
            pts = np.array(coords, dtype=np.int32)
            cv2.fillPoly(overlay, [pts], color)
            cv2.polylines(overlay, [pts], True, (255, 255, 255), 2)
            cx = int(np.mean([c[0] for c in coords]))
            cy = int(np.mean([c[1] for c in coords]))
            text = label if j == 0 else f"{label} {j+1}"
            font_scale = 0.45 if w > 800 else 0.35
            (tw, th_), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1)
            cv2.rectangle(overlay, (cx - tw // 2 - 2, cy - th_ - 2),
                          (cx + tw // 2 + 2, cy + 4), (0, 0, 0), -1)
            cv2.putText(overlay, text, (cx - tw // 2, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1)

    result = cv2.addWeighted(img, 0.4, overlay, 0.6, 0)
    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (180, 180, 180), 1)
        cv2.line(result, (0, y_px), (w, y_px), (180, 180, 180), 1)
        cv2.putText(result, str(pct), (x_px + 2, 14),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

    cv2.imwrite(output_path, result)
    print(f"Saved: {output_path}")


if __name__ == '__main__':
    all_results = {}

    for img_name in ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg']:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"SKIP: {img_path}")
            continue

        base = os.path.splitext(img_name)[0]
        print(f"\n{'='*60}")
        print(f"Processing: {img_name}")

        img = cv2.imread(img_path)
        h, w = img.shape[:2]
        print(f"  Image size: {w}x{h}")

        h_segs, v_segs = detect_line_segments(img)
        print(f"  Raw segments: {len(h_segs)} horizontal, {len(v_segs)} vertical")

        h_bounds = cluster_h_boundaries(h_segs, min_span=20)
        cab_x1, cab_x2 = find_cabinet_extent(h_segs)

        if not h_bounds or h_bounds[0]['y_median'] > 3:
            h_bounds = [make_edge_h(0)] + h_bounds
        if not h_bounds or h_bounds[-1]['y_median'] < 97:
            h_bounds.append(make_edge_h(100))
        h_bounds = sorted(h_bounds, key=lambda b: b['y_median'])

        print(f"  H boundaries: {[round(b['y_median'], 1) for b in h_bounds]}")
        print(f"  H slopes: {[round(b['slope'], 4) for b in h_bounds]}")
        print(f"  Cabinet extent: x={cab_x1} to {cab_x2}")

        h_bounds = merge_close_h_boundaries(h_bounds, min_gap=7.0)
        zones = build_perspective_zones(h_bounds, v_segs, cab_x1, cab_x2)
        print(f"  Zones: {len(zones)}")

        for z in zones:
            z['id'] = label_zone(z, zones)
            z['label'] = z['id'].replace('-', ' ').title()

        deduplicate_ids(zones)

        grouped = group_zones(zones)
        print(f"  Grouped into {len(grouped)} zones:")
        for g in grouped:
            pts = g['points']
            n = len(pts) if isinstance(pts, list) else 1
            print(f"    {g['id']}: {n} sub-polygon(s)")

        all_results[base] = grouped
        draw_zones_overlay(img, grouped,
                           os.path.join(OUTPUT_DIR, f'{base}-contour-zones.png'))

    print(f"\n\n{'='*60}")
    print("JS-READY ZONE DEFINITIONS")
    print(f"{'='*60}")
    for base, zones in all_results.items():
        print(f"\n// {base}")
        print("zones: [")
        for z in zones:
            pts = z['points']
            if isinstance(pts, list):
                pts_js = '[\n' + ''.join(f"        '{p}',\n" for p in pts) + '      ]'
                print(f"  {{ id: '{z['id']}', label: '{z['label']}', points: {pts_js} }},")
            else:
                print(f"  {{ id: '{z['id']}', label: '{z['label']}', points: '{pts}' }},")
        print("],")

    json_out = {}
    for base, zones in all_results.items():
        json_out[base] = [
            {'id': z['id'], 'label': z['label'], 'points': z['points']}
            for z in zones
        ]
    with open(os.path.join(OUTPUT_DIR, 'contour-zones.json'), 'w') as f:
        json.dump(json_out, f, indent=2)
    print(f"\nSaved: {os.path.join(OUTPUT_DIR, 'contour-zones.json')}")
