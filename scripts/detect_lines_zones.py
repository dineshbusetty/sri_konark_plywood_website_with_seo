"""
Detect kitchen zones using HoughLinesP line detection.
Cabinet seams, countertops, and shelf edges create strong lines
that contour detection misses when colors are uniform.
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


def detect_lines(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None, [], []
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    edges = cv2.Canny(blurred, 50, 150, apertureSize=3)
    kernel = np.ones((2, 2), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=80,
                             minLineLength=min(w, h) * 0.08,
                             maxLineGap=15)
    if lines is None:
        return img, [], []

    h_lines = []
    v_lines = []
    for line in lines:
        x1, y1, x2, y2 = line.flatten()
        angle = abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))
        length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        if angle < 10 or angle > 170:
            y_pct = round((y1 + y2) / 2 / h * 100, 1)
            x1_pct = round(min(x1, x2) / w * 100, 1)
            x2_pct = round(max(x1, x2) / w * 100, 1)
            span = x2_pct - x1_pct
            h_lines.append({'y': y_pct, 'x1': x1_pct, 'x2': x2_pct, 'span': span, 'len': length})
        elif 80 < angle < 100:
            x_pct = round((x1 + x2) / 2 / w * 100, 1)
            y1_pct = round(min(y1, y2) / h * 100, 1)
            y2_pct = round(max(y1, y2) / h * 100, 1)
            span = y2_pct - y1_pct
            v_lines.append({'x': x_pct, 'y1': y1_pct, 'y2': y2_pct, 'span': span, 'len': length})

    return img, h_lines, v_lines


def cluster_values(values, gap=2.5):
    if not values:
        return []
    values = sorted(values)
    clusters = [[values[0]]]
    for v in values[1:]:
        if v - clusters[-1][-1] < gap:
            clusters[-1].append(v)
        else:
            clusters.append([v])
    return [round(np.mean(c), 1) for c in clusters]


def draw_lines_overlay(img, h_lines, v_lines, h_clusters, v_clusters, output_path):
    h, w = img.shape[:2]
    result = img.copy()

    for hl in h_lines:
        y = int(hl['y'] / 100 * h)
        x1 = int(hl['x1'] / 100 * w)
        x2 = int(hl['x2'] / 100 * w)
        cv2.line(result, (x1, y), (x2, y), (0, 255, 0), 1)

    for vl in v_lines:
        x = int(vl['x'] / 100 * w)
        y1 = int(vl['y1'] / 100 * h)
        y2 = int(vl['y2'] / 100 * h)
        cv2.line(result, (x, y1), (x, y2), (255, 0, 0), 1)

    for yc in h_clusters:
        y = int(yc / 100 * h)
        cv2.line(result, (0, y), (w, y), (0, 255, 255), 2)
        cv2.putText(result, f"y={yc}", (5, y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    for xc in v_clusters:
        x = int(xc / 100 * w)
        cv2.line(result, (x, 0), (x, h), (255, 0, 255), 2)
        cv2.putText(result, f"x={xc}", (x + 3, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 1)

    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (100, 100, 100), 1)
        cv2.line(result, (0, y_px), (w, y_px), (100, 100, 100), 1)

    cv2.imwrite(output_path, result)
    print(f"Saved: {output_path}")


def draw_zones_overlay(img, zones, output_path):
    h, w = img.shape[:2]
    overlay = img.copy()
    colors = [
        (66, 133, 244), (52, 168, 83), (234, 67, 53), (251, 188, 4),
        (171, 71, 188), (0, 172, 193), (255, 112, 67), (124, 179, 66),
        (233, 30, 99), (121, 85, 72),
    ]

    for i, zone in enumerate(zones):
        color = colors[i % len(colors)]
        label = zone['label']
        points_list = zone['points'] if isinstance(zone['points'], list) else [zone['points']]

        for j, pts_str in enumerate(points_list):
            coords = []
            for pair in pts_str.strip().split(' '):
                x, y = pair.split(',')
                px = int(float(x) / 100 * w)
                py = int(float(y) / 100 * h)
                coords.append([px, py])
            pts = np.array(coords, dtype=np.int32)
            cv2.fillPoly(overlay, [pts], color)
            cv2.polylines(overlay, [pts], True, (255, 255, 255), 2)
            cx = int(np.mean([c[0] for c in coords]))
            cy = int(np.mean([c[1] for c in coords]))
            text = f"{label}" if j == 0 else f"{label} {j+1}"
            (tw, th_), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.4, 1)
            cv2.rectangle(overlay, (cx - tw // 2 - 2, cy - th_ - 2),
                          (cx + tw // 2 + 2, cy + 4), (0, 0, 0), -1)
            cv2.putText(overlay, text, (cx - tw // 2, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    result = cv2.addWeighted(img, 0.4, overlay, 0.6, 0)

    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (200, 200, 200), 1)
        cv2.line(result, (0, y_px), (w, y_px), (200, 200, 200), 1)
        cv2.putText(result, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

    cv2.imwrite(output_path, result)
    print(f"Saved: {output_path}")


if __name__ == '__main__':
    for img_name in ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg']:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"SKIP: {img_path}")
            continue

        base = os.path.splitext(img_name)[0]
        print(f"\n{'='*60}")
        print(f"Processing: {img_name}")

        img, h_lines, v_lines = detect_lines(img_path)
        if img is None:
            continue

        # Filter to significant lines (span > 5%)
        h_sig = [l for l in h_lines if l['span'] > 5]
        v_sig = [l for l in v_lines if l['span'] > 5]

        print(f"  Horizontal lines: {len(h_sig)} (from {len(h_lines)} raw)")
        print(f"  Vertical lines: {len(v_sig)} (from {len(v_lines)} raw)")

        h_vals = [l['y'] for l in h_sig]
        v_vals = [l['x'] for l in v_sig]

        h_clusters = cluster_values(h_vals, gap=2.0)
        v_clusters = cluster_values(v_vals, gap=2.0)

        print(f"  H clusters (y positions): {h_clusters}")
        print(f"  V clusters (x positions): {v_clusters}")

        draw_lines_overlay(img, h_sig, v_sig, h_clusters, v_clusters,
                           os.path.join(OUTPUT_DIR, f'{base}-lines.png'))

    print("\nDone. Check scripts/output/ for *-lines.png")
