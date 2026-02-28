'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would validate credentials with a backend
      // For demo purposes, we'll just accept any valid email
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check if user exists in localStorage (simulating a database)
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      const userData = storedUsers[email];

      if (!userData || userData.password !== password) {
        throw new Error('Invalid email or password');
      }

      setUser({
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePhoto: userData.profilePhoto,
        setupComplete: userData.setupComplete,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (storedUsers[email]) {
        throw new Error('Email already registered');
      }

      // Store new user in localStorage (with setupComplete = false)
      storedUsers[email] = {
        email,
        password,
        setupComplete: false,
      };
      localStorage.setItem('users', JSON.stringify(storedUsers));

      // Set user state but mark as needing setup
      setUser({
        email,
        setupComplete: false,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeSetup = useCallback(
    (data: { firstName: string; lastName: string; profilePhoto?: string }) => {
      if (!user) return;

      // Update user in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      storedUsers[user.email] = {
        ...storedUsers[user.email],
        firstName: data.firstName,
        lastName: data.lastName,
        profilePhoto: data.profilePhoto,
        setupComplete: true,
      };
      localStorage.setItem('users', JSON.stringify(storedUsers));

      // Update user state
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        profilePhoto: data.profilePhoto,
        setupComplete: true,
      });
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, completeSetup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
