'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Menu, X, User, LogOut, ChevronDown, Loader2, ArrowRight } from 'lucide-react';

// --- CONFIGURATION ---
const BRAND_COLOR = "text-[#006A58]";
const BRAND_BG = "bg-[#006A58]";
const BRAND_HOVER_BG = "hover:bg-[#005445]";
const BRAND_FOCUS_RING = "focus:ring-[#006A58]";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- TYPES ---
interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}

// --- SUB-COMPONENTS ---
const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, mobile }) => {
  if (mobile) {
    return (
      <Link href={href} onClick={onClick} className="block w-full">
        <div className={`py-3 px-4 text-gray-600 hover:bg-[#006A58]/5 hover:text-[#006A58] font-medium transition-colors rounded-lg`}>
          {children}
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className="relative group py-2">
      <span className={`text-gray-600 font-medium text-sm group-hover:text-[#006A58] transition-colors`}>
        {children}
      </span>
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#006A58] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
    </Link>
  );
};

// --- MAIN HEADER COMPONENT ---
const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'role' | 'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP States (Dual Verification)
  const [whatsappOtp, setWhatsappOtp] = useState(['', '', '', '', '', '']); // 6 Digits
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']); // 6 Digits
  const whatsappRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Ref for Signup Popup
  const signupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // User Data State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for country code (backend-driven)
  const [countryCode, setCountryCode] = useState('+91');
  const [user, setUser] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    mobile: '',
    role: '' as 'buyer' | 'seller' | '' 
  });

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- RESTORE SESSION ON MOUNT ---
  useEffect(() => {
    const savedUser = localStorage.getItem('gh_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.isLoggedIn) {
          setIsLoggedIn(true);
          setUser({
            firstName: parsedUser.firstName || '',
            lastName: parsedUser.lastName || '',
            email: parsedUser.email || '',
            mobile: parsedUser.mobile || '',
            role: (parsedUser.role || '') as '' | 'buyer' | 'seller'
          });
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  // --- PERSISTENT LOOP LOGIC (30s Timer) ---
  useEffect(() => {
    if (isLoggedIn) {
      if (signupTimerRef.current) {
        clearTimeout(signupTimerRef.current);
        signupTimerRef.current = null;
      }
      return;
    }

    if (!isAuthOpen) {
      signupTimerRef.current = setTimeout(() => {
        openAuth('signup');
      }, 30000); 
    }

    return () => {
      if (signupTimerRef.current) {
        clearTimeout(signupTimerRef.current);
      }
    };
  }, [isLoggedIn, isAuthOpen]); 

  const handleCloseLoop = () => {
    setIsAuthOpen(false);
  };


  // --- OTP LOGIC ---
  const handleOtpChange = (index: number, value: string, type: 'whatsapp' | 'email') => {
    if (isNaN(Number(value))) return;
    
    if (type === 'whatsapp') {
      const newOtp = [...whatsappOtp];
      newOtp[index] = value.substring(value.length - 1);
      setWhatsappOtp(newOtp);
      if (value && index < 5 && whatsappRefs.current[index + 1]) {
        whatsappRefs.current[index + 1]?.focus();
      }
    } else {
      const newOtp = [...emailOtp];
      newOtp[index] = value.substring(value.length - 1);
      setEmailOtp(newOtp);
      if (value && index < 5 && emailRefs.current[index + 1]) {
        emailRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, type: 'whatsapp' | 'email') => {
    const otpArr = type === 'whatsapp' ? whatsappOtp : emailOtp;
    const refs = type === 'whatsapp' ? whatsappRefs : emailRefs;
    
    if (e.key === 'Backspace' && !otpArr[index] && index > 0 && refs.current[index - 1]) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'signup') {
      if (!user.firstName.trim() || !user.lastName.trim() || !user.email.trim() || !user.mobile.trim()) {
        return; 
      }
    } else {
      if (!user.mobile.trim()) return;
    }

    setIsLoading(true);
    try {
      const mobile = user.mobile;
      const email = user.email;

      const sendMobileOtpRes = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });

      const sendMobileOtpJson = await sendMobileOtpRes.json();
      if (!sendMobileOtpRes.ok || !sendMobileOtpJson?.success) {
        throw new Error(sendMobileOtpJson?.message || 'Failed to send OTP');
      }

      if (authMode === 'signup') {
        const sendEmailOtpRes = await fetch(`${API_BASE_URL}/auth/send-email-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const sendEmailOtpJson = await sendEmailOtpRes.json();
        if (!sendEmailOtpRes.ok || !sendEmailOtpJson?.success) {
          throw new Error(sendEmailOtpJson?.message || 'Failed to send email OTP');
        }
      }

      setStep('otp');
      setTimeout(() => whatsappRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const isWaValid = whatsappOtp.join('').length === 6;
    const isEmailValid = emailOtp.join('').length === 6;

    if (authMode === 'login') {
      if (!isWaValid) return;
    } else {
      if (!isWaValid || !isEmailValid) return;
    }
    
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const mobile = user.mobile;
        const otp = whatsappOtp.join('');

        const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile, otp, rememberMe: false })
        });

        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.message || 'OTP verification failed');
        }

        const apiUser = json?.data?.user;
        const token = json?.data?.token;

        const name = apiUser?.name || 'User';
        const firstName = name.split(' ')[0] || 'User';
        const lastName = name.split(' ').slice(1).join(' ');

        const updatedUser = {
          firstName,
          lastName,
          email: apiUser?.email || '',
          mobile: apiUser?.mobile || mobile,
          role: (apiUser?.role as 'buyer' | 'seller' | '') || '',
          token,
          isLoggedIn: true
        };

        localStorage.setItem('gh_user', JSON.stringify(updatedUser));
        if (token) localStorage.setItem('gh_token', token);

        setIsLoggedIn(true);
        setUser({ firstName, lastName, email: updatedUser.email, mobile: updatedUser.mobile, role: updatedUser.role as '' | 'buyer' | 'seller' });
        setIsAuthOpen(false);
        router.push('/profile');
      } else {
        const payload = {
          mobile: user.mobile,
          mobileOtp: whatsappOtp.join(''),
          email: user.email,
          emailOtp: emailOtp.join(''),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          rememberMe: false
        };

        const res = await fetch(`${API_BASE_URL}/auth/verify-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.message || 'Signup verification failed');
        }

        const apiUser = json?.data?.user;
        const token = json?.data?.token;

        const name = apiUser?.name || `${user.firstName} ${user.lastName}`.trim() || 'User';
        const firstName = name.split(' ')[0] || user.firstName || 'User';
        const lastName = name.split(' ').slice(1).join(' ') || user.lastName;

        const updatedUser = {
          firstName,
          lastName,
          email: apiUser?.email || user.email,
          mobile: apiUser?.mobile || user.mobile,
          role: (apiUser?.role as 'buyer' | 'seller' | '') || user.role,
          token,
          isLoggedIn: true
        };

        localStorage.setItem('gh_user', JSON.stringify(updatedUser));
        if (token) localStorage.setItem('gh_token', token);

        setIsLoggedIn(true);
        setUser({ firstName, lastName, email: updatedUser.email, mobile: updatedUser.mobile, role: updatedUser.role as '' | 'buyer' | 'seller' });
        setIsAuthOpen(false);
        router.push('/profile');
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_user');
    localStorage.removeItem('gh_token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setUser({ firstName: '', lastName: '', email: '', mobile: '', role: '' });
    router.push('/');
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setStep(mode === 'signup' ? 'role' : 'details');
    setWhatsappOtp(['', '', '', '', '', '']);
    setEmailOtp(['', '', '', '', '', '']);
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5 border-b border-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2 flex-shrink-0 z-50">
              <div className={`${BRAND_BG} p-1.5 rounded-lg text-white transition-transform group-hover:scale-110 duration-300`}>
                <Home className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className={`text-lg font-bold text-gray-800 tracking-tight group-hover:text-[#006A58] transition-colors`}>Gandhinagar<span className="text-[#006A58]">Homes</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/buy">Buy</NavLink>
                <NavLink href="/sell">Sell</NavLink>
                <NavLink href="/about">About Us</NavLink>
                <NavLink href="/contact">Contact Us</NavLink>
              </nav>

              {!isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => openAuth('login')} className="border-2 border-[#006A58] text-[#006A58] px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-[#006A58]/5 active:scale-95">Log In</button>
                  <button onClick={() => openAuth('signup')} className={`${BRAND_BG} ${BRAND_HOVER_BG} text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#006A58]/20 hover:shadow-[#006A58]/40 active:scale-95 transform`}>Sign Up</button>
                </div>
              ) : (
                <div className="group relative cursor-pointer">
                  <div className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100 transition-colors">
                    <div className={`w-8 h-8 ${BRAND_BG} rounded-full flex items-center justify-center text-white font-bold text-sm`}>{user.firstName[0]?.toUpperCase() || 'U'}</div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.firstName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="p-2">
                      <Link href="/profile" className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-4 h-4" /> Logout</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Actions Container */}
            <div className="flex items-center gap-2 md:hidden">
              {isLoggedIn && (
                <Link href="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              )}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-4 space-y-1">
            <nav className="mb-4">
              <NavLink mobile href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink mobile href="/buy" onClick={() => setIsMobileMenuOpen(false)}>Buy</NavLink>
              <NavLink mobile href="/sell" onClick={() => setIsMobileMenuOpen(false)}>Sell</NavLink>
              <NavLink mobile href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
              <NavLink mobile href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
            </nav>
            
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-50">
                <button onClick={() => openAuth('login')} className="w-full border-2 border-[#006A58] text-[#006A58] py-3 rounded-xl font-bold transition-all active:scale-95">Log In</button>
                <button onClick={() => openAuth('signup')} className={`w-full ${BRAND_BG} text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95`}>Sign Up</button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-50">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="h-20" /> 

      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleCloseLoop} />
          
          <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            
            <div className={`${BRAND_BG} px-6 py-5 text-center relative shrink-0`}>
              <button onClick={handleCloseLoop} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-white/10 p-1 rounded-full"><X className="w-4 h-4" /></button>
              
              <h2 className="text-xl font-bold text-white tracking-tight">
                  {authMode === 'signup' && step === 'role' ? 'Sign Up' : step === 'otp' ? (authMode === 'login' ? 'Verify WhatsApp OTP' : 'Dual Verification') : (authMode === 'signup' ? `Create Account as ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Welcome Back')}
              </h2>
              <p className="text-[#a3e0d5] text-xs mt-1 font-medium">
                  {step === 'otp' ? (authMode === 'login' ? 'Enter the code sent to your WhatsApp' : 'Enter WhatsApp and Email codes') : (authMode === 'signup' && step === 'role' ? 'Join GandhinagarHomes' : (authMode === 'signup' ? `Join GandhinagarHomes as ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Login to your account'))}
              </p>
            </div>

            <div className="p-5">
              {authMode === 'signup' && step === 'role' && (
                  <div className="flex flex-col gap-3 py-4 animate-in slide-in-from-bottom-2 duration-300">
                      <button 
                          onClick={() => { setUser({...user, role: 'buyer'}); setStep('details'); }}
                          className={`w-full py-4 px-6 rounded-full font-bold text-white ${BRAND_BG} ${BRAND_HOVER_BG} transition-all shadow-md active:scale-95 flex items-center justify-between`}
                      >
                          Sign up as Buyer <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                          onClick={() => { setUser({...user, role: 'seller'}); setStep('details'); }}
                          className={`w-full py-4 px-6 rounded-full font-bold text-white ${BRAND_BG} ${BRAND_HOVER_BG} transition-all shadow-md active:scale-95 flex items-center justify-between`}
                      >
                          Sign up as Seller <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="text-center pt-2">
                          <p className="text-xs text-gray-500 font-medium">Joined already? <button type="button" onClick={() => openAuth('login')} className={`font-bold ${BRAND_COLOR} `}>Log In</button></p>
                      </div>
                  </div>
              )}

              {step === 'details' && (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-wide">First Name</label>
                        <input required type="text" className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 ${BRAND_FOCUS_RING} focus:border-transparent transition-all text-sm`} value={user.firstName} onChange={(e) => setUser({...user, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-wide">Last Name</label>
                        <input required type="text" className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 ${BRAND_FOCUS_RING} focus:border-transparent transition-all text-sm`} value={user.lastName} onChange={(e) => setUser({...user, lastName: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-wide">Email Address</label>
                        <input required type="email" className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 ${BRAND_FOCUS_RING} focus:border-transparent transition-all text-sm`} value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-wide">WhatsApp Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold text-sm">{countryCode}</span><div className="h-4 w-px bg-gray-300 mx-2"></div></div>
                      <input required type="tel" maxLength={10} pattern="[0-9]{10}" className={`w-full pl-16 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 ${BRAND_FOCUS_RING} focus:border-transparent transition-all font-semibold text-gray-800 tracking-wide text-sm`} value={user.mobile} onChange={(e) => setUser({...user, mobile: e.target.value.replace(/\D/g,'')})} />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading || user.mobile.length < 10} className={`w-full ${BRAND_BG} ${BRAND_HOVER_BG} text-white font-bold py-2.5 rounded-lg shadow-md shadow-[#006A58]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 active:scale-[0.98] text-sm`}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'signup' ? 'Get OTP on Email & WhatsApp' : 'Get Login OTP')} <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-gray-500">
                      {authMode === 'login' ? "New here? " : `Already have a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account? `} 
                      <button 
                        type="button" 
                        onClick={() => openAuth(authMode === 'login' ? 'signup' : 'login')} 
                        className={`font-bold ${BRAND_COLOR} hover:no-underline text-sm`}
                      >
                        {authMode === 'login' ? 'Sign Up' : 'Log In'}
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {step === 'otp' && (
                <div className="flex flex-col items-center space-y-6 animate-in slide-in-from-right-8 duration-300 pb-2">
                  <div className="w-full space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase text-center block tracking-widest">WhatsApp OTP (6 Digits)</label>
                      <div className="flex gap-2 w-full justify-center">
                      {whatsappOtp.map((digit, i) => (
                          <input
                          key={`wa-${i}`}
                          ref={(el) => { whatsappRefs.current[i] = el }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value, 'whatsapp')}
                          onKeyDown={(e) => handleOtpKeyDown(i, e, 'whatsapp')}
                          className={`w-10 h-12 text-center text-xl font-bold bg-white border rounded-lg focus:outline-none focus:scale-105 transition-all caret-[#006A58] ${digit ? `border-[#006A58] text-[#006A58]` : 'border-gray-200 text-gray-800'} focus:border-[#006A58] focus:ring-2 focus:ring-[#006A58]/10 shadow-sm`}
                          />
                      ))}
                      </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="w-full space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase text-center block tracking-widest">Email OTP (6 Digits)</label>
                        <div className="flex gap-2 w-full justify-center">
                        {emailOtp.map((digit, i) => (
                            <input
                            key={`em-${i}`}
                            ref={(el) => { emailRefs.current[i] = el }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value, 'email')}
                            onKeyDown={(e) => handleOtpKeyDown(i, e, 'email')}
                            className={`w-9 h-11 text-center text-lg font-bold bg-white border rounded-lg focus:outline-none focus:scale-105 transition-all caret-[#006A58] ${digit ? `border-[#006A58] text-[#006A58]` : 'border-gray-200 text-gray-800'} focus:border-[#006A58] focus:ring-2 focus:ring-[#006A58]/10 shadow-sm`}
                            />
                        ))}
                        </div>
                    </div>
                  )}
                  
                  <button onClick={handleVerifyOtp} disabled={isLoading || whatsappOtp.join('').length < 6 || (authMode === 'signup' && emailOtp.join('').length < 6)} className={`w-full ${BRAND_BG} ${BRAND_HOVER_BG} text-white font-bold py-2.5 rounded-lg shadow-md shadow-[#006A58]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm`}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'login' ? 'Verify WhatsApp OTP' : 'Verify Email & WhatsApp OTP')}
                  </button>

                  <div className="flex flex-col items-center gap-1 w-full text-xs">
                    <p className="text-gray-500">Problems? <button onClick={() => { setStep('details'); setIsLoading(false); }} className="font-semibold text-gray-800 hover:text-[#006A58]">Change Details</button></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;