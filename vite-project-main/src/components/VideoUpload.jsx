import React, { useState } from 'react';
import { uploadVideo, getVideoStatus } from '../services/api';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const response = await uploadVideo(file);
      setVideoId(response.data.id);
      setStatus(response.data.status);
      checkStatus(response.data.id);
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('failed');
    }
  };

  const checkStatus = async (id) => {
    try {
      const response = await getVideoStatus(id);
      setStatus(response.data.status);
      if (response.data.status === 'completed') {
        setResults({
          outputVideo: response.data.output_video_url,
          summary: response.data.summary_json_url,
          objectTracks: response.data.object_tracks_json_url,
          keypointTracks: response.data.keypoint_tracks_json_url,
          allTracks: response.data.all_tracks_json_url,
        });
      } else if (response.data.status === 'processing' || response.data.status === 'pending') {
        setTimeout(() => checkStatus(id), 5000); // Poll every 5 seconds
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setStatus('failed');
    }
  };

  return (
    <div>
      <h2>Upload Video for Analysis</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload and Analyze
      </button>
      {status && <p>Status: {status}</p>}
      {videoId && <p>Video ID: {videoId}</p>} {/* Display videoId */}
      {results && (
        <div>
          <h3>Analysis Results</h3>
          <video src={results.outputVideo} controls width="600" />
          <p>
            <a href={results.summary} target="_blank" rel="noopener noreferrer">
              Match Summary
            </a>
          </p>
          <p>
            <a href={results.objectTracks} target="_blank" rel="noopener noreferrer">
              Object Tracks
            </a>
          </p>
          <p>
            <a href={results.keypointTracks} target="_blank" rel="noopener noreferrer">
              Keypoint Tracks
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;