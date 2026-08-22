import { supabase } from "../lib/supabase";

// Ambil semua data pengguna + email langsung dari auth.users via RPC
export const getUsers = async () => {
  const { data, error } = await supabase.rpc("get_users_with_email");

  if (error) throw error;
  return data;
};

// Update Profile & Role
export const updateUser = async (id, payload) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: payload.full_name,
      role: payload.role,
      phone: payload.phone,
      location: payload.location,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete User Profile
export const deleteUser = async id => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
  return true;
};
