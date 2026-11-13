"""
Generate verification overlay images with refined zone coordinates
based on the edge detection analysis results.
"""
import cv2
import numpy as np
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGE_DIR = os.path.join(PROJECT_DIR, 'public', 'visualizer')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'output')

ZONE_COLORS = [
    (66, 133, 244),    # blue
    (52, 168, 83),     # green
    (234, 67, 53),     # red
    (251, 188, 4),     # yellow
    (171, 71, 188),    # purple
    (0, 172, 193),     # teal
    (255, 112, 67),    # deep orange
    (124, 179, 66),    # light green
    (233, 30, 99),     # pink
    (121, 85, 72),     # brown
]

# ─── Kitchen-1 zones (1024×1536, portrait, beige straight kitchen) ───
# Detected horizontal lines: 12.7, 30.2, 34.4, 37.7, 48.8, 55.8, 61.6, 66.4, 74.2, 76.8
# Detected vertical lines: 8.9, 17.8, 21.2, 31.3, 35.9, 50.0, 64.7, 79.6, 91.3, 95.3
KITCHEN_1_ZONES = [
    {
        'id': 'upper-cabinets',
        'label': 'Upper Cabinets',
        'points': [
            '9,13 22,13 22,26 9,26',      # left panel 1
            '22,13 36,13 36,26 22,26',     # left panel 2
            '65,13 80,13 80,26 65,26',     # right panel 1
            '80,13 92,13 92,26 80,26',     # right panel 2
        ],
    },
    {
        'id': 'open-shelf',
        'label': 'Open Shelf',
        'points': [
            '9,27 36,27 36,35 9,35',       # left shelf
            '65,27 92,27 92,35 65,35',     # right shelf
        ],
    },
    {
        'id': 'chimney',
        'label': 'Chimney Hood',
        'points': '36,24 64,24 64,37 36,37',
    },
    {
        'id': 'backsplash',
        'label': 'Backsplash',
        'points': '9,37 92,37 92,55 9,55',
    },
    {
        'id': 'countertop',
        'label': 'Countertop',
        'points': '9,55 92,55 92,57 9,57',
    },
    {
        'id': 'lower-cabinets',
        'label': 'Lower Cabinets',
        'points': [
            '9,57 22,57 22,75 9,75',      # panel 1
            '22,57 36,57 36,75 22,75',     # panel 2
            '36,57 50,57 50,75 36,75',     # panel 3
            '50,57 65,57 65,75 50,75',     # panel 4
            '65,57 80,57 80,75 65,75',     # panel 5
            '80,57 92,57 92,75 80,75',     # panel 6
        ],
    },
    {
        'id': 'flooring',
        'label': 'Flooring',
        'points': '0,77 100,77 100,100 0,100',
    },
]

# ─── Kitchen-2 zones (1200×983, landscape, U-shape green kitchen) ───
# Detected horizontal lines: 16.0, 30.8, 38.5, 52.8, 57.9, 70.3
# Detected vertical lines: 0.9, 2.9, 7.2, 17.8, 22.1, 24.3, 41.3, 49.2, 56.9, 72.2, 76.2, 89.8
KITCHEN_2_ZONES = [
    {
        'id': 'upper-cabinets',
        'label': 'Upper Cabinets',
        'points': [
            '3,11 22,11 22,32 3,32',       # left wall display
            '24,11 38,11 38,32 24,32',      # back wall left of window
            '57,11 72,11 72,32 57,32',      # back wall right of window
            '73,11 90,11 90,32 73,32',      # right wall display
        ],
    },
    {
        'id': 'backsplash',
        'label': 'Backsplash',
        'points': [
            '3,33 22,33 22,42 3,42',        # left wall
            '22,33 73,33 73,42 22,42',       # back wall
            '73,33 90,33 90,42 73,42',       # right wall
        ],
    },
    {
        'id': 'countertop',
        'label': 'Countertop',
        'points': [
            '0,42 25,42 25,45 0,45',        # left counter
            '25,42 73,42 73,45 25,45',       # back counter
            '73,42 95,42 95,45 73,45',       # right counter
        ],
    },
    {
        'id': 'lower-cabinets-left',
        'label': 'Lower Cabs Left',
        'points': [
            '3,45 12,45 12,72 3,72',        # left section 1
            '12,45 22,45 22,72 12,72',       # left section 2
        ],
    },
    {
        'id': 'lower-cabinets-back',
        'label': 'Lower Cabs Back',
        'points': [
            '22,45 42,45 42,58 22,58',      # back left
            '57,45 73,45 73,58 57,58',       # back right
        ],
    },
    {
        'id': 'lower-cabinets-right',
        'label': 'Lower Cabs Right',
        'points': [
            '73,45 82,45 82,72 73,72',      # right section 1
            '82,45 90,45 90,72 82,72',       # right section 2
        ],
    },
    {
        'id': 'flooring',
        'label': 'Flooring',
        'points': '18,74 82,74 95,100 5,100',
    },
]

