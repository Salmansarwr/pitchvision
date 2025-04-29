from abc import ABC, abstractmethod
from utils import is_color_dark, rgb_bgr_converter
import cv2
import numpy as np
from scipy.spatial import Voronoi
from typing import Dict, Any, List, Tuple

class AbstractAnnotator(ABC):
    """Abstract base class for annotators."""
    @abstractmethod
    def annotate(self, frame: np.ndarray, tracks: Dict) -> np.ndarray:
        pass

class ProjectionAnnotator(AbstractAnnotator):
    """
    Class to annotate projections on a projection image, including Voronoi regions for players (and goalkeepers), 
    and different markers for ball, players, referees, and goalkeepers.
    """
    def _draw_outline(self, frame: np.ndarray, pos: tuple, shape: str = 'circle', size: int = 10, is_dark: bool = True) -> None:
        """
        Draws a white or black outline around the object based on its color and shape.
        
        Parameters:
            frame (np.ndarray): The image on which to draw the outline.
            pos (tuple): The (x, y) position of the object.
            shape (str): The shape of the outline ('circle', 'square', 'dashed_circle', 'plus').
            size (int): The size of the outline.
            is_dark (bool): Flag indicating whether the color is dark (determines outline color).
        """
        outline_color = (255, 255, 255) if is_dark else (0, 0, 0)

        if shape == 'circle':
            cv2.circle(frame, (int(pos[0]), int(pos[1])), radius=size + 2, color=outline_color, thickness=2)
        elif shape == 'square':
            top_left = (int(pos[0]) - (size + 2), int(pos[1]) - (size + 2))
            bottom_right = (int(pos[0]) + (size + 2), int(pos[1]) + (size + 2))
            cv2.rectangle(frame, top_left, bottom_right, color=outline_color, thickness=2)
        elif shape == 'dashed_circle':
            dash_length, gap_length = 30, 30
            for i in range(0, 360, dash_length + gap_length):
                start_angle_rad, end_angle_rad = np.radians(i), np.radians(i + dash_length)
                start_x = int(pos[0]) + int((size + 2) * np.cos(start_angle_rad))
                start_y = int(pos[1]) + int((size + 2) * np.sin(start_angle_rad))
                end_x = int(pos[0]) + int((size + 2) * np.cos(end_angle_rad))
                end_y = int(pos[1]) + int((size + 2) * np.sin(end_angle_rad))
                cv2.line(frame, (start_x, start_y), (end_x, end_y), color=(0, 0, 0), thickness=2)
        elif shape == 'plus':
            cv2.line(frame, (int(pos[0]) - size, int(pos[1])), (int(pos[0]) + size, int(pos[1])), color=outline_color, thickness=10)
            cv2.line(frame, (int(pos[0]), int(pos[1]) - size), (int(pos[0]), int(pos[1]) + size), color=outline_color, thickness=10)

    def _draw_voronoi(self, image: np.ndarray, tracks: Dict) -> np.ndarray:
        """
        Draws Voronoi regions for players and goalkeepers on the frame using their club colors.
        
        Parameters:
            image (np.ndarray): The image on which to draw the Voronoi regions.
            tracks (Dict): A dictionary containing tracking information for 'player' and 'goalkeeper'.

        Returns:
            np.ndarray: The frame with Voronoi regions drawn.
        """
        try:
            height, width = image.shape[:2]
            overlay = image.copy()
            points, player_colors = [], []

            # Extract player and goalkeeper positions and their club colors
            for class_name in ['player', 'goalkeeper']:
                if class_name not in tracks or not isinstance(tracks[class_name], dict):
                    continue
                
                track_data = tracks[class_name]
                for track_id, track_info in track_data.items():
                    if not isinstance(track_info, dict) or 'projection' not in track_info:
                        continue
                        
                    x, y = track_info['projection'][:2]
                    points.append([x, y])
                    
                    # Use club color if available, otherwise default to white
                    color = track_info.get('club_color', (255, 255, 255))
                    player_colors.append(color)  # Already in BGR from rgb_bgr_converter in annotate

            # Skip if not enough points for Voronoi
            if len(points) < 2:
                print("Not enough points for Voronoi diagram")
                return image

            # Add boundary points to ensure Voronoi regions cover the entire image
            boundary_margin = 1000
            boundary_points = [
                [-boundary_margin, -boundary_margin], [width // 2, -boundary_margin],
                [width + boundary_margin, -boundary_margin], [-boundary_margin, height // 2],
                [width + boundary_margin, height // 2], [-boundary_margin, height + boundary_margin],
                [width // 2, height + boundary_margin], [width + boundary_margin, height + boundary_margin]
            ]
            boundary_color = (128, 128, 128)  # Gray for boundary regions
            points.extend(boundary_points)
            player_colors.extend([boundary_color] * len(boundary_points))

            # Generate Voronoi diagram
            points = np.array(points, dtype=np.float32)
            try:
                vor = Voronoi(points)
            except Exception as e:
                print(f"Error generating Voronoi diagram: {e}")
                return image

            # Draw each Voronoi region with the corresponding player's club color
            for point_idx, region_idx in enumerate(vor.point_region):
                region = vor.regions[region_idx]
                if -1 in region or len(region) == 0:
                    continue  # Skip invalid or unbounded regions

                # Get the polygon vertices for the region
                polygon = [vor.vertices[i] for i in region]
                polygon = np.array(polygon, np.int32).reshape((-1, 1, 2))

                # Use the player's club color (or boundary color for boundary points)
                color = player_colors[point_idx] if point_idx < len(player_colors) else boundary_color

                # Draw the filled polygon with the club color
                cv2.fillPoly(overlay, [polygon], color=color)
                # Draw the outline for clarity
                cv2.polylines(overlay, [polygon], isClosed=True, color=(0, 0, 0), thickness=1)

            # Blend the overlay with the original image
            alpha = 0.6
            cv2.addWeighted(overlay, alpha, image, 1 - alpha, 0, image)
            
            return image
            
        except Exception as e:
            print(f"Error in ProjectionAnnotator._draw_voronoi: {e}")
            return image

    def annotate(self, frame: np.ndarray, tracks: Dict) -> np.ndarray:
        """
        Annotates an image with projected player, goalkeeper, referee, and ball positions, along with Voronoi regions.
        
        Parameters:
            frame (np.ndarray): The image on which to draw the annotations.
            tracks (Dict): A dictionary containing tracking information for 'player', 'goalkeeper', 'referee', and 'ball'.

        Returns:
            np.ndarray: The annotated frame.
        """
        try:
            frame = frame.copy()
            
            # Validate input
            if not isinstance(tracks, dict):
                print("Error: tracks is not a dictionary")
                return frame
                
            # Apply Voronoi diagram
            frame = self._draw_voronoi(frame, tracks)

            # Process each class of object
            for class_name in ['player', 'goalkeeper', 'referee', 'ball']:
                if class_name not in tracks or not isinstance(tracks[class_name], dict):
                    continue
                    
                track_data = tracks[class_name]
                
                # Skip ball for now (we'll draw it later)
                if class_name == 'ball':
                    continue
                    
                for track_id, track_info in track_data.items():
                    # Validate track info
                    if not isinstance(track_info, dict):
                        continue
                        
                    # Check if projection exists
                    if 'projection' not in track_info:
                        continue
                        
                    proj_pos = track_info['projection']
                    
                    # Get club color or default
                    color = (255, 255, 255)  # Default white
                    if 'club_color' in track_info:
                        color = track_info['club_color']
                        
                    # Convert to BGR if needed
                    color = rgb_bgr_converter(color)
                    is_dark_color = is_color_dark(color)

                    # Draw different markers for players vs goalkeepers
                    if class_name in ['player', 'goalkeeper']:
                        shape = 'square' if class_name == 'goalkeeper' else 'circle'
                        self._draw_outline(frame, proj_pos, shape=shape, is_dark=is_dark_color)

                        # Highlight if player has the ball
                        if track_info.get('has_ball', False):
                            cv2.circle(frame, (int(proj_pos[0]), int(proj_pos[1])), radius=15, color=(0, 255, 0), thickness=2)
                            
                        # Draw the actual marker
                        if shape == 'circle':
                            cv2.circle(frame, (int(proj_pos[0]), int(proj_pos[1])), radius=10, color=color, thickness=-1)
                        else:
                            top_left = (int(proj_pos[0]) - 10, int(proj_pos[1]) - 10)
                            bottom_right = (int(proj_pos[0]) + 10, int(proj_pos[1]) + 10)
                            cv2.rectangle(frame, top_left, bottom_right, color=color, thickness=-1)

                    elif class_name == 'referee':
                        self._draw_outline(frame, proj_pos, shape='dashed_circle', is_dark=is_dark_color)

            # Draw the ball last (so it's on top)
            if 'ball' in tracks and isinstance(tracks['ball'], dict):
                for track_id, track_info in tracks['ball'].items():
                    if not isinstance(track_info, dict) or 'projection' not in track_info:
                        continue
                    
                    proj_pos = track_info['projection']
                    self._draw_outline(frame, proj_pos, shape='plus', is_dark=is_color_dark((0, 255, 255)))
                    color = (0, 255, 255)
                    cv2.line(frame, (int(proj_pos[0]) - 10, int(proj_pos[1])), (int(proj_pos[0]) + 10, int(proj_pos[1])), color=color, thickness=6)
                    cv2.line(frame, (int(proj_pos[0]), int(proj_pos[1]) - 10), (int(proj_pos[0]), int(proj_pos[1]) + 10), color=color, thickness=6)

            return frame
            
        except Exception as e:
            print(f"Error in ProjectionAnnotator.annotate: {e}")
            return frame