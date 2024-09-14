"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

// Create context to hold user data
interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const supabase = createClient();
// Custom hook to consume the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Provider component to manage user data
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser() ;
        if (error) throw error;
        if(data.user){
            setUser(data.user);
        } 
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();

    // Optional: Set up listener for user changes (login/logout)
    const { data: authListener  } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
