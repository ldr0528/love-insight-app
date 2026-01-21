import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
      navigate('/');
    }
  }, [isAuthenticated, navigate, openAuthModal]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
