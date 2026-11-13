"""
Detect bounding boxes on kitchen images using OpenCV contour detection.
Draws ALL detected bboxes directly on images — no manual estimation.
"""
import cv2
import numpy as np
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGE_DIR = os.path.join(PROJECT_DIR, 'public', 'visualizer')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)


def detect_bboxes(image_path):
    """Detect bounding boxes using multiple CV techniques and merge results."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"ERROR: Could not read {image_path}")
        return None, []

    h, w = img.shape[:2]
    total_area = h * w
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    all_boxes = []

    # --- Method 1: Canny + contours ---
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 30, 100)
    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    edges = cv2.erode(edges, kernel, iterations=1)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area / total_area < 0.005:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('canny', x, y, bw, bh, area))

    # --- Method 2: Adaptive threshold + contours ---
    adaptive = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY_INV, 21, 5)
    adaptive = cv2.morphologyEx(adaptive, cv2.MORPH_CLOSE, kernel, iterations=3)
    contours2, _ = cv2.findContours(adaptive, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours2:
        area = cv2.contourArea(cnt)
        if area / total_area < 0.005:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('adaptive', x, y, bw, bh, area))

    # --- Method 3: Color-based segmentation for distinct surface regions ---
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

    color_ranges = [
        ('warm_wood', [10, 40, 60], [25, 200, 220]),
        ('beige', [15, 20, 140], [35, 120, 255]),
        ('green', [35, 30, 40], [85, 200, 200]),
        ('dark', [0, 0, 0], [180, 100, 50]),
        ('white', [0, 0, 180], [180, 40, 255]),
        ('blue_gray', [90, 10, 80], [130, 80, 200]),
        ('cream', [18, 15, 160], [32, 80, 255]),
    ]

    for name, lower, upper in color_ranges:
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8), iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8), iterations=2)
        contours3, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours3:
            area = cv2.contourArea(cnt)
            if area / total_area < 0.008:
                continue
            x, y, bw, bh = cv2.boundingRect(cnt)
            aspect = bw / max(bh, 1)
            if aspect > 15 or aspect < 0.05:
                continue
            all_boxes.append((f'color_{name}', x, y, bw, bh, area))

    # --- Method 4: Structured edge detection via morphological gradient ---
    grad = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    _, grad_thresh = cv2.threshold(grad, 30, 255, cv2.THRESH_BINARY)
    grad_thresh = cv2.morphologyEx(grad_thresh, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8), iterations=4)
    contours4, _ = cv2.findContours(grad_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours4:
        area = cv2.contourArea(cnt)
        if area / total_area < 0.005:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        all_boxes.append(('gradient', x, y, bw, bh, area))

    # Convert to percentage coordinates
    pct_boxes = []
    for method, x, y, bw, bh, area in all_boxes:
        pct_boxes.append({
            'method': method,
            'x1': round(x / w * 100, 1),
            'y1': round(y / h * 100, 1),
            'x2': round((x + bw) / w * 100, 1),
            'y2': round((y + bh) / h * 100, 1),
            'w_pct': round(bw / w * 100, 1),
            'h_pct': round(bh / h * 100, 1),
            'area_pct': round(area / total_area * 100, 2),
        })

    return img, pct_boxes


def draw_all_bboxes(img, boxes, output_path, title):
    """Draw ALL detected bounding boxes on the image."""
    h, w = img.shape[:2]
    result = img.copy()

    method_colors = {
        'canny': (0, 255, 0),        # green
        'adaptive': (255, 0, 0),     # blue
        'gradient': (0, 165, 255),   # orange
    }
    color_method_color = (0, 255, 255)  # yellow for color-based

    for box in boxes:
        method = box['method']
        x1 = int(box['x1'] / 100 * w)
        y1 = int(box['y1'] / 100 * h)
        x2 = int(box['x2'] / 100 * w)
        y2 = int(box['y2'] / 100 * h)

        if method.startswith('color_'):
            color = color_method_color
        else:
            color = method_colors.get(method, (255, 255, 255))

        cv2.rectangle(result, (x1, y1), (x2, y2), color, 2)

        label = f"{box['x1']},{box['y1']}-{box['x2']},{box['y2']} ({method})"
        font_scale = 0.3
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1)
        cv2.rectangle(result, (x1, y1 - th - 4), (x1 + tw + 4, y1), (0, 0, 0), -1)
        cv2.putText(result, label, (x1 + 2, y1 - 2),
                    cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, 1)

    # Draw 10% grid for reference
    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (128, 128, 128), 1)
        cv2.line(result, (0, y_px), (w, y_px), (128, 128, 128), 1)
        cv2.putText(result, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 14),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    # Legend
    legend_y = 30
    for method, color in [('canny', (0, 255, 0)), ('adaptive', (255, 0, 0)),
                           ('gradient', (0, 165, 255)), ('color_*', (0, 255, 255))]:
        cv2.rectangle(result, (w - 200, legend_y - 12), (w - 185, legend_y), color, -1)
        cv2.putText(result, method, (w - 180, legend_y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        legend_y += 18

    cv2.imwrite(output_path, result)
    print(f"Saved: {output_path}")
    print(f"  Total boxes detected: {len(boxes)}")


def filter_meaningful_boxes(boxes, min_area=0.5, min_dim=3):
    """Filter to keep only meaningful furniture-sized bboxes."""
    filtered = []
    for box in boxes:
        if box['area_pct'] < min_area:
            continue
        if box['w_pct'] < min_dim or box['h_pct'] < min_dim:
            continue
        filtered.append(box)
    return filtered


def merge_overlapping(boxes, iou_threshold=0.5):
    """Merge highly overlapping boxes from different methods."""
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
        # Average the group
        avg = {
            'method': '+'.join(set(b['method'] for b in group)),
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

    return merged


if __name__ == '__main__':
    for img_name in ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg']:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"SKIP: {img_path} not found")
            continue

        base = os.path.splitext(img_name)[0]
        print(f"\n{'='*60}")
        print(f"Processing: {img_name}")
        print(f"{'='*60}")

        img, raw_boxes = detect_bboxes(img_path)
        if img is None:
            continue

        # Save raw detections
        draw_all_bboxes(img, raw_boxes,
                        os.path.join(OUTPUT_DIR, f'{base}-raw-bboxes.png'),
                        f'{base} raw')

        # Filter meaningful boxes
        meaningful = filter_meaningful_boxes(raw_boxes, min_area=0.8, min_dim=4)
        print(f"  After filtering: {len(meaningful)} boxes")

        # Merge overlapping
        merged = merge_overlapping(meaningful, iou_threshold=0.4)
        print(f"  After merging: {len(merged)} boxes")

        # Draw merged result
        draw_all_bboxes(img, merged,
                        os.path.join(OUTPUT_DIR, f'{base}-merged-bboxes.png'),
                        f'{base} merged')

        # Print all merged boxes sorted by position
        merged_sorted = sorted(merged, key=lambda b: (b['y1'], b['x1']))
        print(f"\n  Merged bounding boxes (sorted top-to-bottom, left-to-right):")
        for i, box in enumerate(merged_sorted):
            print(f"    [{i}] ({box['x1']},{box['y1']}) -> ({box['x2']},{box['y2']}) "
                  f"size={box['w_pct']}x{box['h_pct']}% "
                  f"conf={box.get('confidence', 1)} method={box['method']}")

    print("\n\nDone. Check scripts/output/ for *-raw-bboxes.png and *-merged-bboxes.png")
