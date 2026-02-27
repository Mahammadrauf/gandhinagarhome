'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  Bell, 
  Settings, 
  LogOut, 
  MapPin, 
  Camera,
  Shield,
  BellRing,
  Trash2,
  Unlock,
  Crown
} from 'lucide-react';
import { updateUserProfile } from '@/lib/api';

const BRAND_COLOR = "text-[#006A58]";
const BRAND_BG = "bg-[#006A58]";
const BRAND_FOCUS_RING = "focus:ring-[#006A58]";

const MOCK_FAVORITES = [
  {
    id: 101,
    title: "4 BHK Villa with Garden",
    location: "Raysan, Gandhinagar",
    price: "₹ 2.5 Cr",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=400"
  }
];

export default function BuyerProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    mobile: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('gh_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role === 'buyer') {
          setUser(parsedUser);
          setFormData({
            firstName: parsedUser.firstName || '',
            lastName: parsedUser.lastName || '',
            email: parsedUser.email || '',
            whatsapp: parsedUser.mobile || '', 
            mobile: parsedUser.mobile || ''   
          });
        }
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gh_user');
    router.push('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    const limitedToTen = digitsOnly.slice(0, 10);
    setFormData({...formData, mobile: limitedToTen});
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('gh_token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      // Show loading state
      const originalText = 'Save Changes';
      const button = document.querySelector('button[onclick="handleSaveChanges()"]') as HTMLButtonElement;
      if (button) button.textContent = 'Saving...';

      const updatedUser = await updateUserProfile(token, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        whatsappNumber: formData.whatsapp,
        mobile: formData.mobile
      });

      if (updatedUser) {
        // Update localStorage with the new user data
        const savedUser = JSON.parse(localStorage.getItem('gh_user') || '{}');
        const newUser = {
          ...savedUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name: updatedUser.name,
          mobile: updatedUser.mobile
        };
        localStorage.setItem('gh_user', JSON.stringify(newUser));
        setUser(newUser);
        
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }

      // Reset button text
      if (button) button.textContent = originalText;
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while updating your profile. Please try again.');
      
      // Reset button text
      const button = document.querySelector('button[onclick="handleSaveChanges()"]') as HTMLButtonElement;
      if (button) button.textContent = 'Save Changes';
    }
  };

  if (!user) return null;

  const SidebarItem = ({ id, icon: Icon, label, count }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1
        ${activeTab === id 
          ? `${BRAND_BG} text-white shadow-lg shadow-[#006A58]/20` 
          : 'text-gray-600 hover:bg-gray-50 hover:text-[#006A58]'
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {count > 0 && (
        <span className={`text-xs py-0.5 px-2 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-72 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className={`w-24 h-24 rounded-full ${BRAND_BG} flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden`}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName?.[0] || 'U'
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-[#006A58]">
                  <Camera className="w-4 h-4" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {formData.firstName} {formData.lastName}
                <span className="bg-green-100 text-green-700 p-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 w-full">
                <span className="inline-block bg-green-50 text-[#006A58] text-xs px-3 py-1.5 rounded-full font-medium">Current Plan: Starter Pack</span>
              </div>
            </div>

            <nav className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <SidebarItem id="profile" icon={User} label="My Profile" />
              <SidebarItem id="unlocked" icon={Unlock} label="Unlocked Properties" />
              <SidebarItem id="upgrade" icon={Crown} label="Upgrade Plan" />
              <SidebarItem id="favorites" icon={Heart} label="Favorites" count={MOCK_FAVORITES.length} />
              <div className="my-2 border-t border-gray-100" />
              <SidebarItem id="settings" icon={Settings} label="Settings" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                  <button onClick={handleSaveChanges} disabled={formData.mobile.length !== 10} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${formData.mobile.length === 10 ? `${BRAND_COLOR} hover:bg-green-50` : 'text-gray-400 bg-gray-50 cursor-not-allowed'}`}>Save Changes</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled 
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      value={formData.whatsapp} 
                      disabled 
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={formData.mobile} 
                      onChange={handleMobileChange}
                      maxLength={10}
                      placeholder="10 digits only"
                      className={`w-full p-3 rounded-lg bg-gray-50 border ${formData.mobile.length === 10 ? 'border-gray-200' : formData.mobile.length > 0 ? 'border-yellow-300' : 'border-gray-200'} focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                 <h3 className="text-xl font-bold text-gray-800">Shortlisted Properties</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_FAVORITES.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                      <div className="relative">
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                        <p className="text-gray-500 text-sm mt-1 mb-3 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</p>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${BRAND_COLOR}`}>{item.price}</span>
                          <button className={`text-xs border border-[#006A58] ${BRAND_COLOR} px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium`}>View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                 </div>
              </div>
            )}

            {activeTab === 'unlocked' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Unlocked Properties</h3>
                {myProperties.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <div className={`w-16 h-16 rounded-full ${BRAND_BG} flex items-center justify-center mb-4`}>
                        <Unlock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Unlocked Properties Yet</h3>
                      <p className="text-gray-500 text-sm mb-6">Unlock owner details to connect directly.</p>
                      <button 
                        onClick={() => router.push('/buy')}
                        className={`${BRAND_BG} text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                      >
                        Browse Properties
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myProperties.map((item: any) => (
                      <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative">
                          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50">
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                          <p className="text-gray-500 text-sm mt-1 mb-3 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</p>
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${BRAND_COLOR}`}>{item.price}</span>
                            <button className={`text-xs border border-[#006A58] ${BRAND_COLOR} px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium`}>View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upgrade' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Upgrade Your Plan</h3>
                  <p className="text-gray-500">Unlock more properties and get priority support.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Plan - Starter */}
                  <div className="bg-[#e7fcf7] rounded-2xl shadow-xl shadow-[#0b6b53]/5 border-2 border-[#0b6b53] overflow-hidden hover:shadow-xl transition-all">
                    <div className="p-6 border-b-2 border-[#0b6b53]/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-[#0b6b53]">Starter Pack</h4>
                        <span className="bg-[#0b6b53] text-white text-xs px-2 py-1 rounded-full font-semibold">Current Plan</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#0b6b53]">₹1,997</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#0b6b53] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Unlock 5 Properties
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#0b6b53] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Valid for 60 Days
                        </li>
                      </ul>
                    </div>
                    <div className="p-6">
                      <button disabled className="w-full bg-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold cursor-not-allowed">
                        Active Plan
                      </button>
                    </div>
                  </div>

                  {/* Smart Plan - Blue */}
                  <div className="bg-[#f4fbff] rounded-2xl shadow-xl shadow-[#0F7F9C]/10 border-2 border-[#0F7F9C]/30 overflow-hidden hover:border-[#0F7F9C] transition-all">
                    <div className="p-6 border-b border-[#0F7F9C]/10">
                      <h4 className="text-lg font-bold text-[#022F5A] mb-4">Smart Pack</h4>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#0F7F9C]">₹4,997</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#0F7F9C] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Unlock 15 Properties
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#0F7F9C] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Priority Support
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#0F7F9C] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Valid for 60 Days
                        </li>
                      </ul>
                    </div>
                    <div className="p-6">
                      <button 
                        onClick={() => router.push('/buy/subscription')}
                        className="w-full bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Upgrade to Smart Pack
                      </button>
                    </div>
                  </div>

                  {/* Investor Plan - Gold/Brown */}
                  <div className="bg-gradient-to-b from-[#FDFBF7] to-[#fcf8f0] rounded-2xl shadow-2xl shadow-[#B59E78]/25 border-2 border-[#B59E78] ring-4 ring-[#B59E78]/10 overflow-hidden hover:shadow-2xl transition-all">
                    <div className="p-6 border-b border-[#B59E78]/10">
                      <h4 className="text-lg font-bold text-[#5C5042] mb-4">Investor Pack</h4>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#8C7A5B]">₹9,997</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#B59E78] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Unlock 40 Properties
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#B59E78] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Relationship Manager
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#B59E78] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Legal Assistance
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#B59E78] flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </span>
                          Valid for 60 Days
                        </li>
                      </ul>
                    </div>
                    <div className="p-6">
                      <button 
                        onClick={() => router.push('/buy/subscription')}
                        className="w-full bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Upgrade to Investor Pack
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <BellRing className={`w-5 h-5 ${BRAND_COLOR}`} />
                    <h3 className="text-lg font-bold text-gray-800">Notification Preferences</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Property alerts</p>
                        <p className="text-xs text-gray-500">Get notified when new properties match your criteria</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006A58]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Price drop alerts</p>
                        <p className="text-xs text-gray-500">Get notified when properties in your favorites drop in price</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006A58]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${BRAND_COLOR}`} />
                    <h3 className="text-lg font-bold text-gray-800">Privacy & Security</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className="w-full flex items-center justify-between text-left group opacity-50 cursor-not-allowed">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Change Password</p>
                        <p className="text-xs text-gray-500">Update your account password</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 italic">Coming soon</span>
                    </button>
                    <button className="w-full flex items-center justify-between text-left group opacity-50 cursor-not-allowed">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Manage Sessions</p>
                        <p className="text-xs text-gray-500">View and manage your active login sessions</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 italic">Coming soon</span>
                    </button>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Account</h3>
                  </div>
                  <div className="p-6">
                    <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-bold transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}