import numpy as np
from typing import Dict, Any, Tuple, List
from abc import ABC, abstractmethod
import cv2

class AbstractMapper(ABC):
    """Abstract base class for mappers."""
    @abstractmethod
    def map(self, detection: Dict) -> Dict:
        pass

class HomographySmoother:
    def __init__(self, alpha: float = 0.9):
        """
        Initializes the homography smoother.

        Args:
            alpha (float): Smoothing factor, between 0 and 1. Higher values give more weight to the current homography.
        """
        self.alpha = alpha
        self.smoothed_H = None

    def smooth(self, current_H: np.ndarray) -> np.ndarray:
        """
        Smooths the homography matrix using exponential smoothing.

        Args:
            current_H (np.ndarray): The current homography matrix of shape (3, 3).

        Returns:
            np.ndarray: The smoothed homography matrix of shape (3, 3).
        """
        if self.smoothed_H is None:
            self.smoothed_H = current_H
        else:
            self.smoothed_H = self.alpha * current_H + (1 - self.alpha) * self.smoothed_H
        return self.smoothed_H

def get_homography(keypoints: dict, top_down_keypoints: np.ndarray) -> np.ndarray:
    """
    Compute the homography matrix between detected keypoints and top-down keypoints.

    Args:
        keypoints (dict): A dictionary of detected keypoints, where keys are identifiers 
        and values are {'coords': [x, y], 'confidence': float}.
        top_down_keypoints (np.ndarray): An array of shape (n, 2) containing the top-down keypoints.

    Returns:
        np.ndarray: A 3x3 homography matrix that maps the keypoints to the top-down view.
    """
    kps: List[Tuple[float, float]] = []
    proj_kps: List[Tuple[float, float]] = []

    for key in keypoints.keys():
        if key < len(top_down_keypoints):
            kps.append(keypoints[key]['coords'])
            proj_kps.append(top_down_keypoints[key])

    def _compute_homography(src_points: np.ndarray, dst_points: np.ndarray) -> np.ndarray:
        """
        Compute a single homography matrix between source and destination points.

        Args:
            src_points (array): Source points coordinates of shape (n, 2).
            dst_points (array): Destination points coordinates of shape (n, 2).

        Returns:
            np.ndarray: The computed homography matrix of shape (3, 3).
        """
        src_points = np.array(src_points, dtype=np.float32)
        dst_points = np.array(dst_points, dtype=np.float32)
        h, _ = cv2.findHomography(src_points, dst_points)
        return h.astype(np.float32) if h is not None else np.eye(3, dtype=np.float32)

    if len(kps) < 4:  # Need at least 4 points for homography
        return np.eye(3, dtype=np.float32)
    return _compute_homography(np.array(kps), np.array(proj_kps))

def apply_homography(pos: Tuple[float, float], H: np.ndarray) -> Tuple[float, float]:
    """
    Apply a homography transformation to a 2D point.

    Args:
        pos (Tuple[float, float]): The (x, y) coordinates of the point to be projected.
        H (np.ndarray): The homography matrix of shape (3, 3).

    Returns:
        Tuple[float, float]: The projected (x, y) coordinates in the destination space.
    """
    x, y = pos
    pos_homogeneous = np.array([x, y, 1])
    projected_pos = np.dot(H, pos_homogeneous)
    projected_pos /= projected_pos[2] if projected_pos[2] != 0 else 1
    return projected_pos[0], projected_pos[1]

class ObjectPositionMapper(AbstractMapper):
    """
    A class to map object positions from detected keypoints to a top-down view.
    """
    def __init__(self, top_down_keypoints: np.ndarray, alpha: float = 0.9) -> None:
        """
        Initializes the ObjectPositionMapper.

        Args:
            top_down_keypoints (np.ndarray): An array of shape (n, 2) containing the top-down keypoints.
            alpha (float): Smoothing factor for homography smoothing.
        """
        super().__init__()
        self.top_down_keypoints = top_down_keypoints
        self.homography_smoother = HomographySmoother(alpha=alpha)
        self.last_valid_H = None

    def map(self, detection: Dict) -> Dict:
        """
        Maps the detection data to their positions in the top-down view.

        Args:
            detection (dict): Dictionary with 'keypoints' and 'object' data from track_history and keypoint_history.

        Returns:
            dict: The detection data with projected positions added.
        """
        try:
            detection = detection.copy()
            keypoints = detection.get('keypoints', {})
            object_data = detection.get('object', {})

            if not keypoints or not object_data:
                return detection

            try:
                H = get_homography(keypoints, self.top_down_keypoints)
                self.last_valid_H = H
            except Exception as e:
                print(f"Error computing homography: {e}")
                if self.last_valid_H is not None:
                    H = self.last_valid_H
                else:
                    return detection

            smoothed_H = self.homography_smoother.smooth(H)

            for track_id, track_info in object_data.items():
                if not isinstance(track_info, dict) or 'bbox' not in track_info:
                    continue
                from .utils import get_feet_pos
                bbox = track_info['bbox']
                feet_pos = get_feet_pos(bbox)
                try:
                    projected_pos = apply_homography(feet_pos, smoothed_H)
                    track_info['projection'] = projected_pos
                except Exception as e:
                    print(f"Error applying homography to object {track_id}: {e}")

            return detection
        except Exception as e:
            print(f"Error in ObjectPositionMapper.map: {e}")
            return detection