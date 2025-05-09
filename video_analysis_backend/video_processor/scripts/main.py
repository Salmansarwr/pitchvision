import os
import cv2
import torch
import supervision as sv
from ultralytics import YOLO
import numpy as np
from collections import deque, defaultdict
from tqdm import tqdm
import gc
import shutil
from .team_classification import TeamClassifier
from .annotation import draw_player_stats, draw_possession_bar, draw_goal_overlay
from .tracking_detection import detect_players_and_ball, track_and_assign_teams, resolve_goalkeepers_team_id, track_history
from .keypoints_detection import KeypointsTracker, keypoint_history
from .homography_mapper import ObjectPositionMapper
from .projection import ProjectionAnnotator
from .utils import clean_ball_path, smooth_positions, get_feet_pos
from .json_writer import JsonWriter

def is_shot_taken(ball_projection, prev_ball_projection, player_team, frame_idx):
    """
    Check if a shot is taken based on ball trajectory toward goal
    
    Args:
        ball_projection: Current ball position
        prev_ball_projection: Previous ball position
        player_team: Team of the player closest to the ball
        frame_idx: Current frame index
        
    Returns:
        bool: True if shot detected
    """
    if ball_projection is None or prev_ball_projection is None:
        return False
    
    x, y = ball_projection
    prev_x, prev_y = prev_ball_projection
    
    # Calculate direction vector and velocity
    dx = x - prev_x
    dy = y - prev_y
    velocity = np.sqrt(dx*dx + dy*dy)
    
    # Check if ball is moving toward goals with sufficient velocity
    if velocity < 3:  # Minimum velocity threshold
        return False
        
    # Left goal (Team B defends)
    if player_team == "Team A" and dx < -2:  # Moving toward left goal
        # Distance to left goal center
        distance_to_goal = np.sqrt((x - 32)**2 + (y - 176)**2)
        # Check if ball is heading toward goal within a reasonable angle and distance
        if distance_to_goal < 150 and abs(dy) < abs(dx) * 0.8:  # Angle constraint
            print(f"Frame {frame_idx}: Shot detected from Team A toward left goal")
            return True
    
    # Right goal (Team A defends)
    if player_team == "Team B" and dx > 2:  # Moving toward right goal
        # Distance to right goal center
        distance_to_goal = np.sqrt((x - 495)**2 + (y - 176)**2)
        # Check if ball is heading toward goal within a reasonable angle and distance
        if distance_to_goal < 150 and abs(dy) < abs(dx) * 0.8:  # Angle constraint
            print(f"Frame {frame_idx}: Shot detected from Team B toward right goal")
            return True
    
    return False

