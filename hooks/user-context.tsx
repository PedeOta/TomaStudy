import { auth, db } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserProfile = {
  uid: string;
  nome?: string | null;
  email?: string | null;
  [key: string]: any;
} | null;

const UserContext = createContext<{ user: UserProfile } | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        return;
      }
      try {
        const ref = doc(db, 'usuarios', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUser({ uid: u.uid, nome: data?.nome ?? null, email: u.email ?? null, ...data });
        } else {
          setUser({ uid: u.uid, nome: u.displayName ?? null, email: u.email ?? null });
        }
      } catch (e) {
        setUser({ uid: u.uid, nome: u.displayName ?? null, email: u.email ?? null });
      }
    });

    return () => unsub();
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx.user;
};
