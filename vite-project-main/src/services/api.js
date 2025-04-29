import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Django backend URL
  headers: {
    'Content-Type': 'multipart/form-data', // For file uploads
  },
});

export const uploadVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append('video_file', videoFile);
  return api.post('/videos/', formData);
};

export const getVideoStatus = async (videoId) => {
  return api.get(`/videos/${videoId}/`);
};

export const getAllVideos = async () => {
  return api.get('/videos/');
};