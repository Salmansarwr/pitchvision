from ultralytics import YOLO
import numpy as np
from typing import Dict, List

keypoint_history = {}  # Global dictionary to store keypoint history

class KeypointsTracker:
    def __init__(self, model_path: str, conf: float = 0.3, kp_conf: float = 0.7):
        """
        Initializes the KeypointsTracker.

        Args:
            model_path (str): Path to the YOLO model for keypoint detection.
            conf (float): Confidence threshold for detections.
            kp_conf (float): Confidence threshold for keypoints.
        """
        self.model = YOLO(model_path)
        self.conf = conf
        self.kp_conf = kp_conf
        self.tracker_id = 0

    def detect(self, frame: np.ndarray) -> List[Dict]:
        """
        Detect keypoints in a frame.

        Args:
            frame (np.ndarray): Input frame.

        Returns:
            List[Dict]: List of detected keypoints with their coordinates and confidence.
        """
        try:
            results = self.model(frame, conf=self.conf)
            keypoints = []
            if results[0].keypoints is not None:
                for kp_set in results[0].keypoints.xy:
                    for i, kp in enumerate(kp_set):
                        if results[0].keypoints.conf[0][i] >= self.kp_conf:
                            keypoints.append({
                                'id': i,
                                'coords': (float(kp[0]), float(kp[1])),
                                'confidence': float(results[0].keypoints.conf[0][i])
                            })
            return keypoints
        except Exception as e:
            print(f"Error in KeypointsTracker.detect: {e}")
            return []

    def track(self, detections: List[Dict], frame_idx: int) -> List[Dict]:
        """
        Track keypoints across frames (simple ID assignment for now).

        Args:
            detections (List[Dict]): Detected keypoints.
            frame_idx (int): Current frame index.

        Returns:
            List[Dict]: Tracked keypoints.
        """
        try:
            keypoint_history[frame_idx] = {}
            for kp in detections:
                kp_id = kp['id']
                keypoint_history[frame_idx][kp_id] = {
                    'coords': kp['coords'],
                    'confidence': kp['confidence']
                }
            return detections
        except Exception as e:
            print(f"Error in KeypointsTracker.track: {e}")
            return []