def main_processing(
    input_video_path,
    output_dir,
    output_video_path,
    summary_json_path,
    object_tracks_path,
    keypoint_tracks_path,
    team_samples_dir,
    field_image_path="media/input_videos/field_2d_v2.png",
    player_model_path="models/od.pt",
    keypoints_model_path="models/kd.pt",
    pixels_per_meter=10,
    max_history=30,
    possession_distance_threshold=50,
    min_confidence_threshold=0.4,
    smoothing_window=3,
    team_classification_stride=30,
    target_resolution=(1920, 1280),
    player_detection_resolution=(1280, 736),
    keypoint_detection_resolution=(1280, 1280),
    canvas_width=1920,
    canvas_height=1280,
    goal_overlay_duration=30,
    max_exit_frames=5
):
    """
    Main processing function that can be called from Django views.
    
    Args:
        input_video_path: Path to the input video file
        output_dir: Directory for storing output files
        output_video_path: Path for the annotated output video
        summary_json_path: Path for the match summary JSON
        object_tracks_path: Path for object tracks JSON
        keypoint_tracks_path: Path for keypoint tracks JSON
        team_samples_dir: Directory for team sample images
        field_image_path: Path to the field image for projection view
        player_model_path: Path to the YOLO model for player detection
        keypoints_model_path: Path to the YOLO model for keypoint detection
        pixels_per_meter: Conversion ratio from pixels to meters
        max_history: Maximum history length for tracking
        possession_distance_threshold: Threshold for determining ball possession
        min_confidence_threshold: Minimum confidence for detections
        smoothing_window: Window size for smoothing positions
        team_classification_stride: Stride for team classification sampling
        target_resolution: Target resolution for processing
        player_detection_resolution: Resolution for player detection
        keypoint_detection_resolution: Resolution for keypoint detection
        canvas_width: Width of the output canvas
        canvas_height: Height of the output canvas
        goal_overlay_duration: Duration of goal overlay in frames
        max_exit_frames: Maximum frames to exit goal detection state
    
    Returns:
        bool: True if processing was successful, False otherwise
    """
    # Class IDs
    BALL_CLASS_ID = 0
    GOALKEEPER_ID = 1
    PLAYER_ID = 2
    REFEREE_ID = 3

    # Set device for GPU acceleration
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Check if output directory exists and remove it if it does
    if os.path.exists(output_dir):
       try:
        shutil.rmtree(output_dir)
        print(f"Removed existing output directory: {output_dir}")
       except Exception as e:
        print(f"Warning: Could not remove output directory: {e}")


    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(team_samples_dir, exist_ok=True)
    tracks_dir = os.path.dirname(object_tracks_path)
    events_dir = os.path.join(output_dir, "events")
    os.makedirs(tracks_dir, exist_ok=True)
    os.makedirs(events_dir, exist_ok=True)
    print(f"Created output directories: {output_dir}, {team_samples_dir}, {tracks_dir}, {events_dir}")

    # Initialize JsonWriter
    json_writer = JsonWriter(
        save_dir=tracks_dir,
        summary_dir=output_dir,
        object_fname=os.path.splitext(os.path.basename(object_tracks_path))[0],
        keypoints_fname=os.path.splitext(os.path.basename(keypoint_tracks_path))[0],
        summary_fname=os.path.splitext(os.path.basename(summary_json_path))[0]
    )

    # Verify model and field image files exist
    for path in [player_model_path, keypoints_model_path, field_image_path]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"File not found at {path}")

    # Load field image
    projection_frame = cv2.imread(field_image_path)
    if projection_frame is None:
        raise RuntimeError(f"Failed to load field image from {field_image_path}")

    # Define top-down keypoints for the soccer field
    top_down_keypoints = np.array([
        [0, 0], [0, 57], [0, 122], [0, 229], [0, 293], [0, 351],
        [32, 122], [32, 229],
        [64, 176],
        [96, 57], [96, 122], [96, 229], [96, 293],
        [263, 0], [263, 122], [263, 229], [263, 351],
        [431, 57], [431, 122], [431, 229], [431, 293],
        [463, 176],
        [495, 122], [495, 229],
        [527, 0], [527, 57], [527, 122], [527, 229], [527, 293], [527, 351],
        [210, 176], [317, 176]
    ], dtype=np.float32)

    # Initialize models and trackers
    try:
        player_model = YOLO(player_model_path).to(device)
        keypoints_model = YOLO(keypoints_model_path).to(device)
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {e}")
    tracker = sv.ByteTrack(frame_rate=30)
    kp_tracker = KeypointsTracker(
        model_path=keypoints_model_path,
        conf=0.3,
        kp_conf=0.7
    )
    position_mapper = ObjectPositionMapper(top_down_keypoints=top_down_keypoints, alpha=0.9)
    projection_annotator = ProjectionAnnotator()
    # Verify input video
    if not os.path.exists(input_video_path):
        raise FileNotFoundError(f"Input video not found at {input_video_path}")

    # Check true frame count
    cap = cv2.VideoCapture(input_video_path)
    true_frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    time_per_frame = 1 / fps if fps > 0 else 1 / 30
    print(f"Input video has {true_frame_count} frames, resolution: {frame_width}x{frame_height}, FPS: {fps}")
    cap.release()

    # Team classification training phase
    print("Starting team classification training phase...")
    cap = cv2.VideoCapture(input_video_path)
    crops = []
    frame_count = 0
    print("Collecting player crops for team classification...")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_for_detection = cv2.resize(frame, player_detection_resolution, interpolation=cv2.INTER_AREA)
        if frame_count % team_classification_stride == 0:
            try:
                results = player_model.predict(frame_for_detection, conf=0.3)
                result = results[0]
                if hasattr(result, 'boxes') and result.boxes is not None and len(result.boxes) > 0:
                    detections = sv.Detections.from_ultralytics(result)
                    players_detections = detections[detections.class_id == PLAYER_ID]
                    scale_x = frame.shape[1] / player_detection_resolution[0]
                    scale_y = frame.shape[0] / player_detection_resolution[1]
                    players_detections.xyxy = players_detections.xyxy * np.array([scale_x, scale_y, scale_x, scale_y])
                    for i, xyxy in enumerate(players_detections.xyxy):
                        crop = sv.crop_image(frame, xyxy)
                        if crop is not None and crop.size > 0 and crop.shape[0] >= 15 and crop.shape[1] >= 15:
                            crops.append(crop)
                            if len(crops) <= 50:
                                cv2.imwrite(os.path.join(team_samples_dir, f"player_crop_{len(crops)}.jpg"), crop)
            except Exception as e:
                print(f"Error processing frame {frame_count} for team classification: {e}")
        frame_count += 1
        del frame, frame_for_detection
        gc.collect()
    cap.release()
    print(f"Extracted {len(crops)} player crops from {frame_count} frames")
    if frame_count != true_frame_count:
        print(f"Warning: Expected {true_frame_count} frames, but extracted {frame_count} frames")

    team_classifier = TeamClassifier(device="cpu")
    success = team_classifier.fit(crops, team_samples_dir)
    if not success:
        print("Team classification failed. Using default team assignments.")
        team_classifier.team_avg_colors = [(255, 255, 255), (0, 255, 0)]

    # Set up colors for annotations
    team_colors = team_classifier.team_avg_colors
    print(f"Using team colors: Team A: {team_colors[0]}, Team B: {team_colors[1]}")

    # Function to detect if a goal is scored
    def is_goal_scored(ball_projection, frame_idx):
        """
        Check if a goal is scored based on ball position
        
        Args:
            ball_projection: The projected ball position
            frame_idx: The current frame index
            
        Returns:
            Tuple[bool, str]: (goal detected, scoring team)
        """
        if ball_projection is None:
            return False, None
        x, y = ball_projection
        print(f"Frame {frame_idx}: Ball projection = ({x:.2f}, {y:.2f})")
        # Left goal (Team B scores): beyond [32, 122], [32, 229]
        if x < 32 and 122 <= y <= 229:
            print(f"Frame {frame_idx}: Goal detected for Team B (Left goal)")
            return True, "Team B"
        # Right goal (Team A scores): beyond [495, 122], [495, 229]
        if x > 495 and 122 <= y <= 229:
            print(f"Frame {frame_idx}: Goal detected for Team A (Right goal)")
            return True, "Team A"
        return False, None

    # Main processing phase
    print("Starting main video processing...")
    cap = cv2.VideoCapture(input_video_path)
    # Use XVID codec for the temporary output - this is widely supported by OpenCV
    out_video = cv2.VideoWriter(
    output_video_path,
    cv2.VideoWriter_fourcc(*'avc1'),  # More universally supported codec
    fps,
    (canvas_width, canvas_height)
    )

    ball_positions = deque(maxlen=max_history)
    ball_confidences = deque(maxlen=max_history)
    last_closest_player = None
    pass_count = 0
    player_positions = defaultdict(lambda: deque(maxlen=max_history))
    player_distances = defaultdict(float)
    player_speeds = defaultdict(float)
    team_map = {}
    all_tracks = {}
    summary_data = {
        "passes": [],
        "shots": [],  # Add shots array to track shots
        "possessions": [],
        "player_stats": {},
        "team_stats": {
            "Team A": {"possession": 0, "passes": 0, "shots": 0, "possession_percentage": 0},
            "Team B": {"possession": 0, "passes": 0, "shots": 0, "possession_percentage": 0}
        },
        "goals": []
    }

    # Initialize goal state machine
    goal_in_progress = False
    exit_counter = 0
    goal_overlay_frames = 0
    display_goal_overlay = False
    goal_frame_counter = 0
    
    # Initialize shot detection variables
    prev_ball_projection = None
    last_shot_frame = -100  # To avoid detecting multiple shots for the same action
    shot_cooldown = 0

    frame_idx = 0
    for _ in tqdm(range(true_frame_count), desc="Processing frames"):
        ret, frame = cap.read()
        if not ret:
            print(f"Reached end of video at frame {frame_idx}")
            break
        frame = cv2.resize(frame, target_resolution, interpolation=cv2.INTER_AREA)
        frame_for_player_detection = cv2.resize(frame, player_detection_resolution, interpolation=cv2.INTER_AREA)
        frame_for_keypoint_detection = cv2.resize(frame, keypoint_detection_resolution, interpolation=cv2.INTER_AREA)

        # Detect players, ball, goalkeepers, and referees
        detections, ball_detections, used_model = detect_players_and_ball(
            frame_for_player_detection, player_model, min_confidence_threshold, BALL_CLASS_ID
        )
        player_scale_x = target_resolution[0] / player_detection_resolution[0]
        player_scale_y = target_resolution[1] / player_detection_resolution[1]
        if len(detections) > 0:
            detections.xyxy = detections.xyxy * np.array([player_scale_x, player_scale_y, player_scale_x, player_scale_y])
        if len(ball_detections) > 0:
            ball_detections.xyxy = ball_detections.xyxy * np.array([player_scale_x, player_scale_y, player_scale_x, player_scale_y])

        # Detect and track keypoints
        kp_detections = kp_tracker.detect(frame_for_keypoint_detection)
        kp_tracks = kp_tracker.track(kp_detections, frame_idx)
        kp_scale_x = target_resolution[0] / keypoint_detection_resolution[0]
        kp_scale_y = target_resolution[1] / keypoint_detection_resolution[1]
        for kp_id, kp_info in keypoint_history.get(frame_idx, {}).items():
            x, y = kp_info['coords']
            kp_info['coords'] = (x * kp_scale_x, y * kp_scale_y)

        # Update ball positions
        if len(ball_detections) > 0:
            valid_balls = ball_detections[ball_detections.confidence >= min_confidence_threshold]
            if len(valid_balls) > 0:
                ball_detections = valid_balls
                top_idx = valid_balls.confidence.argmax()
                ball_detections.xyxy = ball_detections.xyxy[top_idx:top_idx+1]
                ball_detections.confidence = ball_detections.confidence[top_idx:top_idx+1]
                x1, y1, x2, y2 = ball_detections.xyxy[0]
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)
                ball_positions.append((cx, cy))
                ball_confidences.append(ball_detections.confidence[0])
            else:
                ball_positions.append(None)
                ball_confidences.append(0)
        else:
            ball_positions.append(None)
            ball_confidences.append(0)

        # Track and assign teams
        all_detections, goalkeepers_detections, players_detections, referees_detections = track_and_assign_teams(
            detections, tracker, team_classifier, frame, GOALKEEPER_ID, PLAYER_ID, REFEREE_ID, frame_idx
        )

        # Create all_tracks entry for this frame
        all_tracks[frame_idx] = {
            'keypoints': {k: v for k, v in keypoint_history.get(frame_idx, {}).items()},
            'object': {
                'player': {},
                'goalkeeper': {},
                'referee': {},
                'ball': {}
            }
        }

        # Populate object tracks
        for i, tracker_id in enumerate(all_detections.tracker_id):
            class_id = all_detections.class_id[i]
            team_id = all_detections.team_id[i] if hasattr(all_detections, 'team_id') else 2
            class_name = 'goalkeeper' if class_id == GOALKEEPER_ID else 'player' if class_id == PLAYER_ID else 'referee' if class_id == REFEREE_ID else 'ball'
            team = 'Team A' if team_id == 0 else 'Team B' if team_id == 1 else 'Referee'
            club_color = team_colors[0] if team == 'Team A' else team_colors[1] if team == 'Team B' else (0, 0, 0)
            bbox = all_detections.xyxy[i].tolist()
            confidence = float(all_detections.confidence[i]) if i < len(all_detections.confidence) else 0.0
            all_tracks[frame_idx]['object'][class_name][tracker_id] = {
                'class_id': int(class_id),
                'bbox': bbox,
                'confidence': confidence,
                'club_color': class_name == 'ball' and (0, 255, 255) or club_color,
                'team': class_name == 'ball' and 'Ball' or team,
                'team_id': class_name == 'ball' and -1 or int(team_id),
                'has_ball': False
            }

        # Add ball to object tracks
        if len(ball_detections) > 0:
            ball_bbox = ball_detections.xyxy[0].tolist()
            ball_confidence = float(ball_detections.confidence[0]) if len(ball_detections.confidence) > 0 else 0.0
            all_tracks[frame_idx]['object']['ball'][1] = {
                'class_id': BALL_CLASS_ID,
                'bbox': ball_bbox,
                'confidence': ball_confidence,
                'club_color': (0, 255, 255),
                'team': 'Ball',
                'team_id': -1,
                'has_ball': False
            }

        # Map object positions to top-down view
        detection_data = {
            'keypoints': keypoint_history.get(frame_idx, {}),
            'object': track_history.get(frame_idx, {})
        }
        mapped_data = position_mapper.map(detection_data)

        # Update all_tracks with projections
        for class_name in ['player', 'goalkeeper', 'referee']:
            for track_id, track_info in mapped_data.get('object', {}).items():
                if 'projection' in track_info and track_id in all_tracks[frame_idx]['object'].get(class_name, {}):
                    all_tracks[frame_idx]['object'][class_name][track_id]['projection'] = track_info['projection']

        # Add ball projection
        ball_projection = None
        if len(ball_positions) > 0 and ball_positions[-1] is not None:
            ball_pos = ball_positions[-1]
            ball_bbox = ball_detections.xyxy[0].tolist() if len(ball_detections) > 0 else [ball_pos[0]-5, ball_pos[1]-5, ball_pos[0]+5, ball_pos[1]+5]
            ball_mapped = position_mapper.map({
                'keypoints': keypoint_history.get(frame_idx, {}),
                'object': {1: {'bbox': ball_bbox}}
            })
            if 'projection' in ball_mapped.get('object', {}).get(1, {}):
                ball_projection = ball_mapped['object'][1]['projection']
                all_tracks[frame_idx]['object']['ball'][1]['projection'] = ball_projection

        # Goal detection with state machine
        goal_detected = False
        scoring_team = None
        if ball_projection is not None:
            goal_detected, scoring_team = is_goal_scored(ball_projection, frame_idx)
            if goal_detected:
                if not goal_in_progress:
                    print(f"Goal scored at frame {frame_idx} for {scoring_team}!")
                    summary_data["goals"].append({
                        "frame": frame_idx,
                        "team": scoring_team,
                        "player_id": int(closest_player) if closest_player is not None else None
                    })
                    event_filename = os.path.join(events_dir, f"goal_{scoring_team}_{frame_idx}.jpg")
                    cv2.imwrite(event_filename, frame)
                    print(f"Saved goal event frame to {event_filename}")
                    
                    # Mark most recent shot as on target if within last 150 frames
                    recent_shots = [shot for shot in summary_data["shots"] 
                                  if shot["team"] == scoring_team and frame_idx - shot["frame"] < 150]
                    if recent_shots:
                        recent_shots[-1]["on_target"] = True
                        
                    goal_in_progress = True
                    display_goal_overlay = True
                    goal_overlay_frames = goal_overlay_duration
                    goal_frame_counter = 0
                    
                exit_counter = 0
            else:
                if goal_in_progress:
                    exit_counter += 1
                    if exit_counter > max_exit_frames:
                        goal_in_progress = False
                        exit_counter = 0
                        
        # Shot detection
        if shot_cooldown > 0:
            shot_cooldown -= 1
            
        if ball_projection is not None and prev_ball_projection is not None and shot_cooldown == 0:
            if current_possession_team in ["Team A", "Team B"] and closest_player is not None:
                # Check if this is a shot
                if is_shot_taken(ball_projection, prev_ball_projection, current_possession_team, frame_idx):
                    # Calculate ball speed
                    x1, y1 = ball_projection
                    px1, py1 = prev_ball_projection
                    ball_distance = np.sqrt((x1-px1)**2 + (y1-py1)**2)
                    ball_speed_mps = ball_distance / time_per_frame / pixels_per_meter
                    ball_speed_kmph = ball_speed_mps * 3.6
                    
                    # Record shot
                    if frame_idx - last_shot_frame > 30:  # Avoid duplicate detections
                        summary_data["shots"].append({
                            "frame": frame_idx,
                            "player_id": int(closest_player),
                            "team": current_possession_team,
                            "ball_speed_kmph": round(ball_speed_kmph, 2),
                            "on_target": False
                        })
                        
                        # Increment team shots counter
                        summary_data["team_stats"][current_possession_team]["shots"] += 1
                        
                        # Save shot frame
                        event_filename = os.path.join(events_dir, f"shot_{current_possession_team}_{frame_idx}.jpg")
                        cv2.imwrite(event_filename, frame)
                        print(f"Saved shot event frame to {event_filename}")
                        
                        last_shot_frame = frame_idx
                        shot_cooldown = 30  # Prevent multiple detections of the same shot
        
        # Update previous ball position for the next frame
        prev_ball_projection = ball_projection

        # Calculate player metrics and update
        player_speeds_for_frame = {}
        for i, tracker_id in enumerate(all_detections.tracker_id):
            if all_detections.class_id[i] in [BALL_CLASS_ID, REFEREE_ID]:
                continue
            x1, y1, x2, y2 = all_detections.xyxy[i]
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            player_positions[tracker_id].append((cx, cy))
            if len(player_positions[tracker_id]) >= 2:
                pos_current = player_positions[tracker_id][-1]
                pos_prev = player_positions[tracker_id][-2]
                dx = pos_current[0] - pos_prev[0]
                dy = pos_current[1] - pos_prev[1]
                distance_pixels = np.sqrt(dx**2 + dy**2)
                distance_meters = distance_pixels / pixels_per_meter
                player_distances[tracker_id] += distance_meters
                speed_mps = distance_meters / time_per_frame
                speed_kmph = min(speed_mps * 3.6, 50.0)  # Cap at 50 km/h to avoid outliers
                player_speeds[tracker_id] = speed_kmph
                player_speeds_for_frame[tracker_id] = speed_kmph
            else:
                player_speeds[tracker_id] = 0
                player_speeds_for_frame[tracker_id] = 0

        # Assign teams for player stats and possession
        for i, tracker_id in enumerate(all_detections.tracker_id):
            class_id = all_detections.class_id[i]
            team_id = all_detections.team_id[i] if hasattr(all_detections, 'team_id') else 2
            team = 'Team A' if team_id == 0 else 'Team B' if team_id == 1 else 'Referee'
            team_map[tracker_id] = team
            
            if team != 'Referee':
                player_id = str(tracker_id)
                if player_id not in summary_data["player_stats"]:
                    summary_data["player_stats"][player_id] = {
                        "team": team,
                        "total_distance_m": 0,
                        "max_speed_kmph": 0,
                        "avg_speed_kmph": 0,
                        "speed_history": []
                    }
                player_stat = summary_data["player_stats"][player_id]
                player_stat["total_distance_m"] = round(player_distances[tracker_id], 2)
                player_stat["max_speed_kmph"] = max(player_stat["max_speed_kmph"], round(player_speeds[tracker_id], 2))
                player_stat["speed_history"].append(round(player_speeds[tracker_id], 2))
                player_stat["avg_speed_kmph"] = round(sum(player_stat["speed_history"]) / len(player_stat["speed_history"]), 2)

        # Detect passes and calculate possession
        closest_player = None
        min_distance = float('inf')
        current_possession_team = None

        if len(ball_positions) > 0 and ball_positions[-1] is not None:
            ball_point = np.array(ball_positions[-1], dtype=np.float32)
            
            for i, box in enumerate(all_detections.xyxy):
                if all_detections.class_id[i] == REFEREE_ID:
                    continue
                    
                px = (box[0] + box[2]) / 2
                py = (box[1] + box[3]) / 2
                dist = np.linalg.norm(ball_point - np.array([px, py], dtype=np.float32))
                if dist < min_distance:
                    min_distance = dist
                    closest_player = all_detections.tracker_id[i]

            if closest_player is not None and min_distance < possession_distance_threshold:
                current_possession_team = team_map.get(closest_player, "Unknown")
                
                # Mark player as having the ball
                for class_name in ['player', 'goalkeeper']:
                    if closest_player in all_tracks[frame_idx]['object'].get(class_name, {}):
                        all_tracks[frame_idx]['object'][class_name][closest_player]['has_ball'] = True

                # Update possession stats
                if current_possession_team in ["Team A", "Team B"]:
                    summary_data["team_stats"][current_possession_team]["possession"] += 1

                # Detect pass if there's a change in possession
                if last_closest_player is not None and closest_player != last_closest_player:
                    from_team = team_map.get(last_closest_player, "Unknown")
                    to_team = team_map.get(closest_player, "Unknown")
                    
                    # Only count as a pass if both players are from the same team
                    if from_team == to_team and from_team in ["Team A", "Team B"]:
                        pass_count += 1
                        
                        # Calculate ball speed for the pass
                        ball_speed_kmph = 0
                        if len(ball_positions) >= 2 and ball_positions[-1] is not None and ball_positions[-2] is not None:
                            p1 = ball_positions[-1]
                            p2 = ball_positions[-2]
                            distance_pixels = np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
                            distance_meters = distance_pixels / pixels_per_meter
                            speed_mps = distance_meters / time_per_frame
                            ball_speed_kmph = speed_mps * 3.6
                        
                        # Record the pass
                        summary_data["passes"].append({
                            "frame": frame_idx,
                            "from_player": int(last_closest_player),
                            "to_player": int(closest_player),
                            "from_team": from_team,
                            "to_team": to_team,
                            "ball_speed_kmph": round(ball_speed_kmph, 2)
                        })
                        
                        # Update team pass stats
                        summary_data["team_stats"][from_team]["passes"] += 1
                        
                        print(f"Frame {frame_idx}: Pass #{pass_count} from Player {last_closest_player} to Player {closest_player}")

                # Update last closest player
                last_closest_player = closest_player
            else:
                # No player close enough to the ball
                current_possession_team = None
                last_closest_player = None
        else:
            # No ball detected
            current_possession_team = None
            last_closest_player = None

        # Record possession for this frame
        if current_possession_team in ["Team A", "Team B"]:
            summary_data["possessions"].append({
                "frame": frame_idx,
                "team": current_possession_team
            })

        # Manage goal overlay display
        if display_goal_overlay and goal_overlay_frames > 0:
            goal_overlay_frames -= 1
            goal_frame_counter += 1
            if goal_overlay_frames == 0:
                display_goal_overlay = False
                goal_frame_counter = 0

        # Save tracking data to JSON
        json_writer.write_object_tracks(all_tracks[frame_idx]['object'])
        json_writer.write_keypoint_tracks(all_tracks[frame_idx]['keypoints'])

        # Draw annotations
        annotated = frame.copy()
        for i, tracker_id in enumerate(all_detections.tracker_id):
            class_id = all_detections.class_id[i]
            if class_id == BALL_CLASS_ID:
                continue
                
            team_id = all_detections.team_id[i] if hasattr(all_detections, 'team_id') else 2
            if tracker_id in goalkeepers_detections.tracker_id:
                obj_cls = 'goalkeeper'
                color = team_colors[0] if team_id == 0 else team_colors[1] if team_id == 1 else (0, 0, 0)
            elif tracker_id in referees_detections.tracker_id:
                obj_cls = 'referee'
                color = (0, 0, 0)
            else:
                obj_cls = 'player'
                color = team_colors[0] if team_id == 0 else team_colors[1] if team_id == 1 else (0, 0, 0)

            xyxy = all_detections.xyxy[i]
            speed = player_speeds[tracker_id]
            distance = player_distances[tracker_id]
            annotated = draw_player_stats(annotated, xyxy, color, tracker_id, speed, distance, obj_cls, team_id)

            # Draw red triangle above closest player
            if tracker_id == closest_player and obj_cls in ['player', 'goalkeeper']:
                x1, y1, x2, y2 = map(int, xyxy)
                cx = (x1 + x2) // 2
                cy = int(y1)
                pts = np.array([[cx, cy - 40], [cx - 15, cy - 70], [cx + 15, cy - 70]], np.int32)
                cv2.fillPoly(annotated, [pts], (0, 0, 255))
                cv2.polylines(annotated, [pts], True, (0, 0, 0), 1)

        # Draw ball annotations
        if len(ball_detections) > 0:
            for xyxy in ball_detections.xyxy:
                x1, y1, x2, y2 = map(int, xyxy)
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2
                cv2.circle(annotated, (cx, cy), 5, (0, 255, 255), -1)
                cv2.ellipse(annotated, (cx, cy), (20, 10), 0, 0, 360, (255, 255, 0), 2)
                pts = np.array([[cx, cy - 40], [cx - 15, cy - 70], [cx + 15, cy - 70]], np.int32)
                cv2.fillPoly(annotated, [pts], (0, 255, 255))
                cv2.polylines(annotated, [pts], True, (0, 0, 0), 1)

        # Draw ball path
        cleaned_positions = clean_ball_path(ball_positions)
        smoothed_positions = smooth_positions(cleaned_positions) if len(cleaned_positions) >= smoothing_window else cleaned_positions
        for i in range(1, len(smoothed_positions)):
            alpha = 0.3 + 0.7 * (i / len(smoothed_positions))
            color = (0, int(255 * alpha), int(255 * alpha))
            thickness = max(1, int(3 * alpha))
            cv2.line(annotated, smoothed_positions[i-1], smoothed_positions[i], color, thickness)

        # Calculate and display ball speed
        speed_kmph = 0
        if len(smoothed_positions) >= 2:
            dx = smoothed_positions[-1][0] - smoothed_positions[-2][0]
            dy = smoothed_positions[-1][1] - smoothed_positions[-2][1]
            distance_pixels = np.sqrt(dx ** 2 + dy ** 2)
            distance_meters = distance_pixels / pixels_per_meter
            speed_mps = distance_meters / time_per_frame
            speed_kmph = min(speed_mps * 3.6, 50.0)
            cv2.putText(annotated, f"Ball Speed: {speed_kmph:.1f} km/h", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

        # Draw possession bar
        total_possession = sum(summary_data["team_stats"][team]["possession"] for team in ["Team A", "Team B"])
        if total_possession > 0:
            for team in ["Team A", "Team B"]:
                possession_count = summary_data["team_stats"][team]["possession"]
                summary_data["team_stats"][team]["possession_percentage"] = round(100 * possession_count / total_possession, 1)
        annotated = draw_possession_bar(annotated, summary_data["team_stats"], team_colors)

        # Apply goal overlay if active
        if display_goal_overlay:
            annotated = draw_goal_overlay(annotated, canvas_width, canvas_height, frame_counter=goal_frame_counter, total_duration=goal_overlay_duration)
        
        # Annotate projection frame
        projection_frame_copy = projection_frame.copy()
        projection_frame_copy = projection_annotator.annotate(projection_frame_copy, all_tracks[frame_idx]['object'])

        # Add projection frame to canvas
        h_frame, w_frame, _ = annotated.shape
        h_proj, w_proj, _ = projection_frame.shape
        scale_proj = 0.8
        new_w_proj = int(w_proj * scale_proj)
        new_h_proj = int(h_proj * scale_proj)
        projection_resized = cv2.resize(projection_frame_copy, (new_w_proj, new_h_proj))
        combined_frame = np.zeros((canvas_height, canvas_width, 3), dtype=np.uint8)
        combined_frame[:h_frame, :w_frame] = annotated
        x_offset = (canvas_width - new_w_proj) // 2
        y_offset = canvas_height - new_h_proj - 25
        alpha = 0.75
        overlay = combined_frame[y_offset:y_offset + new_h_proj, x_offset:x_offset + new_w_proj]
        cv2.addWeighted(projection_resized, alpha, overlay, 1 - alpha, 0, overlay)

        # Write output video
        out_video.write(combined_frame)

        # Clean up
        del frame, frame_for_player_detection, frame_for_keypoint_detection, annotated, combined_frame, projection_frame_copy
        gc.collect()
        frame_idx += 1

    cap.release()
    out_video.release()
    print(f"✅ Processed {frame_idx} frames and saved video at '{output_video_path}'")

    # Final possession percentages
    total_possession = sum(summary_data["team_stats"][team]["possession"] for team in ["Team A", "Team B"])
    if total_possession > 0:
        for team in ["Team A", "Team B"]:
            possession_count = summary_data["team_stats"][team]["possession"]
            summary_data["team_stats"][team]["possession_percentage"] = round(100 * possession_count / total_possession, 1)

    # Player ranking statistics
    player_stats = summary_data["player_stats"]
    if player_stats:
        player_stats_filtered = {pid: stat for pid, stat in player_stats.items() if stat["team"] != "Referee"}
        top_distance = sorted(player_stats_filtered.items(), key=lambda x: x[1]["total_distance_m"], reverse=True)[:5]
        top_speed = sorted(player_stats_filtered.items(), key=lambda x: x[1]["max_speed_kmph"], reverse=True)[:5]
        top_avg_speed = sorted(player_stats_filtered.items(), key=lambda x: x[1]["avg_speed_kmph"], reverse=True)[:5]
        
        # Add shots to rankings
        top_shooters = []
        for player_id, _ in player_stats_filtered.items():
            player_shots = [shot for shot in summary_data["shots"] if str(shot["player_id"]) == player_id]
            if player_shots:
                team = player_stats_filtered[player_id]["team"]
                shots_count = len(player_shots)
                on_target = len([shot for shot in player_shots if shot.get("on_target", False)])
                top_shooters.append((player_id, shots_count, on_target, team))
        
        top_shooters.sort(key=lambda x: x[1], reverse=True)
        top_shooters = top_shooters[:5]
        
        summary_data["rankings"] = {
            "distance": [{"player_id": int(pid), "distance_m": stat["total_distance_m"], "team": stat["team"]} for pid, stat in top_distance],
            "max_speed": [{"player_id": int(pid), "speed_kmph": stat["max_speed_kmph"], "team": stat["team"]} for pid, stat in top_speed],
            "avg_speed": [{"player_id": int(pid), "speed_kmph": stat["avg_speed_kmph"], "team": stat["team"]} for pid, stat in top_avg_speed],
            "top_shooters": [{"player_id": int(pid), "shots": shots, "on_target": on_target, "team": team} for pid, shots, on_target, team in top_shooters]
        }

    # Save match summary and tracks
    json_writer.write_summary(summary_data)
    print(f"📄 Match summary saved to '{summary_json_path}'")
    print(f"📄 Object tracks saved to '{object_tracks_path}'")
    print(f"📄 Keypoint tracks saved to '{keypoint_tracks_path}'")
    print(f"📸 Team sample crops saved to '{team_samples_dir}'")
    print(f"📸 Event frames saved to '{events_dir}'")
    
    return True