# ─── Kitchen-3 zones (736×581, landscape, L-shape green kitchen) ───
# Detected horizontal lines: 5.7, 16.2, 25.3, 34.0, 40.1, 59.2, 65.2, 70.5, 81.2, 84.1
# Detected vertical lines: 11.8, 24.8, 35.0, 44.7, 62.0, 72.3, 83.3, 90.8, 96.9
KITCHEN_3_ZONES = [
    {
        'id': 'upper-cabinets',
        'label': 'Upper Cabinets',
        'points': [
            '12,6 25,6 25,16 12,16',       # panel 1
            '25,6 35,6 35,16 25,16',        # panel 2
            '45,6 62,6 62,16 45,16',        # panel 3
            '62,6 72,6 72,16 62,16',        # panel 4
        ],
    },
    {
        'id': 'chimney',
        'label': 'Chimney Hood',
        'points': '35,16 45,16 45,30 35,30',
    },
    {
        'id': 'open-shelf',
        'label': 'Open Shelf',
        'points': [
            '12,28 35,28 35,34 12,34',      # left shelf
            '45,28 62,28 62,34 45,34',       # middle shelf
            '62,28 73,28 73,34 62,34',       # right shelf
        ],
    },
    {
        'id': 'backsplash',
        'label': 'Backsplash',
        'points': [
            '12,35 73,35 73,54 12,54',      # back wall
            '73,35 84,35 84,54 73,54',       # right return
        ],
    },
    {
        'id': 'countertop',
        'label': 'Countertop',
        'points': [
            '12,54 73,54 73,57 12,57',      # back counter
            '73,54 84,54 84,57 73,57',       # right counter
        ],
    },
    {
        'id': 'lower-cabinets',
        'label': 'Lower Cabinets',
        'points': [
            '12,57 25,57 25,81 12,81',      # panel 1
            '25,57 35,57 35,81 25,81',       # panel 2
            '35,57 45,57 45,81 35,81',       # panel 3
            '45,57 62,57 62,81 45,81',       # panel 4
            '62,57 73,57 73,81 62,81',       # panel 5
            '73,57 84,57 84,81 73,81',       # right return panel
        ],
    },
    {
        'id': 'flooring',
        'label': 'Flooring',
        'points': '0,84 90,84 90,100 0,100',
    },
]


def draw_zone_overlay(image_path, zones, output_name):
    """Draw labeled polygon zones on the image for verification."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"ERROR: Could not read {image_path}")
        return
    h, w = img.shape[:2]
    overlay = img.copy()

    for i, zone in enumerate(zones):
        color = ZONE_COLORS[i % len(ZONE_COLORS)]
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

            # Label at centroid
            cx = int(np.mean([c[0] for c in coords]))
            cy = int(np.mean([c[1] for c in coords]))
            text = f"{label}" if j == 0 else f"{label} {j+1}"
            (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.4, 1)
            cv2.rectangle(overlay, (cx - tw // 2 - 2, cy - th - 2),
                          (cx + tw // 2 + 2, cy + 4), (0, 0, 0), -1)
            cv2.putText(overlay, text, (cx - tw // 2, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    result = cv2.addWeighted(img, 0.45, overlay, 0.55, 0)

    # Draw 10% grid
    for pct in range(0, 101, 10):
        x_px = int(pct / 100 * w)
        y_px = int(pct / 100 * h)
        cv2.line(result, (x_px, 0), (x_px, h), (200, 200, 200), 1)
        cv2.line(result, (0, y_px), (w, y_px), (200, 200, 200), 1)
        cv2.putText(result, str(pct), (x_px + 2, 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        cv2.putText(result, str(pct), (2, y_px + 14),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

    cv2.imwrite(os.path.join(OUTPUT_DIR, output_name), result)
    print(f"Saved: {output_name}")


if __name__ == '__main__':
    configs = [
        ('kitchen-1.jpg', KITCHEN_1_ZONES, 'kitchen-1-zones.png'),
        ('kitchen-2.jpg', KITCHEN_2_ZONES, 'kitchen-2-zones.png'),
        ('kitchen-3.jpg', KITCHEN_3_ZONES, 'kitchen-3-zones.png'),
    ]

    for img_name, zones, out_name in configs:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if os.path.exists(img_path):
            draw_zone_overlay(img_path, zones, out_name)
        else:
            print(f"WARNING: {img_path} not found")

    print("\nDone. Review the *-zones.png images in scripts/output/")
