import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
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
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            last_login: response.data.last_login,
          });
          setProfile({
            phone_number: response.data.phone_number,
            experience_level: response.data.experience_level,
            created_at: response.data.created_at,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
          setUser(null);
          setProfile(null);
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

  // Save profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('profile');
    }
  }, [profile]);

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
      console.log('Saved videoId to localStorage:', videoId);
    } else {
      localStorage.removeItem('videoId');
      console.log('Removed videoId from localStorage');
    }
  }, [videoId]);

  // Fetch video details when videoId changes
  useEffect(() => {
    if (videoId) {
      const fetchVideoDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          console.log(`Fetching video details for videoId: ${videoId}`);
          const response = await axios.get(`http://127.0.0.1:8000/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            console.log('Video details fetched:', response.data);
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
    setUser({
      first_name: userData.name.split(' ')[0] || '',
      last_name: userData.name.split(' ').slice(1).join(' ') || '',
      email: userData.email,
      last_login: null, // Will be updated on next user fetch
    });
    // Fetch profile data after login
    axios
      .get('http://127.0.0.1:8000/api/auth/user/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile({
          phone_number: response.data.phone_number,
          experience_level: response.data.experience_level,
          created_at: response.data.created_at,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch profile data:', error);
      });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setVideoData(null);
    setVideoId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('videoId');
    console.log('Logged out, cleared videoId');
  };

  const updateVideoData = (data) => {
    setVideoData(data);
    console.log('Updated videoData:', data);
  };

  // In UserProvider.jsx, modify the updateVideoId function:
const updateVideoId = async (id, validateStatus = true) => {
  console.log(`updateVideoId called with id: ${id}, validateStatus: ${validateStatus}`);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot validate video ID');
      return;
    }
    
    if (validateStatus) {
      // Validate the video ID by checking its status
      const response = await axios.get(`http://127.0.0.1:8000/api/videos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Video validation response:', response.data);
      if (response.data.status === 'completed') {
        setVideoId(id);
        console.log(`Video ID updated to ${id} (status: completed)`);
      } else {
        console.warn(`Video ID ${id} is not completed (status: ${response.data.status}), not updating`);
      }
    } else {
      // Set videoId without validation
      setVideoId(id);
      console.log(`Video ID updated to ${id} without validation`);
    }
  } catch (error) {
    console.error(`Failed to validate video ID ${id}:`, error);
  }
};

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        videoData,
        videoId,
        login,
        logout,
        updateVideoData,
        updateVideoId,
        loading,
        setUser,
        setProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};