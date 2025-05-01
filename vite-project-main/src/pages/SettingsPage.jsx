import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Layout from '../components/shared/Layout';

function SettingsPage() {
  const { user, profile } = useContext(UserContext);

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phoneNumber: profile?.phone_number || '',
    experienceLevel: profile?.experience_level || '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored
        },
        body: JSON.stringify({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone_number: profileData.phoneNumber,
          experience_level: profileData.experienceLevel,
        }),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile.');
    }
  };

  // Format date for readability
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
    <Layout title="Settings">
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
                {`${profileData.firstName[0] || ''}${profileData.lastName[0] || ''}`}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
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
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={profileData.experienceLevel}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="">Select Experience Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Enthusiast">Enthusiast</option>
                  <option value="Pro">Pro</option>
                </select>
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
                <label classDEFS="block text-gray-400 text-sm font-medium mb-2">
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

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Changes
        </button>
      </div>
    </Layout>
  );
}

export default SettingsPage;