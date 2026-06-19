import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api'; // Import đối tượng 'api' tổng hợp
import { UserProfile } from '../api/userApi'; // Import UserProfile type
import { AuthModal } from '../components/AuthModal'; // Import AuthModal

type Tab = 'login' | 'register'; // Define Tab type here

interface AuthContextType {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  loading: boolean;
  showDashboard: boolean; // Thêm trạng thái showDashboard
  setShowDashboard: (show: boolean) => void; // Thêm setter cho showDashboard
  login: (token: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (initialTab: Tab) => void; // New: Function to open AuthModal
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false); // Khởi tạo state showDashboard
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // AuthModal state moved here
  const [authModalInitialTab, setAuthModalInitialTab] = useState<Tab>('login'); // AuthModal state moved here
 
  const fetchProfile = useCallback(async () => {
    try {
      const profileData = await api.userApi.getProfile(); // Sử dụng api.userApi
      setProfile(profileData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setIsLoggedIn(false);
      setProfile(null);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchProfile();
      } else {
        setIsLoggedIn(false);
        setProfile(null);
        setLoading(false);
      }
    };

    checkAuth();
    window.addEventListener('auth-changed', checkAuth); 
    
    return () => window.removeEventListener('auth-changed', checkAuth);
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('access_token', token);
    setLoading(true);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setProfile(null);
    setShowDashboard(false); // Close dashboard on logout
  };

  const openAuthModal = useCallback((initialTab: Tab) => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    fetchProfile(); // Re-fetch profile after successful login/register
    closeAuthModal();
  }, [fetchProfile, closeAuthModal]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, profile, loading, showDashboard, setShowDashboard, login, logout, openAuthModal }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} onSuccess={handleAuthSuccess} initialTab={authModalInitialTab} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
