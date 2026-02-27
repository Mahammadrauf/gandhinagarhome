'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Home, 
  Bell, 
  Settings, 
  LogOut, 
  MapPin, 
  Plus,
  Camera,
  Shield,
  BellRing,
  Trash2,
  Crown,       // Added
  Star,        // Added
  CheckCircle2 // Added
} from 'lucide-react';
import { fetchMyProperties, BackendProperty, transformProperty, FrontendProperty, updateUserProfile } from '@/lib/api';

const BRAND_COLOR = "text-[#006A58]";
const BRAND_BG = "bg-[#006A58]";
const BRAND_HOVER_BG = "hover:bg-[#005445]";
const BRAND_FOCUS_RING = "focus:ring-[#006A58]";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Listing Approved", message: "Your property in Sargasan is now live.", time: "2 hours ago", read: false },
  { id: 2, title: "New Lead", message: "Rahul is interested in your Office Space.", time: "1 day ago", read: true },
];

export default function SellerProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myProperties, setMyProperties] = useState<FrontendProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for profile
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    mobile: ''
  });

  // Fetch user's properties
  const fetchUserProperties = async () => {
    try {
      setPropertiesLoading(true);
      const token = localStorage.getItem('gh_token');
      if (!token) {
        console.log('No token found, user might not be authenticated');
        return;
      }
      
      const properties = await fetchMyProperties(token);
      const transformedProperties = properties.map(transformProperty);
      setMyProperties(transformedProperties);
      console.log('User properties loaded:', transformedProperties);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('gh_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.role === 'seller') {
          setUser(parsedUser);
          setFormData({
            firstName: parsedUser.firstName || '',
            lastName: parsedUser.lastName || '',
            email: parsedUser.email || '',
            whatsapp: parsedUser.mobile || '', 
            mobile: parsedUser.mobile || ''
          });
          // Fetch user's properties when user data is loaded
          fetchUserProperties();
        }
      } catch (e) {
        console.error("Error parsing seller data", e);
      }
    }
  }, []);

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_user');
    localStorage.removeItem('gh_token');
    router.push('/');
  };

  const handleUpgrade = () => {
    // Redirect to subscription page
    router.push('/sell/subscription');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
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
      {count > 0 && id !== 'listings' && (
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
                    formData.firstName?.[0] || 'S'
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
              
              {/* Current Plan Status Badge */}
              <div className="mt-3 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 border border-gray-200">
                 Current: Standard Plan
              </div>

              <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-center">
                 <div className="text-center">
                    <span className="block font-bold text-gray-800 text-lg">{myProperties.length}</span>
                    <span className="text-xs text-gray-500">Listing{myProperties.length !== 1 ? 's' : ''}</span>
                 </div>
              </div>
            </div>

            <nav className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <SidebarItem id="profile" icon={User} label="My Profile" />
              <SidebarItem id="listings" icon={Home} label="My Listing" count={myProperties.length} />
              
              {/* NEW MEMBERSHIP TAB */}
              <SidebarItem id="membership" icon={Crown} label="Membership Plans" />
              
              {/* <SidebarItem id="notifications" icon={Bell} label="Notifications" count={MOCK_NOTIFICATIONS.length} /> */}
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
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">My Property</h3>
                </div>
                
                {propertiesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006A58]"></div>
                    <span className="ml-2 text-gray-500">Loading your properties...</span>
                  </div>
                ) : myProperties.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Properties Listed</h4>
                    <p className="text-gray-500 text-sm mb-6">You haven't listed any properties yet. Start by posting your first property.</p>
                    <button 
                      onClick={() => router.push('/sell')}
                      className={`${BRAND_BG} ${BRAND_HOVER_BG} text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md transition-all mx-auto`}
                    >
                      <Plus className="w-4 h-4" /> Post Your First Property
                    </button>
                  </div>
                ) : (
                  myProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <img src={property.image} alt={property.location} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-800 text-lg">{property.title} {property.beds} BHK {property.propertyType}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Active
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {property.location}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>{property.beds} Beds</span>
                            <span>{property.baths} Baths</span>
                            <span>{property.sqft} sqft</span>
                          </div>
                          <p className={`mt-2 font-bold ${BRAND_COLOR} text-lg`}>{property.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- NEW MEMBERSHIP TAB CONTENT --- */}
            {activeTab === 'membership' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-2">Upgrade Your Selling Power</h3>
                   <p className="text-gray-500 text-sm mb-6">Switch to a higher tier plan to sell faster and get more visibility.</p>

                   <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Featured Option */}
                      <div className="border-2 border-blue-100 bg-blue-50/50 rounded-xl p-6 relative hover:shadow-lg transition-all">
                         <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 p-2 rounded-full">
                            <Star size={20} className="fill-blue-700" />
                         </div>
                         <h4 className="text-lg font-bold text-blue-900">Featured</h4>
                         <p className="text-2xl font-extrabold text-blue-700 mt-2">₹14,997</p>
                         <p className="text-sm text-blue-600/80 mb-4">Valid for 1 Month</p>
                         
                         <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-blue-600"/> Top 5 Search Ranking</li>
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-blue-600"/> Visible on Home Page</li>
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-blue-600"/> WhatsApp Chat Link</li>
                         </ul>

                         <button 
                            onClick={handleUpgrade}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg"
                         >
                            Switch to Featured
                         </button>
                      </div>

                      {/* Exclusive Option */}
                      <div className="border-2 border-[#B59E78] bg-gradient-to-b from-[#FFFBEB] to-[#fff7ed] rounded-xl p-6 relative hover:shadow-xl transition-all transform hover:-translate-y-1">
                         <div className="absolute top-0 left-0 w-full flex justify-center -mt-3">
                            <span className="bg-[#B59E78] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Best Value</span>
                         </div>
                         <div className="absolute top-4 right-4 bg-[#F5F2EB] text-[#B59E78] p-2 rounded-full">
                            <Crown size={20} className="fill-[#B59E78]" />
                         </div>
                         <h4 className="text-lg font-bold text-[#5C5042] mt-2">Exclusive</h4>
                         <p className="text-2xl font-extrabold text-[#8C7A5B] mt-2">₹19,997</p>
                         <p className="text-sm text-[#8C7A5B]/80 mb-4">Valid for 1 Month</p>
                         
                         <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-[#B59E78]"/> #1 Position on Home Page</li>
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-[#B59E78]"/> Top of Property Page</li>
                            <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={16} className="text-[#B59E78]"/> Relationship Manager</li>
                         </ul>

                         <button 
                             onClick={handleUpgrade}
                             className="w-full py-3 bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#B59E78]/40 transition-all"
                         >
                            Switch to Exclusive
                         </button>
                      </div>

                   </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                  <button
                    onClick={handleSaveChanges}
                    disabled={formData.mobile.length !== 10}
                    className={`${BRAND_COLOR} hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${formData.mobile.length !== 10 ? "border border-gray-400 opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Save Changes
                  </button>
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
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        if (numericValue.length <= 10) {
                          setFormData({ ...formData, mobile: numericValue });
                        }
                      }}
                      className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- NOTIFICATIONS TAB CONTENT (COMMENTED FOR NOW) --- */}
            {/* {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                </div>
                <div>
                  {MOCK_NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className={`p-5 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-green-50/50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? `${BRAND_BG} text-white` : 'bg-gray-100 text-gray-500'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">{notif.time}</span>
                      </div>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <BellRing className={`w-5 h-5 ${BRAND_COLOR}`} />
                    <h3 className="text-lg font-bold text-gray-800">Notification Preferences</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">New buyer enquiry alerts</p>
                        <p className="text-xs text-gray-500">Get notified immediately when a buyer shows interest</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006A58]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Listing status updates</p>
                        <p className="text-xs text-gray-500">Receive alerts regarding your property approval status</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006A58]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${BRAND_COLOR}`} />
                    <h3 className="text-lg font-bold text-gray-800">Property Controls</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className="w-full flex items-center justify-between text-left group opacity-50 cursor-not-allowed">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Edit Listing Rules</p>
                        <p className="text-xs text-gray-500">Configure how buyers interact with your listings</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 italic">Coming soon</span>
                    </button>
                    {/* Updated Link to use the function */}
                    <button onClick={() => setActiveTab('membership')} className="w-full flex items-center justify-between text-left group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Upgrade Listing Visibility</p>
                        <p className="text-xs text-gray-500">Feature your property at the top of search results</p>
                      </div>
                      <span className="text-xs font-medium text-[#006A58]">View Plans →</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Account</h3>
                  </div>
                  <div className="p-6">
                    <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-bold transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Deactivate Seller Account
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