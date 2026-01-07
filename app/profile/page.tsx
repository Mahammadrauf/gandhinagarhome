'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  User, 
  Heart, 
  Home, 
  Bell, 
  Settings, 
  LogOut, 
  MapPin, 
  Edit2, 
  Trash2, 
  Plus,
  Camera
} from 'lucide-react';

// --- CONFIGURATION ---
const BRAND_COLOR = "text-[#006A58]";
const BRAND_BG = "bg-[#006A58]";
const BRAND_HOVER_BG = "hover:bg-[#005445]";
const BRAND_LIGHT_BG = "bg-[#006A58]/10";
const BRAND_BORDER = "border-[#006A58]";
// This was missing previously causing the error:
const BRAND_FOCUS_RING = "focus:ring-[#006A58]"; 

// --- MOCK DATA ---
const MOCK_USER = {
  firstName: "Arjun",
  lastName: "Trivedi",
  email: "arjun@example.com",
  mobile: "+91 98765 43210",
  location: "Gandhinagar, Gujarat",
  isVerified: true
};

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "3 BHK Luxury Apartment",
    location: "Sargasan, Gandhinagar",
    price: "₹ 85 Lakhs",
    status: "Active",
    views: 124,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Commercial Office Space",
    location: "Infocity, Gandhinagar",
    price: "₹ 45,000 / month",
    status: "Under Review",
    views: 12,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
  }
];

const MOCK_FAVORITES = [
  {
    id: 101,
    title: "4 BHK Villa with Garden",
    location: "Raysan, Gandhinagar",
    price: "₹ 2.5 Cr",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=400"
  }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Listing Approved", message: "Your property in Sargasan is now live.", time: "2 hours ago", read: false },
  { id: 2, title: "New Lead", message: "Rahul is interested in your Office Space.", time: "1 day ago", read: true },
  { id: 3, title: "Price Drop Alert", message: "A property in your wishlist dropped by 5%.", time: "2 days ago", read: true },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  // --- RENDER HELPERS ---
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
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-72 shrink-0 space-y-6">
            
            {/* User Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <div className={`w-24 h-24 rounded-full ${BRAND_BG} flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg`}>
                  {MOCK_USER.firstName[0]}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-[#006A58]">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {MOCK_USER.firstName} {MOCK_USER.lastName}
                {MOCK_USER.isVerified && (
                  <span className="bg-green-100 text-green-700 p-0.5 rounded-full" title="Verified User">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{MOCK_USER.email}</p>
              
              <div className="mt-4 w-full pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <span className="block font-bold text-gray-800 text-lg">12</span>
                    <span className="text-xs text-gray-500">Listings</span>
                 </div>
                 <div className="text-center">
                    <span className="block font-bold text-gray-800 text-lg">450</span>
                    <span className="text-xs text-gray-500">Views</span>
                 </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <SidebarItem id="profile" icon={User} label="My Profile" />
              <SidebarItem id="listings" icon={Home} label="My Listings" count={2} />
              <SidebarItem id="favorites" icon={Heart} label="Favorites" count={5} />
              <SidebarItem id="notifications" icon={Bell} label="Notifications" count={3} />
              <div className="my-2 border-t border-gray-100" />
              <SidebarItem id="settings" icon={Settings} label="Settings" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-all">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* --- MAIN CONTENT AREA --- */}
          <div className="flex-1">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                  <button className={`${BRAND_COLOR} hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}>Save Changes</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">First Name</label>
                      <input type="text" defaultValue={MOCK_USER.firstName} className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Last Name</label>
                      <input type="text" defaultValue={MOCK_USER.lastName} className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Email Address</label>
                      <input type="email" defaultValue={MOCK_USER.email} className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                      <input type="tel" defaultValue={MOCK_USER.mobile} disabled className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed" />
                      <span className="text-xs text-gray-400">Cannot be changed</span>
                   </div>
                   <div className="col-span-full space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Location / City</label>
                      <input type="text" defaultValue={MOCK_USER.location} className={`w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${BRAND_FOCUS_RING}`} />
                   </div>
                </div>
              </div>
            )}

            {/* LISTINGS TAB */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">My Properties</h3>
                  <button className={`${BRAND_BG} ${BRAND_HOVER_BG} text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md transition-all`}>
                    <Plus className="w-4 h-4" /> Post New Property
                  </button>
                </div>
                
                {MOCK_LISTINGS.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.title} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {item.location}</p>
                        <p className={`mt-2 font-bold ${BRAND_COLOR} text-lg`}>{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <span className="text-xs text-gray-400 font-medium">Views: {item.views}</span>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAVORITES TAB */}
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
                          <button className={`text-xs border ${BRAND_BORDER} ${BRAND_COLOR} px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium`}>View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                 </div>
              </div>
            )}

             {/* NOTIFICATIONS TAB */}
             {activeTab === 'notifications' && (
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
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
}