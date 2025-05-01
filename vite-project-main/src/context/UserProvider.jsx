import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [videoData, setVideoData] = useState(() => {
    const savedVideoData = localStorage.getItem('videoData');
    return savedVideoData ? JSON.parse(savedVideoData) : null;
  });
  const [videoId, setVideoId] = useState(() => {
    const savedVideoId = localStorage.getItem('videoId');
    return savedVideoId ? JSON.parse(savedVideoId) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/auth/user/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser({
            name: response.data.name || 'User',
            email: response.data.email,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save videoData to localStorage
  useEffect(() => {
    if (videoData) {
      localStorage.setItem('videoData', JSON.stringify(videoData));
    } else {
      localStorage.removeItem('videoData');
    }
  }, [videoData]);

  // Save videoId to localStorage
  useEffect(() => {
    if (videoId) {
      localStorage.setItem('videoId', JSON.stringify(videoId));
    } else {
      localStorage.removeItem('videoId');
    }
  }, [videoId]);

  // Fetch video details when videoId changes
  useEffect(() => {
    if (videoId) {
      const fetchVideoDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://127.0.0.1:8000/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setVideoData(response.data);
          } else {
            console.error('Failed to fetch video details:', response.data);
          }
        } catch (error) {
          console.error('Error fetching video details:', error);
        }
      };
      fetchVideoDetails();
    }
  }, [videoId]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setVideoData(null);
    setVideoId(null);
    localStorage.removeItem('token');
  };

  const updateVideoData = (data) => {
    setVideoData(data);
  };

  const updateVideoId = (id) => {
    setVideoId(id);
  };

  return (
    <UserContext.Provider
      value={{ user, videoData, videoId, login, logout, updateVideoData, updateVideoId, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};