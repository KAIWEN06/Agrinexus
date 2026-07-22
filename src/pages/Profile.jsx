import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Trash2,
  Save,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";

import PageHeader from "../components/common/PageHeader";

import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar/index";
import Badge from "../components/ui/Badge/index";
import Button from "../components/ui/Button/index";
import Input from "../components/ui/Input/index";
import Modal from "../components/ui/Modal/index";
import PasswordInput from "../components/ui/PasswordInput/index";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  changePassword,
} from "../services/profileService";

function Profile() {
  /* =====================================================
      REFS
  ===================================================== */
  const fileInputRef = useRef(null);

  /* =====================================================
      AUTH
  ===================================================== */
  const { user, refreshUser } = useAuth();

  /* =====================================================
      STATE
  ===================================================== */
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    avatar_url: "",
    created_at: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", // Opsional untuk UI, Supabase hanya butuh password baru
    newPassword: "",
    confirmPassword: "",
  });

  /* =====================================================
      LOAD PROFILE
  ===================================================== */
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getProfile(user.id);
      setProfile(data);
      setPreviewAvatar(data.avatar_url || "");
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data profil.");
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
      HANDLE INPUT
  ===================================================== */
  function handleChange(field, value) {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handlePasswordChange(field, value) {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /* =====================================================
      AVATAR ACTIONS WITH TOAST FEEDBACK
  ===================================================== */
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file tidak didukung. Harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar. Maksimal 2 MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewAvatar(localPreview);

    // Toast loading custom untuk proses upload
    const uploadToast = toast.loading("Sedang mengunggah foto profil...");

    try {
      setUploadingAvatar(true);
      const avatarUrl = await updateAvatar(user.id, file);

      setProfile((prev) => ({
        ...prev,
        avatar_url: avatarUrl,
      }));
      setPreviewAvatar(avatarUrl);
      await refreshUser?.();

      toast.success("Foto profil berhasil diperbarui!", { id: uploadToast });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto profil. Pastikan storage bucket 'avatars' sudah siap.", { id: uploadToast });
      setPreviewAvatar(profile.avatar_url);
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  async function handleDeleteAvatar() {
    if (!profile.avatar_url) return;

    const deleteToast = toast.loading("Sedang menghapus foto profil...");

    try {
      setRemovingAvatar(true);
      await deleteAvatar(user.id);

      setProfile((prev) => ({
        ...prev,
        avatar_url: "",
      }));
      setPreviewAvatar("");
      await refreshUser?.();

      toast.success("Foto profil berhasil dihapus.", { id: deleteToast });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus foto profil.", { id: deleteToast });
    } finally {
      setRemovingAvatar(false);
    }
  }

  /* =====================================================
      SAVE PROFILE WITH TOAST FEEDBACK
  ===================================================== */
  async function handleSaveProfile(event) {
    event.preventDefault();

    if (!profile.full_name?.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }

    const saveToast = toast.loading("Menyimpan perubahan profil...");

    try {
      setSavingProfile(true);

      const updatedData = await updateProfile(user.id, {
        full_name: profile.full_name.trim(),
        phone: (profile.phone || "").trim(),
        location: (profile.location || "").trim(),
      });

      setProfile((prev) => ({
        ...prev,
        full_name: updatedData.full_name,
        phone: updatedData.phone,
        location: updatedData.location,
        updated_at: updatedData.updated_at,
      }));

      await refreshUser?.();
      toast.success("Perubahan profil berhasil disimpan!", { id: saveToast });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan profil.", { id: saveToast });
    } finally {
      setSavingProfile(false);
    }
  }

  /* =====================================================
      CHANGE PASSWORD WITH VALIDATION & TOAST FEEDBACK
  ===================================================== */
  async function handleChangePassword(event) {
    event.preventDefault();

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Field password baru dan konfirmasi wajib diisi.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal harus 6 karakter.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    const passwordToast = toast.loading("Sedang memperbarui password Anda...");

    try {
      setSavingPassword(true);

      // Memanggil fungsi dari profileService
      await changePassword(passwordForm.newPassword);

      toast.success("Password Anda berhasil diperbarui!", { id: passwordToast });
      resetPasswordForm();
      setOpenPasswordModal(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Gagal memperbarui password akun.", { id: passwordToast });
    } finally {
      setSavingPassword(false);
    }
  }

  /* =====================================================
      HELPERS
  ===================================================== */
  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function getInitials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  function getAvatarSource() {
    if (previewAvatar) return previewAvatar;
    if (profile.avatar_url) return profile.avatar_url;
    return "";
  }

  function resetPasswordForm() {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  function handleReloadProfile() {
    loadProfile();
    toast.success("Data profil dimuat ulang.");
  }

  return (
    <>
      <PageHeader
        title="Profil"
        description="Kelola informasi akun dan akun AGRINEXUS Anda."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PROFILE CARD */}
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[var(--primary)] via-green-600 to-emerald-500" />
          <div className="relative px-6 pb-6">
            <div className="-mt-14 flex justify-center">
              <div className="relative">
                <Avatar
                  src={getAvatarSource()}
                  alt={profile.full_name}
                  name={getInitials(profile.full_name)}
                  size="2xl"
                  className="border-4 border-white shadow-lg"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition hover:scale-105"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {profile.full_name || "-"}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {profile.role || "Administrator"}
              </p>
              <div className="mt-4 flex justify-center">
                <Badge variant="success">Aktif</Badge>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                size="sm"
                variant="outline"
                loading={uploadingAvatar}
                startContent={<Camera size={16} />}
                onClick={openFilePicker}
              >
                Ganti Foto
              </Button>
              {profile.avatar_url && (
                <Button
                  size="sm"
                  variant="danger"
                  loading={removingAvatar}
                  startContent={<Trash2 size={16} />}
                  onClick={handleDeleteAvatar}
                >
                  Hapus
                </Button>
              )}
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Email</p>
                  <p className="text-sm font-medium">{profile.email || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Nomor Telepon</p>
                  <p className="text-sm font-medium">{profile.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Lokasi</p>
                  <p className="text-sm font-medium">{profile.location || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Peran</p>
                  <p className="text-sm font-medium">{profile.role || "Administrator"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Bergabung</p>
                  <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* FORM PROFIL */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-semibold">Informasi Profil</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Perbarui informasi pribadi akun AGRINEXUS Anda.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={profile.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                disabled
                helperText="Email tidak dapat diubah."
              />
              <Input
                label="Nomor Telepon"
                placeholder="08xxxxxxxxxx"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <Input
                label="Lokasi"
                placeholder="Kota / Kabupaten"
                value={profile.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <Input
              label="Peran"
              value={profile.role || "Administrator"}
              disabled
            />

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <p className="text-sm text-[var(--text-secondary)]">Status Akun</p>
                <div className="mt-2">
                  <Badge variant="success">Aktif</Badge>
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--text-secondary)]">Bergabung</p>
                <p className="mt-2 font-semibold">{formatDate(profile.created_at)}</p>
              </Card>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReloadProfile}
              >
                Muat Ulang
              </Button>
              <Button
                type="submit"
                loading={savingProfile}
                startContent={<Save size={18} />}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        {/* MODAL UBAH PASSWORD */}
        <Modal
          isOpen={openPasswordModal}
          onClose={() => {
            setOpenPasswordModal(false);
            resetPasswordForm();
          }}
          title="Ubah Password Akun"
          size="md"
        >
          <form onSubmit={handleChangePassword} className="space-y-5">
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Masukkan password baru Anda di bawah ini untuk mengganti password lama.
            </p>
            
            <PasswordInput
              label="Password Baru"
              placeholder="Masukkan password baru"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              required
            />

            <PasswordInput
              label="Konfirmasi Password Baru"
              placeholder="Ulangi password baru"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenPasswordModal(false);
                  resetPasswordForm();
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={savingPassword}
                startContent={<KeyRound size={18} />}
              >
                Simpan Password Baru
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Profile;