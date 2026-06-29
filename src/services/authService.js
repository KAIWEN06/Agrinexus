import { supabase } from "./supabase";
import { ROUTES } from "../constants/app/routes";

/**
 * Login User
 */
export async function login(email, password, remember = false) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  /*
   * Belum digunakan.
   * Nanti bisa dipakai untuk menyimpan preferensi
   * "Remember Me" menggunakan localStorage.
   */
  void remember;

  return data;
}

/**
 * Logout User
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Get Current Session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get Current User
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Send Reset Password Email
 */
export async function forgotPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + ROUTES.RESET_PASSWORD
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update Password
 */
export async function resetPassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    throw error;
  }

  return data;
}
