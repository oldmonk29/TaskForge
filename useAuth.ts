import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface AppUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: string;
  walletBalancePaise: number;
  bonusCredited: boolean;
  streakCount: number;
  lastLoginAt: string | null;
  createdAt: string;
}

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Call first login bonus API to get/create user and handle bonus
          const response = await apiRequest('POST', '/api/auth/first-login-bonus', {
            firebaseUid: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0] || 'User'
          });
          
          const data = await response.json();
          setAppUser(data.user);
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    firebaseUser,
    appUser,
    loading,
    isAuthenticated: !!firebaseUser,
  };
}
