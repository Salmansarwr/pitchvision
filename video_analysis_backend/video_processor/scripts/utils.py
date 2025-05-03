import numpy as np
from typing import Tuple

def is_color_dark(color):
    r, g, b = color
    brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128

def rgb_bgr_converter(color):
    """
    Converts an RGB color tuple to BGR format for OpenCV.

    Args:
        color (tuple): RGB color tuple (r, g, b).

    Returns:
        tuple: BGR color tuple (b, g, r).
    """
    r, g, b = color
    return (b, g, r)

def get_bbox_center(bbox):
    x1, y1, x2, y2 = bbox
    return (x1 + x2) / 2, (y1 + y2) / 2

def get_bbox_width(bbox):
    x1, _, x2, _ = bbox
    return x2 - x1

def clean_ball_path(positions, distance_threshold=50):
    valid_positions = [p for p in positions if p is not None]
    if len(valid_positions) <= 1:
        return valid_positions
    cleaned_positions = [valid_positions[0]]
    last_valid_position = valid_positions[0]
    for i in range(1, len(valid_positions)):
        current_position = valid_positions[i]
        dx = current_position[0] - last_valid_position[0]
        dy = current_position[1] - last_valid_position[1]
        distance = np.sqrt(dx**2 + dy**2)
        if distance <= distance_threshold:
            cleaned_positions.append(current_position)
            last_valid_position = current_position
    return cleaned_positions

def smooth_positions(positions, window_size=3):
    if len(positions) < window_size:
        return positions
    smoothed = []
    for i in range(window_size-1):
        window = positions[:i+1]
        avg_x = sum(p[0] for p in window) / len(window)
        avg_y = sum(p[1] for p in window) / len(window)
        smoothed.append((int(avg_x), int(avg_y)))
    for i in range(len(positions) - window_size + 1):
        window = positions[i:i+window_size]
        avg_x = sum(p[0] for p in window) / window_size
        avg_y = sum(p[1] for p in window) / window_size
        smoothed.append((int(avg_x), int(avg_y)))
    return smoothed

def get_feet_pos(bbox: Tuple[float, float, float, float]) -> Tuple[float, int]:
    """
    Calculate the feet position from a bounding box.

    Args:
        bbox (Tuple[float, float, float, float]): The bounding box defined by (x1, y1, x2, y2).

    Returns:
        Tuple[float, int]: The feet position as (feet_x, feet_y), where feet_y is rounded to an integer.
    """
    x1, _, x2, y2 = bbox
    return (x1 + x2) / 2, int(y2)