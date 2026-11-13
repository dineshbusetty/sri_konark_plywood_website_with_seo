"""
Kitchen image zone analysis using OpenCV.
Detects furniture boundaries via edge detection, Hough lines, and color segmentation.
Generates verification overlay images with labeled zones.
"""
import cv2
import numpy as np
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGE_DIR = os.path.join(PROJECT_DIR, 'public', 'visualizer')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'output')

os.makedirs(OUTPUT_DIR, exist_ok=True)

ZONE_COLORS = [
    (255, 100, 100),   # red
    (100, 255, 100),   # green
    (100, 100, 255),   # blue
    (255, 255, 100),   # yellow
    (255, 100, 255),   # magenta
    (100, 255, 255),   # cyan
    (255, 180, 100),   # orange
    (180, 100, 255),   # purple
    (100, 255, 180),   # teal
    (255, 100, 180),   # pink
]


def detect_strong_lines(img):
    """Detect strong horizontal and vertical lines using Hough transform."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150, apertureSize=3)

    # Detect lines
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=80,
                             minLineLength=int(min(w, h) * 0.08),
                             maxLineGap=10)

    h_lines = []  # horizontal lines (y positions as %)
    v_lines = []  # vertical lines (x positions as %)

    if lines is not None:
        for line in lines:
            pts = line.flatten()
            if len(pts) < 4:
                continue
            x1, y1, x2, y2 = int(pts[0]), int(pts[1]), int(pts[2]), int(pts[3])
            angle = np.abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)

            if angle < 5 or angle > 175:  # horizontal
                y_pct = ((y1 + y2) / 2) / h * 100
                length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
                h_lines.append((y_pct, length, x1 / w * 100, x2 / w * 100))
            elif 85 < angle < 95:  # vertical
                x_pct = ((x1 + x2) / 2) / w * 100
                length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
                v_lines.append((x_pct, length, y1 / h * 100, y2 / h * 100))

    return h_lines, v_lines, edges


def cluster_lines(lines, threshold=2.0):
    """Cluster nearby line positions and return sorted unique positions."""
    if not lines:
        return []
    positions = sorted(set(round(l[0], 1) for l in lines))
    clusters = []
    current_cluster = [positions[0]]

    for pos in positions[1:]:
        if pos - current_cluster[-1] < threshold:
            current_cluster.append(pos)
        else:
            clusters.append(round(np.mean(current_cluster), 1))
            current_cluster = [pos]
    clusters.append(round(np.mean(current_cluster), 1))
    return clusters


def color_segment(img, lower_hsv, upper_hsv, min_area_pct=0.5):
    """Segment image by HSV color range, return bounding boxes as % coords."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, w = img.shape[:2]
    total_area = h * w

    mask = cv2.inRange(hsv, np.array(lower_hsv), np.array(upper_hsv))
    kernel = np.ones((7, 7), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    boxes = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area / total_area * 100 < min_area_pct:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        boxes.append({
            'x1': round(x / w * 100, 1),
            'y1': round(y / h * 100, 1),
            'x2': round((x + bw) / w * 100, 1),
            'y2': round((y + bh) / h * 100, 1),
            'area_pct': round(area / total_area * 100, 2),
        })

    return sorted(boxes, key=lambda b: (b['y1'], b['x1']))


def analyze_image(image_path):
    """Full analysis of a kitchen image."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"ERROR: Could not read {image_path}")
        return None

    h, w = img.shape[:2]
    print(f"\n{'='*60}")
    print(f"Analyzing: {os.path.basename(image_path)} ({w}x{h})")
    print(f"{'='*60}")

    # Step 1: Detect lines
    h_lines, v_lines, edges = detect_strong_lines(img)
    h_clusters = cluster_lines(h_lines)
    v_clusters = cluster_lines(v_lines)

    print(f"\nHorizontal line positions (y%): {h_clusters}")
    print(f"Vertical line positions (x%): {v_clusters}")

    # Step 2: Color segmentation for different surfaces
    # Detect various color ranges common in kitchens
    segments = {}

    # Beige/cream cabinets (kitchen-1)
    segments['beige'] = color_segment(img, [15, 20, 140], [35, 120, 255], min_area_pct=0.3)

    # Green cabinets (kitchen-2, kitchen-3)
    segments['green'] = color_segment(img, [35, 30, 60], [85, 200, 200], min_area_pct=0.3)

    # Dark/black (chimney, appliances)
    segments['dark'] = color_segment(img, [0, 0, 0], [180, 80, 60], min_area_pct=0.3)

    # White/light (backsplash, marble)
    segments['white'] = color_segment(img, [0, 0, 180], [180, 40, 255], min_area_pct=0.3)

    # Wood tones
    segments['wood'] = color_segment(img, [10, 40, 60], [25, 200, 200], min_area_pct=0.3)

    # Floor (usually lighter/different from cabinets)
    # Check bottom 30% of image
    bottom_strip = img[int(h * 0.7):, :]
    segments['floor_region'] = color_segment(bottom_strip, [0, 0, 100], [180, 60, 255], min_area_pct=0.2)

    for name, boxes in segments.items():
        if boxes:
            print(f"\n{name} segments:")
            for b in boxes:
                print(f"  [{b['x1']},{b['y1']}] to [{b['x2']},{b['y2']}] (area: {b['area_pct']}%)")

    # Step 3: Generate edge map overlay
    edge_overlay = img.copy()
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    edges_color[edges > 0] = [0, 255, 0]
    edge_overlay = cv2.addWeighted(edge_overlay, 0.7, edges_color, 0.3, 0)

    # Draw detected lines
    if h_lines:
        for y_pct, length, x1_pct, x2_pct in h_lines:
            y_px = int(y_pct / 100 * h)
            x1_px = int(x1_pct / 100 * w)
            x2_px = int(x2_pct / 100 * w)
            cv2.line(edge_overlay, (x1_px, y_px), (x2_px, y_px), (0, 0, 255), 1)

    if v_lines:
        for x_pct, length, y1_pct, y2_pct in v_lines:
            x_px = int(x_pct / 100 * w)
            y1_px = int(y1_pct / 100 * h)
            y2_px = int(y2_pct / 100 * h)
            cv2.line(edge_overlay, (x_px, y1_px), (x_px, y2_px), (255, 0, 0), 1)

    # Draw grid at every 10% for reference
    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(edge_overlay, (x_px, 0), (x_px, h), (128, 128, 128), 1)
        cv2.line(edge_overlay, (0, y_px), (w, y_px), (128, 128, 128), 1)
        cv2.putText(edge_overlay, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        cv2.putText(edge_overlay, str(pct), (2, y_px + 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    # Also draw grid at every 5% with thinner lines
    for pct in range(0, 101, 5):
        if pct % 10 == 0:
            continue
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(edge_overlay, (x_px, 0), (x_px, h), (80, 80, 80), 1)
        cv2.line(edge_overlay, (0, y_px), (w, y_px), (80, 80, 80), 1)

    basename = os.path.splitext(os.path.basename(image_path))[0]
    cv2.imwrite(os.path.join(OUTPUT_DIR, f'{basename}-analysis.png'), edge_overlay)
    print(f"\nSaved analysis overlay: {basename}-analysis.png")

    return {
        'file': os.path.basename(image_path),
        'width': w,
        'height': h,
        'h_lines': h_clusters,
        'v_lines': v_clusters,
        'segments': {k: v for k, v in segments.items() if v},
    }


def draw_zone_overlay(image_path, zones, output_name):
    """Draw labeled polygon zones on the image for verification."""
    img = cv2.imread(image_path)
    if img is None:
        return
    h, w = img.shape[:2]
    overlay = img.copy()

    for i, zone in enumerate(zones):
        color = ZONE_COLORS[i % len(ZONE_COLORS)]
        label = zone['label']
        points_list = zone['points'] if isinstance(zone['points'], list) else [zone['points']]

        for pts_str in points_list:
            coords = []
            for pair in pts_str.split(' '):
                x, y = pair.split(',')
                px = int(float(x) / 100 * w)
                py = int(float(y) / 100 * h)
                coords.append([px, py])
            pts = np.array(coords, dtype=np.int32)
            cv2.fillPoly(overlay, [pts], color)

            # Label at centroid of first polygon
            cx = int(np.mean([c[0] for c in coords]))
            cy = int(np.mean([c[1] for c in coords]))
            cv2.putText(overlay, label, (cx - 30, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 2)
            cv2.putText(overlay, label, (cx - 30, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1)

    result = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)

    # Draw grid
    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (200, 200, 200), 1)
        cv2.line(result, (0, y_px), (w, y_px), (200, 200, 200), 1)
        cv2.putText(result, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

    cv2.imwrite(os.path.join(OUTPUT_DIR, output_name), result)
    print(f"Saved zone overlay: {output_name}")


if __name__ == '__main__':
    kitchen_images = ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg']
    results = {}

    for img_name in kitchen_images:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"WARNING: {img_path} not found, skipping")
            continue
        result = analyze_image(img_path)
        if result:
            results[img_name] = result

    # Save analysis results as JSON
    with open(os.path.join(OUTPUT_DIR, 'analysis.json'), 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\n{'='*60}")
    print("Analysis complete. Check scripts/output/ for overlay images.")
    print("Next: review *-analysis.png images, then define zones.")
