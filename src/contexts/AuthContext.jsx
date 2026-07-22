import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authService from "../services/authService";
import * as profileService from "../services/profileService";

import { supabase } from "../services/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /*
  =========================================
  STATE
  =========================================
  */

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
  =========================================
  LOAD PROFILE
  =========================================
  */

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    try {
      const profileData =
        await profileService.getProfile(authUser.id);

      setProfile({
        ...profileData,
        email: authUser.email,
      });
    } catch (err) {
      console.error("Profile Error :", err);

      setProfile({
        id: authUser.id,
        email: authUser.email,
        full_name: "",
        phone: "",
        location: "",
        role: "",
        avatar_url: null,
      });
    }
  }, []);

  /*
  =========================================
  RESTORE SESSION
  =========================================
  */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        setLoading(true);

        setError(null);

        const data =
          await authService.getSession();

        if (!mounted) return;

        const authUser =
          data.session?.user ?? null;

        setSession(data.session);

        setUser(authUser);

        await loadProfile(authUser);
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setSession(null);

        setUser(null);

        setProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const authUser =
            session?.user ?? null;

          setSession(session);

          setUser(authUser);

          await loadProfile(authUser);
        }
      );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, [loadProfile]);

  /*
  =========================================
  LOGIN
  =========================================
  */

  const login = useCallback(
    async (
      email,
      password,
      remember
    ) => {
      try {
        setLoading(true);

        setError(null);

        const data =
          await authService.login(
            email,
            password,
            remember
          );

        setSession(data.session);

        setUser(data.user);

        await loadProfile(data.user);

        return true;
      } catch (err) {
        console.error(err);

        setError(err.message);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadProfile]
  );

  /*
  =========================================
  LOGOUT
  =========================================
  */

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      await authService.logout();

      setSession(null);

      setUser(null);

      setProfile(null);

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
  =========================================
  FORGOT PASSWORD
  =========================================
  */

  const forgotPassword =
    useCallback(async (email) => {
      try {
        setLoading(true);

        setError(null);

        await authService.forgotPassword(
          email
        );

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
  =========================================
  RESET PASSWORD
  =========================================
  */

  const resetPassword =
    useCallback(async (password) => {
      try {
        setLoading(true);

        setError(null);

        await authService.resetPassword(
          password
        );

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
  =========================================
  REFRESH PROFILE
  =========================================
  */

  const refreshProfile =
    useCallback(async () => {
      if (!user) return;

      await loadProfile(user);
    }, [user, loadProfile]);

  /*
  =========================================
  CONTEXT VALUE
  =========================================
  */

  const value = useMemo(
    () => ({
      user,

      profile,

      session,

      loading,

      error,

      isAuthenticated:
        Boolean(user),

      login,

      logout,

      forgotPassword,

      resetPassword,

      refreshProfile,

      setProfile,
    }),
    [
      user,
      profile,
      session,
      loading,
      error,
      login,
      logout,
      forgotPassword,
      resetPassword,
      refreshProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}