import { AdminDashboard } from '../components/admin/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function AdminPage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not loaded, no profile, or not an admin
    if (!loading && (!profile || profile.role !== 'ROLE_ADMIN')) {
      navigate('/'); // Redirect to home page
    }
  }, [profile, loading, navigate]);

  if (loading || !profile || profile.role !== 'ROLE_ADMIN') {
    return <div>Loading or redirecting...</div>; // Or a more user-friendly loading/unauthorized message
  }

  return <AdminDashboard />;
}