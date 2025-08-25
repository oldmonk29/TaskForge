import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);


  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleClose = () => {
    setShowModal(false);
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-gold-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <AuthModal isOpen={showModal} onClose={handleClose} />
    </div>
  );
}
