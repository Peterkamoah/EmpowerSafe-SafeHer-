import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from './AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async (uid: string) => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'Users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      } else {
        // Create new user profile if it doesn't exist
        const newProfile: UserProfile = {
          uid,
          email: user?.email || '',
          displayName: user?.displayName || '',
          emergencyContacts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(doc(db, 'Users', uid), {
          ...newProfile,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'Users', user.uid), {
        ...updatedProfile,
        updatedAt: new Date(),
      }, { merge: true });
      
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const value = {
    userProfile,
    loading,
    updateProfile,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}