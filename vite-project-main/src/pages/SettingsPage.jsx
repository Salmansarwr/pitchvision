import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import Layout from '../components/shared/Layout';

// Custom Alert Popup Component
function AlertPopup({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div
          className={`px-4 py-2 rounded-t-lg ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <h3 className="text-lg font-semibold text-white">
            {type === 'success' ? 'Success' : 'Error'}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-white text-sm">{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { user, profile, setUser, setProfile } = useContext(UserContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phoneNumber: profile?.phone_number || '',
    experienceLevel: profile?.experience_level || 'Beginner',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    return /^[\d\s+-]{7,15}$/.test(phone);
  };

  const handleUpdateProfile = async () => {
    // Client-side validation
    if (!formData.firstName.trim()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'First name is required',
      });
      return;
    }
    if (!formData.lastName.trim()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Last name is required',
      });
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Phone number is required',
      });
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Phone number must be 7-15 characters and contain only digits, spaces, +, or -',
      });
      return;
    }
    if (!formData.experienceLevel || !['Beginner', 'Enthusiast', 'Pro'].includes(formData.experienceLevel)) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please select a valid experience level',
      });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone_number: formData.phoneNumber.trim(),
          experience_level: formData.experienceLevel,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setUser({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          last_login: data.user.last_login,
        });
        setProfile({
          phone_number: data.user.phone_number,
          experience_level: data.user.experience_level,
          created_at: data.user.created_at,
        });
        setAlert({
          show: true,
          type: 'success',
          message: 'Profile updated successfully!',
        });
        setIsPopupOpen(false);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: `Failed to update profile: ${data.message || 'Unknown error'}`,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'An error occurred while updating profile: Network or server issue',
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout title={`Welcome, ${`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'User'}!`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-gray-400 font-semibold">PROFILE SETTINGS</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Full Name
                </label>
                <p className="px-3 py-2 bg-gray-700 text-white rounded-md">
                  {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Email
                </label>
                <p className="px-3 py-2 bg-gray-600 text-gray-400 rounded-md">
                  {user?.email || 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <p className="px-3 py-2 bg-gray-700 text-white rounded-md">
                  {profile?.phone_number || 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Experience Level
                </label>
                <p className="px-3 py-2 bg-gray-700 text-white rounded-md">
                  {profile?.experience_level || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-gray-400 font-semibold">ACCOUNT STATISTICS</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Account Created
                </label>
                <p className="px-3 py-2 bg-gray-700 text-white rounded-md">
                  {formatDate(profile?.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Last Login
                </label>
                <p className="px-3 py-2 bg-gray-700 text-white rounded-md">
                  {formatDate(user?.last_login)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-cyan-700 transition flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Update Profile
        </button>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Update Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="" disabled>Select Experience Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Enthusiast">Enthusiast</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-md hover:from-indigo-700 hover:to-cyan-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      {alert.show && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}
    </Layout>
  );
}

export default SettingsPage;