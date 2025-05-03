import os
import json
import numpy as np
from typing import Any, List
from abc import ABC, abstractmethod

class AbstractWriter(ABC):
    """Abstract base class for writers."""
    @abstractmethod
    def write(self, filename: str, data: Any) -> None:
        pass

class JsonWriter(AbstractWriter):
    """
    A class to handle writing tracking data and match summaries to JSON files.

    This class manages writing object tracks, keypoint tracks, and match summary data to
    separate JSON files, ensuring all data is serialized properly.
    """

    def __init__(
        self,
        save_dir: str = 'output/tracks',
        summary_dir: str = 'output',
        object_fname: str = 'object_tracks',
        keypoints_fname: str = 'keypoint_tracks',
        summary_fname: str = 'match_summary'
    ) -> None:
        """
        Initializes the JsonWriter.

        Args:
            save_dir (str): Directory to save track JSON files.
            summary_dir (str): Directory to save the match summary JSON file.
            object_fname (str): Filename for object tracks (without extension).
            keypoints_fname (str): Filename for keypoint tracks (without extension).
            summary_fname (str): Filename for match summary (without extension).
        """
        super().__init__()
        self.save_dir = save_dir
        self.summary_dir = summary_dir
        self.obj_path = os.path.join(self.save_dir, f'{object_fname}.json')
        self.kp_path = os.path.join(self.save_dir, f'{keypoints_fname}.json')
        self.summary_path = os.path.join(self.summary_dir, f'{summary_fname}.json')

        # Ensure directories exist and remove existing files
        self._initialize_directories()

    def _initialize_directories(self) -> None:
        """
        Initialize directories and remove existing JSON files if they exist.
        """
        # Create directories if they don't exist
        for directory in [self.save_dir, self.summary_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"Created directory: {directory}")

        # Remove existing JSON files
        self._remove_existing_files(files=[self.obj_path, self.kp_path, self.summary_path])

    def _remove_existing_files(self, files: List[str]) -> None:
        """
        Remove files from the filesystem if they exist.

        Args:
            files (List[str]): List of file paths to check and remove.
        """
        for file_path in files:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"Removed file: {file_path}")
                except Exception as e:
                    print(f"Error removing {file_path}: {e}")

    def write_object_tracks(self, tracks: Any) -> None:
        """
        Write object tracks to the object tracks JSON file.

        Args:
            tracks (Any): The object tracking data to write.
        """
        self.write(self.obj_path, tracks)

    def write_keypoint_tracks(self, tracks: Any) -> None:
        """
        Write keypoint tracks to the keypoint tracks JSON file.

        Args:
            tracks (Any): The keypoint tracking data to write.
        """
        self.write(self.kp_path, tracks)

    def write_summary(self, summary: Any) -> None:
        """
        Write match summary to the summary JSON file.

        Args:
            summary (Any): The match summary data to write.
        """
        self.write(self.summary_path, summary)
            

    def write(self, filename: str, data: Any) -> None:
        """
        Write data to a JSON file.

        If the file already exists, new data is appended for tracks; for summaries, it overwrites.

        Args:
            filename (str): The name of the file to save data.
            data (Any): The data to write to the file.
        """
        try:
            # Convert data to a serializable format
            serializable_data = self._make_serializable(data)

            if filename in [self.obj_path, self.kp_path] and os.path.exists(filename):
                # Append for track files
                with open(filename, 'r') as f:
                    existing_data = json.load(f)
                existing_data.append(serializable_data)
                data_to_save = existing_data
            else:
                # Overwrite for summary or create new for tracks
                data_to_save = [serializable_data] if filename in [self.obj_path, self.kp_path] else serializable_data

            # Write the serializable data to the file
            with open(filename, 'w') as f:
                json.dump(data_to_save, f, indent=4)
                print(f"Wrote data to {filename}")
        except Exception as e:
            print(f"Error writing to {filename}: {e}")

    def _make_serializable(self, obj: Any) -> Any:
        """
        Recursively convert objects to a JSON-serializable format.

        Args:
            obj (Any): The object to convert.

        Returns:
            Any: A JSON-serializable representation of the object.
        """
        try:
            if isinstance(obj, dict):
                return {str(k): self._make_serializable(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [self._make_serializable(v) for v in obj]
            elif isinstance(obj, tuple):
                return [self._make_serializable(v) for v in obj]  # Convert tuple to list
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, (np.integer, np.int32, np.int64)):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float32, np.float64)):
                return float(obj)
            elif isinstance(obj, (int, float, str, bool, type(None))):
                return obj
            else:
                # Convert unexpected types to string to avoid serialization errors
                return str(obj)
        except Exception as e:
            print(f"Error serializing object: {e}")
            return str(obj)

    def get_object_tracks_path(self) -> str:
        """Returns the path for the object tracks JSON file."""
        return self.obj_path

    def get_keypoints_tracks_path(self) -> str:
        """Returns the path for the keypoint tracks JSON file."""
        return self.kp_path

    def get_summary_path(self) -> str:
        """Returns the path for the match summary JSON file."""
        return self.summary_path