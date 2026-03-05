'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserData } from '@/lib/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: (nome: string, email: string, senha: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    async function login(email: string, senha: string) {
        await signInWithEmailAndPassword(auth, email, senha);
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        // Create profile if first time
        const existing = await getUserData(cred.user.uid);
        if (!existing) {
            await createUserProfile(
                cred.user.uid,
                cred.user.displayName || 'Jogador',
                cred.user.email || ''
            );
        }
    }

    async function signup(nome: string, email: string, senha: string) {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        await createUserProfile(cred.user.uid, nome, email);
    }

    async function logout() {
        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
