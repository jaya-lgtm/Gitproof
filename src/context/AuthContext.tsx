"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GitHubUser } from "@/lib/github";

export interface SavedProof {
  username: string;
  user: GitHubUser;
  savedAt: string;
}

interface AuthContextType {
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: GitHubUser) => void;
  logout: () => void;
  savedProofs: SavedProof[];
  saveProof: (userToSave: GitHubUser) => boolean; // returns true if saved, false if already saved
  removeSavedProof: (username: string) => void;
  isProofSaved: (username: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "gitproof_user_session";
const SAVED_PROOFS_STORAGE_KEY = "gitproof_saved_proofs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedProofs, setSavedProofs] = useState<SavedProof[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedProofs = localStorage.getItem(SAVED_PROOFS_STORAGE_KEY);
      if (storedProofs) {
        setSavedProofs(JSON.parse(storedProofs));
      }
    } catch {
      // Ignore JSON parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: GitHubUser) => {
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const saveProof = (userToSave: GitHubUser): boolean => {
    if (savedProofs.some((p) => p.username.toLowerCase() === userToSave.login.toLowerCase())) {
      return false;
    }

    const newProof: SavedProof = {
      username: userToSave.login,
      user: userToSave,
      savedAt: new Date().toISOString(),
    };

    const updated = [newProof, ...savedProofs];
    setSavedProofs(updated);
    localStorage.setItem(SAVED_PROOFS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  };

  const removeSavedProof = (username: string) => {
    const updated = savedProofs.filter(
      (p) => p.username.toLowerCase() !== username.toLowerCase()
    );
    setSavedProofs(updated);
    localStorage.setItem(SAVED_PROOFS_STORAGE_KEY, JSON.stringify(updated));
  };

  const isProofSaved = (username: string): boolean => {
    return savedProofs.some(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        savedProofs,
        saveProof,
        removeSavedProof,
        isProofSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
