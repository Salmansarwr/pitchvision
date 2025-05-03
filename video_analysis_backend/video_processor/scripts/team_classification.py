import numpy as np
from sklearn.cluster import KMeans
import cv2
from typing import List, Tuple
import os

class TeamClassifier:
    def __init__(self, device: str = "cpu"):
        """
        Initializes the TeamClassifier.

        Args:
            device (str): Device to run the classifier on ('cpu' or 'cuda').
        """
        self.device = device
        self.kmeans = None
        self.is_fitted = False
        self.team_colors = []
        self.team_avg_colors = [(255, 255, 255), (0, 255, 0)]  # Default: white, green

    def fit(self, crops: List[np.ndarray], output_dir: str) -> bool:
        """
        Fit the classifier by clustering player crops into two teams based on color.

        Args:
            crops (List[np.ndarray]): List of player crop images.
            output_dir (str): Directory to save sample crops.

        Returns:
            bool: True if fitting was successful, False otherwise.
        """
        print(f"Fitting team classifier on {len(crops)} player crops")
        valid_crops = [crop for crop in crops if crop is not None and crop.size > 0 and crop.shape[0] >= 15 and crop.shape[1] >= 15]
        print(f"Found {len(valid_crops)} valid crops after filtering")
        if len(valid_crops) < 15:
            print("Not enough valid player crops for team classification (need at least 15)")
            return False

        features = []
        self.team_colors = []
        expected_feature_size = 32 * 16 * 3  # ROI: hsv[16:48, 8:24]
        for i, crop in enumerate(valid_crops):
            try:
                resized = cv2.resize(crop, (32, 64), interpolation=cv2.INTER_AREA)
                if resized.shape != (64, 32, 3):
                    print(f"Warning: Crop {i} has unexpected shape after resize: {resized.shape}")
                    continue

                hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
                roi = hsv[16:48, 8:24]
                if roi.shape != (32, 16, 3):
                    print(f"Warning: Crop {i} ROI has unexpected shape: {roi.shape}")
                    continue

                feature = roi.reshape(-1)
                if feature.shape[0] != expected_feature_size:
                    print(f"Warning: Crop {i} feature vector has unexpected size: {feature.shape[0]}")
                    continue

                features.append(feature)

                rgb_crop = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
                pixels = rgb_crop[16:48, 8:24].reshape(-1, 3)
                kmeans_color = KMeans(n_clusters=1, random_state=0, n_init=10).fit(pixels)
                dominant_color = kmeans_color.cluster_centers_[0].astype(int)
                dominant_color_bgr = (int(dominant_color[2]), int(dominant_color[1]), int(dominant_color[0]))
                self.team_colors.append(dominant_color_bgr)

                if i < 50:
                    sample_path = os.path.join(output_dir, f"sample_crop_{i}.jpg")
                    cv2.imwrite(sample_path, crop)

            except Exception as e:
                print(f"Error processing crop {i}: {e}")
                continue

        if len(features) < 15:
            print(f"Not enough valid features for team classification (got {len(features)})")
            return False

        print(f"Collected {len(features)} valid features with shape {features[0].shape}")
        features_array = np.array(features)
        print(f"Features array shape: {features_array.shape}")

        try:
            self.kmeans = KMeans(n_clusters=2, random_state=0, n_init=10).fit(features_array)
        except Exception as e:
            print(f"KMeans clustering failed: {e}")
            return False

        unique_labels, counts = np.unique(self.kmeans.labels_, return_counts=True)
        print(f"Cluster sizes: {dict(zip(unique_labels, counts))}")
        if len(unique_labels) < 2 or min(counts) < 3:
            print("Clustering did not find two distinct teams (need at least 3 samples per cluster)")
            return False

        team_0_indices = [i for i, label in enumerate(self.kmeans.labels_) if label == 0]
        team_1_indices = [i for i, label in enumerate(self.kmeans.labels_) if label == 1]

        team_0_colors = [self.team_colors[i] for i in team_0_indices if i < len(self.team_colors)]
        team_1_colors = [self.team_colors[i] for i in team_1_indices if i < len(self.team_colors)]

        if team_0_colors:
            team_0_colors = [color for color in team_0_colors if color is not None]
            if team_0_colors:
                team_0_avg_color = np.mean(team_0_colors, axis=0).astype(int)
                self.team_avg_colors[0] = tuple(int(c) for c in team_0_avg_color)
        if team_1_colors:
            team_1_colors = [color for color in team_1_colors if color is not None]
            if team_1_colors:
                team_1_avg_color = np.mean(team_1_colors, axis=0).astype(int)
                self.team_avg_colors[1] = tuple(int(c) for c in team_1_avg_color)

        print(f"Team classification complete: Team A: {len(team_0_indices)} players, Team B: {len(team_1_indices)} players")
        print(f"Team A color (BGR): {self.team_avg_colors[0]}, Team B color (BGR): {self.team_avg_colors[1]}")

        for i, label in enumerate(self.kmeans.labels_[:50]):
            if i < len(valid_crops):
                crop = valid_crops[i]
                team = "Team A" if label == 0 else "Team B"
                labeled_path = os.path.join(output_dir, f"labeled_crop_{i}_team_{team}.jpg")
                cv2.imwrite(labeled_path, crop)

        self.is_fitted = True
        return True

    def predict(self, crops: List[np.ndarray]) -> List[int]:
        """
        Predict team IDs for a list of player crops.

        Args:
            crops (List[np.ndarray]): List of player crop images.

        Returns:
            List[int]: Predicted team IDs (0 or 1).
        """
        if not self.is_fitted or self.kmeans is None:
            print("Warning: TeamClassifier not fitted, returning default team assignments")
            return [0] * len(crops)

        features = []
        valid_indices = []
        expected_feature_size = 32 * 16 * 3  # ROI: hsv[16:48, 8:24]
        for i, crop in enumerate(crops):
            if crop is None or crop.size == 0 or crop.shape[0] < 15 or crop.shape[1] < 15:
                continue
            try:
                resized = cv2.resize(crop, (32, 64), interpolation=cv2.INTER_AREA)
                hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
                roi = hsv[16:48, 8:24]
                if roi.shape != (32, 16, 3):
                    continue
                feature = roi.reshape(-1)
                if feature.shape[0] != expected_feature_size:
                    continue
                features.append(feature)
                valid_indices.append(i)
            except Exception as e:
                print(f"Error processing crop {i} in predict: {e}")
                continue

        if not features:
            print("No valid features for prediction")
            return [0] * len(crops)

        features_array = np.array(features)
        try:
            predictions = self.kmeans.predict(features_array)
        except Exception as e:
            print(f"Prediction failed: {e}")
            return [0] * len(crops)

        result = [0] * len(crops)
        for i, idx in enumerate(valid_indices):
            result[idx] = int(predictions[i])
        return result