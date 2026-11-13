"""
Detect kitchen zones using HoughLinesP line detection.
Strategy: find major horizontal boundaries to create row bands,
then merge all cells in each row into single wide zones.
Only split rows vertically when strong V lines exist within that band.
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


def detect_lines(img):
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    h_lines_raw = []
    v_lines_raw = []

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
                if angle < 8 or angle > 172:
                    y_pct = (y1 + y2) / 2 / h * 100
                    x1_pct = min(x1, x2) / w * 100
                    x2_pct = max(x1, x2) / w * 100
                    span = x2_pct - x1_pct
                    h_lines_raw.append({'y': y_pct, 'span': span,
                                        'x1': x1_pct, 'x2': x2_pct})
                elif 82 < angle < 98:
                    x_pct = (x1 + x2) / 2 / w * 100
                    y1_pct = min(y1, y2) / h * 100
                    y2_pct = max(y1, y2) / h * 100
                    span = y2_pct - y1_pct
                    v_lines_raw.append({'x': x_pct, 'span': span,
                                        'y1': y1_pct, 'y2': y2_pct})

    return h_lines_raw, v_lines_raw


def cluster_values(values, gap=4.0, min_count=2):
    if not values:
        return []
    values = sorted(values)
    clusters = [[values[0]]]
    for v in values[1:]:
        if v - clusters[-1][-1] < gap:
            clusters[-1].append(v)
        else:
            clusters.append([v])
    result = []
    for c in clusters:
        if len(c) >= min_count:
            result.append(round(np.median(c), 1))
    return result


def find_h_boundaries(h_lines, min_span=20):
    vals = [l['y'] for l in h_lines if l['span'] > min_span]
    return cluster_values(vals, gap=4.0, min_count=2)


def find_v_boundaries_in_band(v_lines, y_top, y_bot, min_span_pct=40):
    band_height = y_bot - y_top
    min_span = band_height * (min_span_pct / 100)
    relevant = []
    for vl in v_lines:
        overlap_top = max(vl['y1'], y_top)
        overlap_bot = min(vl['y2'], y_bot)
        overlap = overlap_bot - overlap_top
        if overlap > min_span:
            relevant.append(vl['x'])
    return cluster_values(relevant, gap=5.0, min_count=8)


def build_band_zones(h_bounds, v_lines, cabinet_x1, cabinet_x2):
    zones = []
    for i in range(len(h_bounds) - 1):
        y1 = h_bounds[i]
        y2 = h_bounds[i + 1]
        band_h = y2 - y1
        if band_h < 4:
            continue

        v_splits = find_v_boundaries_in_band(v_lines, y1, y2)
        v_splits = [v for v in v_splits if cabinet_x1 + 5 < v < cabinet_x2 - 5]

        if v_splits:
            all_x = sorted(set([cabinet_x1] + v_splits + [cabinet_x2]))
            for j in range(len(all_x) - 1):
                x1 = all_x[j]
                x2 = all_x[j + 1]
                if x2 - x1 < 5:
                    continue
                zones.append(make_zone(x1, y1, x2, y2, i, j))
        else:
            zones.append(make_zone(cabinet_x1, y1, cabinet_x2, y2, i, 0))

    return zones


def make_zone(x1, y1, x2, y2, row, col):
    x1r, y1r, x2r, y2r = round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)
    pts = (f"{int(round(x1))},{int(round(y1))} "
           f"{int(round(x2))},{int(round(y1))} "
           f"{int(round(x2))},{int(round(y2))} "
           f"{int(round(x1))},{int(round(y2))}")
    return {
        'x1': x1r, 'y1': y1r, 'x2': x2r, 'y2': y2r,
        'w_pct': round(x2 - x1, 1), 'h_pct': round(y2 - y1, 1),
        'points': pts, 'row': row, 'col': col,
    }


def find_cabinet_extent(h_lines, v_lines, img_w_pct=100, img_h_pct=100):
    h_spans = [(l['x1'], l['x2']) for l in h_lines if l['span'] > 8]
    if h_spans:
        x1 = np.percentile([s[0] for s in h_spans], 3)
        x2 = np.percentile([s[1] for s in h_spans], 97)
        return round(max(2, x1), 1), round(min(98, x2), 1)
    return 3, 97


def merge_close_h_boundaries(h_bounds, min_gap=5.0):
    if len(h_bounds) < 2:
        return h_bounds
    merged = [h_bounds[0]]
    for h in h_bounds[1:]:
        if h - merged[-1] < min_gap:
            merged[-1] = round((merged[-1] + h) / 2, 1)
        else:
            merged.append(h)
    return merged


def label_zone(zone, total_zones, img_name):
    y_center = (zone['y1'] + zone['y2']) / 2
    x_center = (zone['x1'] + zone['x2']) / 2
    h = zone['h_pct']
    w = zone['w_pct']

    y_max = max(z['y2'] for z in total_zones)
    y_min = min(z['y1'] for z in total_zones)
    total_h = y_max - y_min

    rel_y = (y_center - y_min) / total_h if total_h > 0 else 0.5

    if rel_y < 0.12:
        base = 'ceiling-soffit'
    elif rel_y < 0.30:
        if w > 50:
            base = 'upper-cabinets'
        elif x_center < 40:
            base = 'upper-cabinets-left'
        elif x_center > 60:
            base = 'upper-cabinets-right'
        else:
            base = 'chimney-hood'
    elif rel_y < 0.40:
        if w > 50:
            base = 'open-shelf'
        elif x_center < 40:
            base = 'open-shelf-left'
        elif x_center > 60:
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
        elif x_center < 35:
            base = 'lower-cabinets-left'
        elif x_center > 65:
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
        if isinstance(pts_str, list):
            pts_list = pts_str
        else:
            pts_list = [pts_str]

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

        h_lines, v_lines = detect_lines(img)
        print(f"  Raw lines: {len(h_lines)} horizontal, {len(v_lines)} vertical")

        h_bounds = find_h_boundaries(h_lines, min_span=20)
        cab_x1, cab_x2 = find_cabinet_extent(h_lines, v_lines)

        if not any(v < 3 for v in h_bounds):
            h_bounds = [0] + h_bounds
        if not any(v > 97 for v in h_bounds):
            h_bounds.append(100)
        h_bounds = sorted(set(h_bounds))

        print(f"  H boundaries: {h_bounds}")
        print(f"  Cabinet extent: x={cab_x1} to {cab_x2}")

        h_bounds = merge_close_h_boundaries(h_bounds, min_gap=7.0)
        zones = build_band_zones(h_bounds, v_lines, cab_x1, cab_x2)
        print(f"  Zones: {len(zones)}")

        for z in zones:
            z['id'] = label_zone(z, zones, img_name)
            z['label'] = z['id'].replace('-', ' ').title()

        deduplicate_ids(zones)

        for i, z in enumerate(zones):
            print(f"  [{i}] {z['id']}: ({z['x1']},{z['y1']})->({z['x2']},{z['y2']}) "
                  f"size={z['w_pct']}x{z['h_pct']}%")

        all_results[base] = zones
        draw_zones_overlay(img, zones,
                           os.path.join(OUTPUT_DIR, f'{base}-grid-zones.png'))

    print(f"\n\n{'='*60}")
    print("JS-READY ZONE DEFINITIONS")
    print(f"{'='*60}")
    for base, zones in all_results.items():
        print(f"\n// {base}")
        print("zones: [")
        for z in zones:
            print(f"  {{ id: '{z['id']}', label: '{z['label']}', points: '{z['points']}' }},")
        print("],")

    json_out = {}
    for base, zones in all_results.items():
        json_out[base] = [
            {'id': z['id'], 'label': z['label'], 'points': z['points']}
            for z in zones
        ]
    with open(os.path.join(OUTPUT_DIR, 'grid-zones.json'), 'w') as f:
        json.dump(json_out, f, indent=2)
    print(f"\nSaved: {os.path.join(OUTPUT_DIR, 'grid-zones.json')}")
