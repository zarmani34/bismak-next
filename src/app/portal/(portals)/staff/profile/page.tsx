'use client';

import { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaBell,
  FaLock,
  FaShieldAlt
} from 'react-icons/fa';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  location: string;
  joinDate: string;
  bio: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Bayo',
    lastName: 'Ismail',
    email: 'bayo.ismail@example.com',
    phone: '+234 801 234 5678',
    company: 'NNPC Limited',
    role: 'Project Manager',
    location: 'Lagos, Nigeria',
    joinDate: 'January 2023',
    bio: 'Experienced project manager with over 10 years in the oil and gas industry, specializing in offshore operations and safety compliance.'
  });

  const [editedData, setEditedData] = useState<ProfileData>(profileData);

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    // Add your save logic here (API call)
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F6F5D9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            className="flex items-center gap-2 text-[#4a4a4a] hover:text-[#37574a] transition-colors mb-4"
            onClick={() => window.history.back()}
          >
            <span className="text-xl">←</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-[#333333]">Profile Settings</h1>
          <p className="text-[#8a8a8a] mt-1">Manage your account information and preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] mb-6">
          <div className="flex border-b border-[#e0ddc7]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'profile' 
                  ? 'text-[#37574a] border-b-2 border-[#37574a]' 
                  : 'text-[#8a8a8a] hover:text-[#4a4a4a]'
              }`}
            >
              <FaUser size={18} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'security' 
                  ? 'text-[#37574a] border-b-2 border-[#37574a]' 
                  : 'text-[#8a8a8a] hover:text-[#4a4a4a]'
              }`}
            >
              <FaLock size={18} />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'notifications' 
                  ? 'text-[#37574a] border-b-2 border-[#37574a]' 
                  : 'text-[#8a8a8a] hover:text-[#4a4a4a]'
              }`}
            >
              <FaBell size={18} />
              Notifications
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Quick Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#37574a] to-[#4a6b5c] flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-[#D95C3E] text-white p-2 rounded-full hover:bg-[#c4512a] transition-colors shadow-lg">
                      <FaCamera size={18} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-[#333333] mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-[#8a8a8a] mb-1">{profileData.role}</p>
                  <p className="text-sm text-[#8a8a8a] mb-4">{profileData.company}</p>

                  <div className="pt-4 border-t border-[#e0ddc7]">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#4a4a4a] mb-2">
                      <FaCalendarAlt size={16} className="text-[#8a8a8a]" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-[#4a4a4a]">
                      <FaMapMarkerAlt size={16} className="text-[#8a8a8a]" />
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6 mt-6">
                <h3 className="font-semibold text-[#333333] mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4a4a4a]">Email Verified</span>
                    <span className="flex items-center gap-1 text-xs text-[#4a7c59] bg-[#4a7c59]/10 px-2 py-1 rounded-full">
                      <FaShieldAlt size={12} />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4a4a4a]">Two-Factor Auth</span>
                    <span className="text-xs text-[#8a8a8a] bg-gray-100 px-2 py-1 rounded-full">
                      Not Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#333333]">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#37574a] text-white rounded-lg hover:bg-[#2a4238] transition-colors"
                    >
                      <FaEdit size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-[#e0ddc7] text-[#4a4a4a] rounded-lg hover:bg-[#f8f8f6] transition-colors"
                      >
                        <FaTimes size={16} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#D95C3E] text-white rounded-lg hover:bg-[#c4512a] transition-colors"
                      >
                        <FaSave size={16} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        {profileData.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        {profileData.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                      <FaEnvelope size={18} className="text-[#8a8a8a]" />
                      {profileData.email}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        <FaPhone size={18} className="text-[#8a8a8a]" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        <FaBuilding size={18} className="text-[#8a8a8a]" />
                        {profileData.company}
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Role
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        {profileData.role}
                      </p>
                    )}
                  </div>

                  {/* Location - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        {profileData.location}
                      </p>
                    )}
                  </div>

                  {/* Bio - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333] resize-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#f8f8f6] rounded-lg text-[#4a4a4a]">
                        {profileData.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === 'security' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6 mb-6">
              <h3 className="text-xl font-semibold text-[#333333] mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                  />
                </div>
                <button className="px-6 py-3 bg-[#37574a] text-white rounded-lg hover:bg-[#2a4238] transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6">
              <h3 className="text-xl font-semibold text-[#333333] mb-4">Two-Factor Authentication</h3>
              <p className="text-[#4a4a4a] mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="px-6 py-3 bg-[#D95C3E] text-white rounded-lg hover:bg-[#c4512a] transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border border-[#e0ddc7] p-6">
              <h3 className="text-xl font-semibold text-[#333333] mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications for project updates', id: 'project-updates' },
                  { label: 'SMS alerts for urgent requests', id: 'urgent-sms' },
                  { label: 'Invoice and billing reminders', id: 'billing' },
                  { label: 'Certificate expiry alerts', id: 'certificates' },
                  { label: 'Weekly activity summary', id: 'weekly-summary' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-[#37574a] rounded border-[#e0ddc7] focus:ring-[#37574a]"
                    />
                    <span className="text-[#4a4a4a] group-hover:text-[#333333]">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#e0ddc7]">
                <button className="px-6 py-3 bg-[#37574a] text-white rounded-lg hover:bg-[#2a4238] transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}