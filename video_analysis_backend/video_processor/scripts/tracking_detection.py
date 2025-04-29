import supervision as sv
from ultralytics import YOLO
import numpy as np
from typing import Tuple
from .team_classification import TeamClassifier

track_history = {}  # Global dictionary to store tracking history

def detect_players_and_ball(
    frame: np.ndarray,
    player_model: YOLO,
    conf_threshold: float,
    ball_class_id: int
) -> Tuple[sv.Detections, sv.Detections, str]:
    """
    Detect players, ball, goalkeepers, and referees in a frame using the player model.

    Args:
        frame (np.ndarray): Input frame.
        player_model (YOLO): YOLO model for detecting all objects (players, ball, goalkeepers, referees).
        conf_threshold (float): Confidence threshold for detections.
        ball_class_id (int): Class ID for the ball.

    Returns:
        Tuple[sv.Detections, sv.Detections, str]: All detections, ball detections, and model used ('player_model').
    """
    try:
        # Detect all objects using the player model
        player_results = player_model.predict(frame, conf=conf_threshold)
        all_detections = sv.Detections.from_ultralytics(player_results[0])

        # Extract ball detections
        ball_detections = all_detections[all_detections.class_id == ball_class_id]

        return all_detections, ball_detections, "player_model"
    except Exception as e:
        print(f"Error in detect_players_and_ball: {e}")
        return sv.Detections.empty(), sv.Detections.empty(), "none"

def track_and_assign_teams(
    detections: sv.Detections,
    tracker: sv.ByteTrack,
    team_classifier: 'TeamClassifier',
    frame: np.ndarray,
    goalkeeper_id: int,
    player_id: int,
    referee_id: int,
    frame_idx: int
) -> Tuple[sv.Detections, sv.Detections, sv.Detections, sv.Detections]:
    """
    Track detections and assign teams to players and goalkeepers.

    Args:
        detections (sv.Detections): Input detections.
        tracker (sv.ByteTrack): Tracker instance.
        team_classifier (TeamClassifier): Team classifier instance.
        frame (np.ndarray): Input frame.
        goalkeeper_id (int): Class ID for goalkeepers.
        player_id (int): Class ID for players.
        referee_id (int): Class ID for referees.
        frame_idx (int): Current frame index.

    Returns:
        Tuple[sv.Detections, sv.Detections, sv.Detections, sv.Detections]:
            All tracked detections, goalkeepers, players, referees.
    """
    try:
        # Track detections
        tracked_detections = tracker.update_with_detections(detections)

        # Separate detections by class
        goalkeepers = tracked_detections[tracked_detections.class_id == goalkeeper_id]
        players = tracked_detections[tracked_detections.class_id == player_id]
        referees = tracked_detections[tracked_detections.class_id == referee_id]

        # Initialize team_id array
        team_ids = np.zeros(len(tracked_detections), dtype=np.int32)

        # Assign teams to players
        if len(players) > 0:
            player_crops = [sv.crop_image(frame, xyxy) for xyxy in players.xyxy]
            valid_crops = [crop for crop in player_crops if crop is not None and crop.size > 0]
            if valid_crops:
                predicted_team_ids = team_classifier.predict(valid_crops)
                player_indices = np.where(tracked_detections.class_id == player_id)[0]
                for idx, team_id in zip(player_indices[:len(predicted_team_ids)], predicted_team_ids):
                    team_ids[idx] = team_id

        # Assign teams to goalkeepers
        if len(goalkeepers) > 0:
            goalkeeper_crops = [sv.crop_image(frame, xyxy) for xyxy in goalkeepers.xyxy]
            valid_crops = [crop for crop in goalkeeper_crops if crop is not None and crop.size > 0]
            if valid_crops:
                predicted_team_ids = team_classifier.predict(valid_crops)
                goalkeeper_indices = np.where(tracked_detections.class_id == goalkeeper_id)[0]
                for idx, team_id in zip(goalkeeper_indices[:len(predicted_team_ids)], predicted_team_ids):
                    team_ids[idx] = team_id

        # Referees get a default team_id (e.g., 2 for neutral)
        referee_indices = np.where(tracked_detections.class_id == referee_id)[0]
        team_ids[referee_indices] = 2

        # Create new detections with team_id
        all_detections = tracked_detections
        all_detections.team_id = team_ids

        # Update track_history
        track_history[frame_idx] = {}
        for i, tracker_id in enumerate(all_detections.tracker_id):
            track_history[frame_idx][tracker_id] = {
                'bbox': all_detections.xyxy[i].tolist(),
                'class_id': int(all_detections.class_id[i]),
                'team_id': int(all_detections.team_id[i])
            }

        return all_detections, goalkeepers, players, referees
    except Exception as e:
        print(f"Error in track_and_assign_teams: {e}")
        return sv.Detections.empty(), sv.Detections.empty(), sv.Detections.empty(), sv.Detections.empty()

def resolve_goalkeepers_team_id(
    goalkeepers: sv.Detections,
    players: sv.Detections
) -> sv.Detections:
    """
    Resolve team IDs for goalkeepers based on nearby players.

    Args:
        goalkeepers (sv.Detections): Goalkeeper detections.
        players (sv.Detections): Player detections.

    Returns:
        sv.Detections: Goalkeepers with updated team IDs.
    """
    try:
        if len(goalkeepers) == 0 or len(players) == 0:
            return goalkeepers

        team_ids = goalkeepers.team_id.copy()
        for i, gk_box in enumerate(goalkeepers.xyxy):
            gk_center = np.array([(gk_box[0] + gk_box[2]) / 2, (gk_box[1] + gk_box[3]) / 2])
            min_dist = float('inf')
            closest_team = team_ids[i]

            for j, p_box in enumerate(players.xyxy):
                p_center = np.array([(p_box[0] + p_box[2]) / 2, (p_box[1] + p_box[3]) / 2])
                dist = np.linalg.norm(gk_center - p_center)
                if dist < min_dist:
                    min_dist = dist
                    closest_team = players.team_id[j]

            team_ids[i] = closest_team

        goalkeepers.team_id = team_ids
        return goalkeepers
    except Exception as e:
        print(f"Error in resolve_goalkeepers_team_id: {e}")
        return goalkeepers