import cv2
import numpy as np
from typing import Dict, Tuple, List
from utils import is_color_dark, get_bbox_center, get_bbox_width

def draw_player_stats(
    frame: np.ndarray,
    xyxy: np.ndarray,
    color: Tuple[int, int, int],
    tracker_id: int,
    speed: float,
    distance: float,
    obj_cls: str,
    team_id: int
) -> np.ndarray:
    """
    Draw player statistics and ellipse annotations on the frame.

    Args:
        frame (np.ndarray): Input frame.
        xyxy (np.ndarray): Bounding box coordinates [x1, y1, x2, y2].
        color (Tuple[int, int, int]): Color for the annotation.
        tracker_id (int): Tracker ID for the object.
        speed (float): Current speed in km/h.
        distance (float): Total distance in meters.
        obj_cls (str): Object class ('player', 'goalkeeper', 'referee').
        team_id (int): Team ID (0, 1, or 2 for referee).

    Returns:
        np.ndarray: Annotated frame.
    """
    try:
        color2 = (255, 255, 255) if is_color_dark(color) else (0, 0, 0)
        y = int(xyxy[3])
        x, _ = get_bbox_center(xyxy)
        x = int(x)
        w = int(get_bbox_width(xyxy))

        # Draw ellipses based on object class
        if obj_cls == 'referee':
            dash_length = 15
            total_angle = 270
            for angle in range(-30, total_angle, dash_length * 2):
                cv2.ellipse(frame, center=(x, y), axes=(w, 20), angle=0,
                            startAngle=angle, endAngle=angle + dash_length, color=(0, 0, 0), thickness=2, lineType=cv2.LINE_AA)
        elif obj_cls == 'goalkeeper':
            # Draw double ellipse for goalkeepers
            size_decrement = 5
            for i in range(2):
                cv2.ellipse(frame, center=(x, y), axes=(w - i * size_decrement, 20 - i * size_decrement),
                            angle=0, startAngle=-30, endAngle=240, color=color, thickness=2, lineType=cv2.LINE_AA)
        else:  # player
            # Single ellipse for regular players
            cv2.ellipse(frame, center=(x, y), axes=(w, 20), angle=0, startAngle=-30, endAngle=240, color=color,
                        thickness=2, lineType=cv2.LINE_AA)

        # Draw tracker ID
        y = int(xyxy[3]) + 10
        h, w_text = 10, 20
        cv2.rectangle(frame, (x - w_text, y - h), (x + w_text, y + h), color, cv2.FILLED)

        x1 = x - len(str(tracker_id)) * 3
        cv2.putText(frame, text=f"{tracker_id}", org=(x1, y + h // 2), fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=0.8,
                    color=color2, thickness=1)

        # Draw speed and distance stats for players and goalkeepers
        if obj_cls in ['player', 'goalkeeper'] and speed >= 0:
            speed_str = f"{speed:.2f} km/h"
            x2 = x - len(speed_str) * 3
            cv2.putText(frame, text=speed_str, org=(x2, y + 20), fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=0.8,
                        color=color2, thickness=1)

            if distance is not None:
                distance_str = f"{distance:.2f} m"
                x3 = x - len(distance_str) * 3
                cv2.putText(frame, text=distance_str, org=(x3, y + 40), fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=0.8,
                            color=color2, thickness=1)

        return frame
    except Exception as e:
        print(f"Error in draw_player_stats: {e}")
        return frame

def draw_possession_bar(
    frame: np.ndarray,
    team_stats: Dict,
    team_colors: List[Tuple[int, int, int]]
) -> np.ndarray:
    """
    Draw a possession bar showing team possession percentages with a transparent overlay.

    Args:
        frame (np.ndarray): Input frame.
        team_stats (Dict): Team statistics with possession percentages.
        team_colors (List[Tuple[int, int, int]]): Colors for Team A and Team B.

    Returns:
        np.ndarray: Frame with possession bar.
    """
    try:
        # Create overlay for transparency
        overlay = frame.copy()

        # Position and size for possession overlay
        overlay_width = 500
        overlay_height = 100
        gap_x = 20
        gap_y = 20

        # Draw background with transparency
        cv2.rectangle(overlay, (gap_x, gap_y), (gap_x + overlay_width, gap_y + overlay_height), (0, 0, 0), -1)
        alpha = 0.4
        frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)

        # Position for text
        text_x = gap_x + 15
        text_y = gap_y + 30

        # Display "Possession" label
        cv2.putText(frame, 'Possession:', (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)

        # Position for possession bar
        bar_x = text_x
        bar_y = text_y + 25
        bar_width = overlay_width - 30
        bar_height = 15

        # Draw background for the possession bar
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (100, 100, 100), -1)

        # Get possession percentages
        team_a_pct = team_stats["Team A"]["possession_percentage"]
        team_b_pct = team_stats["Team B"]["possession_percentage"]

        # Draw Team A possession
        team_a_width = int(bar_width * (team_a_pct / 100))
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + team_a_width, bar_y + bar_height), team_colors[0], -1)

        # Draw Team B possession
        team_b_width = int(bar_width * (team_b_pct / 100))
        cv2.rectangle(frame, (bar_x + team_a_width, bar_y), (bar_x + team_a_width + team_b_width, bar_y + bar_height), team_colors[1], -1)

        # Draw possession percentage labels
        team_a_text_x = bar_x + team_a_width // 2 - 10
        team_a_text_y = bar_y + bar_height + 15
        
        team_b_text_x = bar_x + team_a_width + team_b_width // 2 - 10
        team_b_text_y = bar_y + bar_height + 15
        
        cv2.putText(frame, f"Team A: {team_a_pct}%", (text_x, bar_y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"Team B: {team_b_pct}%", (text_x + bar_width - 120, bar_y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Draw the outline of the possession bar
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (0, 0, 0), 2)
        
        return frame
    except Exception as e:
        print(f"Error in draw_possession_bar: {e}")
        return frame
    
def draw_goal_overlay(
    frame: np.ndarray,
    canvas_width: int,
    canvas_height: int,
    frame_counter: int = 0,
    total_duration: int = 30
) -> np.ndarray:
    """
    Draw a 'Goal!' overlay with a black shadow background and a fade-in/fade-out effect for the text.

    Args:
        frame (np.ndarray): Input frame.
        canvas_width (int): Width of the canvas.
        canvas_height (int): Height of the canvas.
        frame_counter (int): Current frame number in the overlay sequence (default: 0).
        total_duration (int): Total duration of the overlay in frames (default: 30).

    Returns:
        np.ndarray: Frame with goal overlay.
    """
    try:
        # Create a copy of the frame to work on
        overlay = frame.copy()

        # Calculate alpha for the black shadow overlay (constant opacity)
        shadow_alpha = 0.5
        cv2.rectangle(overlay, (0, 0), (canvas_width, canvas_height), (0, 0, 0), -1)
        frame = cv2.addWeighted(overlay, shadow_alpha, frame, 1 - shadow_alpha, 0)

        # Calculate text opacity for fade-in/fade-out effect
        fade_duration = total_duration // 2  # Half for fade-in, half for fade-out
        if frame_counter < fade_duration:
            # Fade-in
            text_alpha = frame_counter / fade_duration
        else:
            # Fade-out
            text_alpha = (total_duration - frame_counter) / fade_duration

        # Ensure text_alpha stays between 0 and 1
        text_alpha = max(0, min(1, text_alpha))
        print(f"Frame {frame_counter}: text_alpha = {text_alpha}")  # Debug log

        # Create a separate overlay for the text to apply alpha blending
        text_overlay = frame.copy()
        text = "Goal!"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 2
        thickness = 5
        text_color = (255, 255, 255)  # Green text
        text_size, _ = cv2.getTextSize(text, font, font_scale, thickness)
        text_x = (canvas_width - text_size[0]) // 2
        text_y = (canvas_height + text_size[1]) // 2
        print(f"Text position: x={text_x}, y={text_y}, size={text_size}")  # Debug log

        # Draw the text on the text_overlay
        cv2.putText(
            text_overlay,
            text,
            (text_x, text_y),
            font,
            font_scale,
            text_color,
            thickness,
            cv2.LINE_AA
        )

        # Blend the text overlay with the frame using the calculated text_alpha
        frame = cv2.addWeighted(text_overlay, text_alpha, frame, 1 - text_alpha, 0)

        return frame
    except Exception as e:
        print(f"Error in draw_goal_overlay: {e}")
        return frame