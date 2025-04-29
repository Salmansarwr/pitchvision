// src/pages/Dashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import axios from 'axios';

function Dashboard() {
  // Video processing states
  const [file, setFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'processing', 'completed', 'failed'
  const [results, setResults] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'heatmap', 'passes', 'paths'
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Check status periodically when videoId exists and status is processing
  useEffect(() => {
    let interval;
    if (videoId && (status === 'processing' || status === 'uploading')) {
      interval = setInterval(() => checkStatus(videoId), 5000);
    }
    return () => clearInterval(interval);
  }, [videoId, status]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSelectedVideo(e.target.files[0]?.name || '');
    setShowDropdown(false); // Close dropdown after file selection
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setUploadProgress(0);

      // Create form data
      const formData = new FormData();
      formData.append('video_file', file);

      // Simulating upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Make direct axios call
      const response = await axios.post('http://127.0.0.1:8000/api/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setVideoId(response.data.id);
      setStatus(response.data.status);

      // Start checking status
      checkStatus(response.data.id);
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('failed');
    }
  };

  const checkStatus = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/videos/${id}/`);
      setStatus(response.data.status);

      if (response.data.status === 'completed') {
        setResults({
          outputVideo: response.data.output_video_url,
          summary: response.data.summary_json_url,
          objectTracks: response.data.object_tracks_json_url,
          keypointTracks: response.data.keypoint_tracks_json_url,
        });
        console.log('Output Video URL:', response.data.output_video_url); // Debug URL
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setStatus('failed');
    }
  };

  const renderUploadSection = () => (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
      <div className="flex items-center">
        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="ml-2 text-white font-bold">MATCH TRACKING</span>
      </div>
      <div className="mx-6 h-10 border-l border-gray-600"></div>

      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={selectedVideo}
            readOnly
            placeholder="Select a match video"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 focus:bg-gray-600"
                  onClick={triggerFileInput}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload New Match Video
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
      </div>

      <div className="ml-4">
        <button
          onClick={handleUpload}
          disabled={!file || status === 'uploading' || status === 'processing'}
          className={`px-4 py-2 rounded-full shadow-lg transition ${
            !file || status === 'uploading' || status === 'processing'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}
        >
          {status === 'uploading'
            ? 'Uploading...'
            : status === 'processing'
            ? 'Processing...'
            : 'Process Match'}
        </button>
      </div>
    </div>
  );

  const renderProcessingStatus = () => {
    if (status === 'idle' || status === 'completed') return null;

    let statusMessage = '';
    let progressValue = 0;

    if (status === 'uploading') {
      statusMessage = 'Uploading video file...';
      progressValue = uploadProgress;
    } else if (status === 'processing') {
      statusMessage = 'Processing video with AI analysis...';
      progressValue = uploadProgress === 100 ? Math.random() * 30 + 30 : uploadProgress;
    } else if (status === 'failed') {
      statusMessage = 'Processing failed. Please try again.';
      progressValue = 100;
    }

    return (
      <div className="mt-4 bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">{statusMessage}</span>
          <span className="text-white font-semibold">{Math.round(progressValue)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${status === 'failed' ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>

        {status === 'failed' && (
          <button
            onClick={() => setStatus('idle')}
            className="mt-3 px-4 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
          >
            Try Again
          </button>
        )}
      </div>
    );
  };

  // Sample player data for the visualization
  const renderPlayers = () => {
    const players = [
      { id: 10, x: '50%', y: '75%', team: 'a' },
      { id: 7, x: '30%', y: '60%', team: 'a' },
      { id: 9, x: '60%', y: '85%', team: 'a' },
      { id: 5, x: '20%', y: '50%', team: 'a' },
      { id: 3, x: '35%', y: '25%', team: 'a' },
      { id: 11, x: '65%', y: '25%', team: 'b' },
      { id: 8, x: '75%', y: '50%', team: 'b' },
      { id: 6, x: '60%', y: '40%', team: 'b' },
      { id: 4, x: '80%', y: '75%', team: 'b' },
      { id: 2, x: '70%', y: '25%', team: 'b' },
    ];

    return players.map((player) => (
      <div
        key={`${player.team}-${player.id}`}
        className={`absolute h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 ${
          player.team === 'a' ? 'bg-blue-600' : 'bg-pink-600'
        }`}
        style={{ left: player.x, top: player.y }}
      >
        {player.id}
      </div>
    ));
  };

  const renderBall = () => (
    <div
      className="absolute h-4 w-4 bg-yellow-400 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: '55%', top: '60%' }}
    ></div>
  );

  const renderPitchView = () => {
    if (activeTab === 'live') {
      return (
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden mx-auto">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 left-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 right-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>

          {/* Players and ball */}
          {renderPlayers()}
          {renderBall()}
        </div>
      );
    } else if (activeTab === 'heatmap') {
      return (
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden mx-auto">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>

          {/* Heatmap simulation */}
          <div className="absolute top-1/3 left-1/2 h-32 w-32 bg-red-500 rounded-full opacity-20 blur-lg transform -translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute top-2/5 left-3/5 h-40 w-40 bg-red-500 rounded-full opacity-30 blur-lg transform -translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute top-1/2 left-2/3 h-44 w-44 bg-red-500 rounded-full opacity-40 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-3/5 left-3/4 h-36 w-36 bg-red-500 rounded-full opacity-25 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      );
    } else if (activeTab === 'passes') {
      return (
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden mx-auto">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>

          {/* Passing network simulation */}
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="30%"
              y1="60%"
              x2="60%"
              y2="85%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="60%"
              y1="85%"
              x2="40%"
              y2="70%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="30%"
              y1="60%"
              x2="50%"
              y2="75%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="75%"
              y1="50%"
              x2="65%"
              y2="25%"
              stroke="#ec4899"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="80%"
              y1="75%"
              x2="75%"
              y2="50%"
              stroke="#ec4899"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          {renderPlayers()}
        </div>
      );
    } else {
      return (
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden mx-auto">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>

          {/* Player paths simulation */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 30% 60% C 40% 65%, 45% 70%, 50% 75%"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 75% 50% C 72% 55%, 70% 60%, 65% 65%"
              stroke="#ec4899"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {renderPlayers()}
        </div>
      );
    }
  };

  const renderTrackingView = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col mt-4">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex justify-between items-center">
        <h2 className="text-gray-400 font-semibold">
          {status === 'completed' ? 'MATCH ANALYSIS' : 'LIVE TRACKING VIEW'}
        </h2>
        <div className="flex space-x-2">
          <button className="p-1 bg-gray-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="p-1 bg-gray-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-center overflow-auto custom-scrollbar">
        {status === 'completed' && results?.outputVideo ? (
          <div className="relative w-full rounded-lg">
            <video
              src={results.outputVideo}
              controls
              className="w-full rounded-lg"
              autoPlay
              onError={(e) => {
                console.error('Video playback error:', e);
                alert('Failed to load the output video. Please check the URL or try again.');
              }}
            />
            <div className="absolute inset-0 items-center justify-center bg-gray-800 bg-opacity-50 text-white text-sm hidden">
              Video not available
            </div>
          </div>
        ) : (
          renderPitchView()
        )}
      </div>

      {status !== 'completed' && (
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex overflow-x-auto custom-scrollbar">
            <button
              className={`px-3 py-1 ${
                activeTab === 'live' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300'
              } rounded-md text-sm mr-2 whitespace-nowrap`}
              onClick={() => setActiveTab('live')}
            >
              Live View
            </button>
            <button
              className={`px-3 py-1 ${
                activeTab === 'heatmap' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300'
              } rounded-md text-sm mr-2 whitespace-nowrap`}
              onClick={() => setActiveTab('heatmap')}
            >
              Heatmap
            </button>
            <button
              className={`px-3 py-1 ${
                activeTab === 'passes' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300'
              } rounded-md text-sm mr-2 whitespace-nowrap`}
              onClick={() => setActiveTab('passes')}
            >
              Passing Network
            </button>
            <button
              className={`px-3 py-1 ${
                activeTab === 'paths' ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300'
              } rounded-md text-sm mr-2 whitespace-nowrap`}
              onClick={() => setActiveTab('paths')}
            >
              Player Paths
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Dashboard metrics (Total Distance, Top Speed, Passes, Possession)
  const renderDashboardMetrics = () => {
    if (status !== 'completed' || !results) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Total Distance</div>
            <div className="text-white text-2xl font-bold">112.4 km</div>
          </div>
          <div className="h-12 w-12 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Top Speed</div>
            <div className="text-white text-2xl font-bold">34.8 km/h</div>
          </div>
          <div className="h-12 w-12 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Passes</div>
            <div className="text-white text-2xl font-bold">542</div>
          </div>
          <div className="h-12 w-12 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Possession</div>
            <div className="text-white text-2xl font-bold">63%</div>
          </div>
          <div className="h-12 w-12 bg-yellow-500 bg-opacity-30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Results and downloadable reports section
  const renderResultsSection = () => {
    if (status !== 'completed' || !results) return null;

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-gray-400 font-semibold mb-3">MATCH REPORTS</h3>
          <div className="space-y-3">
            <a
              href={results.summary}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-white">Match Summary Report</span>
            </a>

            <a
              href={results.objectTracks}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <span className="text-white">Object Tracking Data</span>
            </a>

            <a
              href={results.keypointTracks}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <span className="text-white">Keypoint Data</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-gray-400 font-semibold mb-3">MATCH EVENTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 <%= locals.user ? 'gap-4' : '' %>">
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-white font-medium">Team A Goals: 2</span>
              </div>
              <div className="text-sm text-gray-400">5' - Player #10 • 62' - Player #9</div>
            </div>

            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
                <span className="text-white font-medium">Team B Goals: 1</span>
              </div>
              <div className="text-sm text-gray-400">18' - Player #11</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Dashboard">
      {renderDashboardMetrics()}

      {/* Video Processing Section */}
      <div className="mt-4">
        {renderUploadSection()}
        {renderProcessingStatus()}
        {renderTrackingView()}
        {renderResultsSection()}
      </div>
    </Layout>
  );
}

export default Dashboard;