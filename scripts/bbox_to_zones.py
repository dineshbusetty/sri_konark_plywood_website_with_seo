"""
Convert OpenCV-detected bounding boxes into zone definitions for the laminate visualizer.
Filters out overly large/small boxes, groups by vertical position into semantic zones,
and outputs JS-ready zone coordinates.
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


def detect_and_filter(image_path, max_area_pct=50, min_area_pct=0.5, min_dim_pct=3):
    """Detect bboxes using OpenCV and filter to meaningful furniture-sized regions."""
    img = cv2.imread(image_path)
    if img is None:
        return None, []

    h, w = img.shape[:2]
    total_area = h * w
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    all_boxes = []

    # Method 1: Canny edges
    edges = cv2.Canny(blurred, 30, 100)
    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    edges = cv2.erode(edges, kernel, iterations=1)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('canny', x, y, bw, bh, area))

    # Method 2: Adaptive threshold
    adaptive = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY_INV, 21, 5)
    adaptive = cv2.morphologyEx(adaptive, cv2.MORPH_CLOSE, kernel, iterations=3)
    contours2, _ = cv2.findContours(adaptive, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours2:
        area = cv2.contourArea(cnt)
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('adaptive', x, y, bw, bh, area))

    # Method 3: Color segmentation
    color_ranges = [
        ('warm_wood', [10, 40, 60], [25, 200, 220]),
        ('beige', [15, 20, 140], [35, 120, 255]),
        ('green', [35, 30, 40], [85, 200, 200]),
        ('dark', [0, 0, 0], [180, 100, 50]),
        ('white', [0, 0, 180], [180, 40, 255]),
        ('cream', [18, 15, 160], [32, 80, 255]),
    ]
    for name, lower, upper in color_ranges:
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8), iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8), iterations=2)
        contours3, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours3:
            area = cv2.contourArea(cnt)
            x, y, bw, bh = cv2.boundingRect(cnt)
            all_boxes.append((f'color_{name}', x, y, bw, bh, area))

    # Method 4: Morphological gradient
    grad = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    _, grad_thresh = cv2.threshold(grad, 30, 255, cv2.THRESH_BINARY)
    grad_thresh = cv2.morphologyEx(grad_thresh, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8), iterations=4)
    contours4, _ = cv2.findContours(grad_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours4:
        area = cv2.contourArea(cnt)
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('gradient', x, y, bw, bh, area))

    # Convert to percentage and filter
    filtered = []
    for method, x, y, bw, bh, area in all_boxes:
        area_pct = area / total_area * 100
        w_pct = bw / w * 100
        h_pct = bh / h * 100
        if area_pct < min_area_pct or area_pct > max_area_pct:
            continue
        if w_pct < min_dim_pct or h_pct < min_dim_pct:
            continue
        bbox_coverage = w_pct * h_pct / 100
        if bbox_coverage > max_area_pct:
            continue
        aspect = bw / max(bh, 1)
        if aspect > 15 or aspect < 0.05:
            continue
        filtered.append({
            'method': method,
            'x1': round(x / w * 100, 1),
            'y1': round(y / h * 100, 1),
            'x2': round((x + bw) / w * 100, 1),
            'y2': round((y + bh) / h * 100, 1),
            'w_pct': round(w_pct, 1),
            'h_pct': round(h_pct, 1),
            'area_pct': round(area_pct, 2),
        })

    # Merge overlapping boxes (IoU > 0.3)
    merged = merge_boxes(filtered, iou_threshold=0.3)
    return img, merged


def merge_boxes(boxes, iou_threshold=0.3):
    if not boxes:
        return []
    boxes = sorted(boxes, key=lambda b: b['area_pct'], reverse=True)
    merged = []
    used = set()
    for i, b1 in enumerate(boxes):
        if i in used:
            continue
        group = [b1]
        for j, b2 in enumerate(boxes):
            if j <= i or j in used:
                continue
            ix1 = max(b1['x1'], b2['x1'])
            iy1 = max(b1['y1'], b2['y1'])
            ix2 = min(b1['x2'], b2['x2'])
            iy2 = min(b1['y2'], b2['y2'])
            if ix1 < ix2 and iy1 < iy2:
                inter = (ix2 - ix1) * (iy2 - iy1)
                a1 = (b1['x2'] - b1['x1']) * (b1['y2'] - b1['y1'])
                a2 = (b2['x2'] - b2['x1']) * (b2['y2'] - b2['y1'])
                union = a1 + a2 - inter
                iou = inter / max(union, 0.001)
                if iou > iou_threshold:
                    group.append(b2)
                    used.add(j)
        avg = {
            'method': '+'.join(sorted(set(b['method'] for b in group))),
            'x1': round(np.mean([b['x1'] for b in group]), 1),
            'y1': round(np.mean([b['y1'] for b in group]), 1),
            'x2': round(np.mean([b['x2'] for b in group]), 1),
            'y2': round(np.mean([b['y2'] for b in group]), 1),
            'w_pct': round(np.mean([b['w_pct'] for b in group]), 1),
            'h_pct': round(np.mean([b['h_pct'] for b in group]), 1),
            'area_pct': round(np.mean([b['area_pct'] for b in group]), 2),
            'confidence': len(group),
        }
        merged.append(avg)
    return sorted(merged, key=lambda b: (b['y1'], b['x1']))


def box_to_points(box):
    """Convert a bbox dict to polygon points string: 'x1,y1 x2,y1 x2,y2 x1,y2'"""
    x1, y1, x2, y2 = int(round(box['x1'])), int(round(box['y1'])), int(round(box['x2'])), int(round(box['y2']))
    return f'{x1},{y1} {x2},{y1} {x2},{y2} {x1},{y2}'


def draw_zones_overlay(img, zones, output_path):
    """Draw the final zone definitions on the image for verification."""
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

    result = cv2.addWeighted(img, 0.45, overlay, 0.55, 0)

    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (200, 200, 200), 1)
        cv2.line(result, (0, y_px), (w, y_px), (200, 200, 200), 1)
        cv2.putText(result, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 14),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    cv2.imwrite(output_path, result)
    print(f"Saved: {output_path}")


if __name__ == '__main__':
    all_zones = {}

    for img_name in ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg']:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"SKIP: {img_path}")
            continue

        base = os.path.splitext(img_name)[0]
        print(f"\n{'='*60}")
        print(f"Processing: {img_name}")

        img, boxes = detect_and_filter(img_path, max_area_pct=45, min_area_pct=0.8, min_dim_pct=4)
        if img is None:
            continue

        print(f"Filtered+merged boxes: {len(boxes)}")
        for i, b in enumerate(boxes):
            print(f"  [{i}] ({b['x1']},{b['y1']}) -> ({b['x2']},{b['y2']}) "
                  f"size={b['w_pct']}x{b['h_pct']}% area={b['area_pct']}% "
                  f"conf={b.get('confidence',1)} method={b['method']}")

        # Convert each detected box into a zone with auto-generated label
        zones = []
        for i, box in enumerate(boxes):
            zone = {
                'id': f'zone-{i}',
                'label': f'Zone {i} ({box["method"].split("+")[0]})',
                'points': box_to_points(box),
                '_bbox': box,
            }
            zones.append(zone)

        all_zones[base] = zones

        # Draw overlay
        draw_zones_overlay(img, zones,
                           os.path.join(OUTPUT_DIR, f'{base}-opencv-zones.png'))

    # Print JS-ready output
    print(f"\n\n{'='*60}")
    print("JS-READY ZONE DEFINITIONS (copy to visualizer-rooms.js)")
    print(f"{'='*60}")
    for base, zones in all_zones.items():
        print(f"\n// {base}")
        print(f"zones: [")
        for z in zones:
            b = z['_bbox']
            print(f"  {{ id: '{z['id']}', label: '{z['label']}', "
                  f"points: '{z['points']}' }},  "
                  f"// {b['x1']},{b['y1']} -> {b['x2']},{b['y2']} conf={b.get('confidence',1)}")
        print(f"],")

    # Also save as JSON for further processing
    json_out = {}
    for base, zones in all_zones.items():
        json_out[base] = [
            {'id': z['id'], 'label': z['label'], 'points': z['points'],
             'bbox': {k: v for k, v in z['_bbox'].items() if k != 'method'}}
            for z in zones
        ]
    with open(os.path.join(OUTPUT_DIR, 'opencv-zones.json'), 'w') as f:
        json.dump(json_out, f, indent=2)
    print(f"\nSaved: {os.path.join(OUTPUT_DIR, 'opencv-zones.json')}")
