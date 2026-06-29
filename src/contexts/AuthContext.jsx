import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authService from "../services/authService";
import { supabase } from "../services/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Restore Session + Listen Auth Changes
   */
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        setLoading(true);
        setError(null);

        const data = await authService.getSession();

        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Login
   */
  const login = useCallback(async (email, password, remember) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.login(
        email,
        password,
        remember
      );

      setSession(data.session);
      setUser(data.user);

      return true;
    } catch (err) {
      console.error(err);

      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();

      setSession(null);
      setUser(null);

      return true;
    } catch (err) {
      console.error(err);

      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Forgot Password
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);

      await authService.forgotPassword(email);

      return true;
    } catch (err) {
      console.error(err);

      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Reset Password
   */
  const resetPassword = useCallback(async (password) => {
    try {
      setLoading(true);
      setError(null);

      await authService.resetPassword(password);

      return true;
    } catch (err) {
      console.error(err);

      setError(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,

      loading,
      error,

      isAuthenticated: Boolean(user),

      login,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [
      user,
      session,
      loading,
      error,
      login,
      logout,
      forgotPassword,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}