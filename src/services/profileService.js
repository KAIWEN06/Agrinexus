import { supabase } from "./supabase";

/* =====================================================
   GET PROFILE
===================================================== */

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

/* =====================================================
   UPDATE PROFILE
===================================================== */

export async function updateProfile(userId, values) {
  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* =====================================================
   UPDATE AVATAR
===================================================== */

export async function updateAvatar(userId, file) {
  if (!file) return null;

  const extension = file.name.split(".").pop();
  const fileName = `${userId}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  await updateProfile(userId, {
    avatar_url: publicUrl,
  });

  return publicUrl;
}

/* =====================================================
   DELETE AVATAR
===================================================== */

export async function deleteAvatar(userId) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (profile?.avatar_url) {
    try {
      const fileName = profile.avatar_url.split("/").pop();

      await supabase.storage
        .from("avatars")
        .remove([fileName]);
    } catch (_) {
      // abaikan jika file tidak ditemukan
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      avatar_url: null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* =====================================================
   CHANGE PASSWORD
===================================================== */

export async function changePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data;
}

/* =====================================================
   GET CURRENT USER
===================================================== */

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}