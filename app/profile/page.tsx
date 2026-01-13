'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BuyerProfile from './BuyerProfile';
import SellerProfile from './SellerProfile';

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Read the auth data persisted by the Header component
    const savedUser = localStorage.getItem('gh_user');
    
    if (!savedUser) {
      // 2. No data found, redirect to home
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      
      // 3. Verify real auth status and role existence
      if (parsedUser.isLoggedIn === true && (parsedUser.role === 'buyer' || parsedUser.role === 'seller')) {
        setRole(parsedUser.role);
        setLoading(false);
      } else {
        // 4. Invalid session data, redirect to home
        router.push('/');
      }
    } catch (error) {
      // 5. JSON Parse error, treat as unauthenticated
      router.push('/');
    }
  }, [router]);

  // Maintain existing behavior: return null while resolving auth
  if (loading) return null;

  return (
    <>
      <Header />
      {/* 6. Dynamic rendering based on verified localStorage role */}
      {role === 'buyer' ? (
        <BuyerProfile />
      ) : role === 'seller' ? (
        <SellerProfile />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 font-medium">Redirecting...</p>
        </div>
      )}
    </>
  );
}