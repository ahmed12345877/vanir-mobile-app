import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import {
  restoreServerSession,
  signInWithEmail,
  signInWithGoogle,
  signOutEverywhere,
  signUpWithEmail,
} from '../services/firebase';

type AuthContextValue = {
  user: unknown | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation();
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(
    async (currentUser?: FirebaseAuthTypes.User | null) => {
      if (currentUser) {
        await restoreServerSession(currentUser);
      }
      await meQuery.refetch();
    },
    [meQuery],
  );

  useEffect(() => {
    const unsubscribe = restoreServerSessionListener(async currentUser => {
      setFirebaseUser(currentUser);
      try {
        await refreshSession(currentUser);
        setError(null);
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : 'Failed to restore your session.');
      } finally {
        setBootstrapped(true);
      }
    });

    return unsubscribe;
  }, [refreshSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const currentUser = await signInWithEmail(email, password);
      await refreshSession(currentUser);
    },
    [refreshSession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      const currentUser = await signUpWithEmail(email, password, name);
      await refreshSession(currentUser);
    },
    [refreshSession],
  );

  const signInGoogle = useCallback(async () => {
    setError(null);
    const currentUser = await signInWithGoogle();
    await refreshSession(currentUser);
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    setError(null);
    await logoutMutation.mutateAsync().catch(() => undefined);
    await signOutEverywhere();
    setFirebaseUser(null);
    queryClient.clear();
    utils.auth.me.setData(undefined, null);
  }, [logoutMutation, queryClient, utils.auth.me]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      firebaseUser,
      isAuthenticated: Boolean(meQuery.data),
      isLoading: !bootstrapped || meQuery.isFetching || logoutMutation.isPending,
      error,
      signIn,
      signUp,
      signInGoogle,
      signOut,
    }),
    [bootstrapped, error, firebaseUser, logoutMutation.isPending, meQuery.data, meQuery.isFetching, signIn, signInGoogle, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}

function restoreServerSessionListener(
  onChange: (user: FirebaseAuthTypes.User | null) => Promise<void>,
) {
  return auth().onAuthStateChanged(user => {
    onChange(user).catch(() => undefined);
  });
}
