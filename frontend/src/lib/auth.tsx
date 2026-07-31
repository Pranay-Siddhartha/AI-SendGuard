'use client';
import React, { createContext, useContext, ReactNode } from 'react';

export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string;
    role: string;
    organization?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    authenticate: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Return a dummy authenticated user
    const dummyUser: User = {
        id: 1,
        email: 'admin@sendguard.ai',
        username: 'admin',
        full_name: 'Admin User',
        role: 'admin',
        organization: 'SendGuard'
    };

    return (
        <AuthContext.Provider value={{
            user: dummyUser,
            token: "dummy-token",
            authenticate: () => {},
            logout: () => {}
        }}>
            {children}
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
