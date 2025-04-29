// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import Layout from '../components/shared/Layout';

function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    organization: 'Manchester United',
    position: 'Coach'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    matchReminders: true,
    analysisReports: true,
    teamUpdates: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
    // Add logic to save settings to the backend or state management
  };

  return (
    <Layout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-gray-400 font-semibold">PROFILE SETTINGS</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
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
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={profile.organization}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={profile.position}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Notification Settings */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-gray-400 font-semibold">NOTIFICATION SETTINGS</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="emailNotifications" className="text-gray-300 text-sm flex-grow">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    name="pushNotifications"
                    checked={notifications.pushNotifications}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="pushNotifications" className="text-gray-300 text-sm flex-grow">
                    Push Notifications
                  </label>
                </div>
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    name="smsNotifications"
                    checked={notifications.smsNotifications}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="smsNotifications" className="text-gray-300 text-sm flex-grow">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="matchReminders"
                    name="matchReminders"
                    checked={notifications.matchReminders}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="matchReminders" className="text-gray-300 text-sm flex-grow">
                    Match Reminders
                  </label>
                </div>
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="analysisReports"
                    name="analysisReports"
                    checked={notifications.analysisReports}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="analysisReports" className="text-gray-300 text-sm flex-grow">
                    Analysis Reports
                  </label>
                </div>
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="teamUpdates"
                    name="teamUpdates"
                    checked={notifications.teamUpdates}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  <label htmlFor="teamUpdates" className="text-gray-300 text-sm flex-grow">
                    Team Updates
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-gray-400 font-semibold">SECURITY SETTINGS</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={security.twoFactorAuth}
                    onChange={handleSecurityChange}
                    className="mr-2"
                  />
                  <label htmlFor="twoFactorAuth" className="text-gray-300 text-sm flex-grow">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    name="sessionTimeout"
                    value={security.sessionTimeout}
                    onChange={handleSecurityChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <button
                    className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition"
                  >
                    Change Password
                  </button>
                </div>
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
    </Layout>
  );
}

export default SettingsPage;