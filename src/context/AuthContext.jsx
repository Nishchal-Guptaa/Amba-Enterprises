import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiRequest } from '../lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { profile: nextProfile } = await apiRequest('/api/profile');
      setProfile(nextProfile || null);
      return nextProfile || null;
    } catch (error) {
      console.warn('Profile fetch notice:', error);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile();
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, fullName, phone) => {
    try {
      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone: phone || null,
        }),
      });

      // Signup normally returns no session while email confirmation is enabled.
      // Persist a returned session when the backend is configured for auto-login.
      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession(data.session);
        if (sessionError) return { data, error: sessionError };
        await fetchProfile();
      } else if (data.user) {
        // Auto-confirmed users can be signed in immediately. A failed attempt
        // is intentionally ignored because confirmation-required signups must
        // continue to the email confirmation flow.
        try {
          const signedIn = await apiRequest('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          if (signedIn.session) {
            const { error: sessionError } = await supabase.auth.setSession(signedIn.session);
            if (!sessionError) await fetchProfile();
          }
        } catch {
          // The account may still require email confirmation.
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const { error: sessionError } = await supabase.auth.setSession(data.session);
      if (sessionError) return { data, error: sessionError };
      await fetchProfile();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    let error = null;
    try {
      await apiRequest('/api/auth/signout', { method: 'POST' });
    } catch (requestError) {
      error = requestError;
    } finally {
      // Clear the browser session even when the server token is already expired.
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
      setProfile(null);
      setSession(null);
    }
    return { error };
  };

  const updateProfile = async (updates) => {
    try {
      const { profile: nextProfile } = await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      setProfile(nextProfile || null);
      return { data: nextProfile, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isCustomer: profile?.role === 'customer' && profile?.status === 'active',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
