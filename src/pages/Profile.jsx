import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  RotateCw,
  AlertCircle,
  CheckCircle2,
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

/* =====================================================
    HELPER FUNCTIONS
===================================================== */
const formatDate = (date) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

const getInitials = (name = "") => {
  if (!name || typeof name !== "string") return "U";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function Profile() {
  /* =====================================================
      REFS & CONTEXT
  ===================================================== */
  const fileInputRef = useRef(null);
  const { user, refreshUser } = useAuth();
  const userId = user?.id;

  /* =====================================================
      STATE
  ===================================================== */
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  // File blob preview URL tracking for memory cleanup
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");

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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =====================================================
      MEMORY CLEANUP FOR OBJECT URL
  ===================================================== */
  useEffect(() => {
    return () => {
      if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  /* =====================================================
      LOAD PROFILE
  ===================================================== */
  const loadProfile = useCallback(async (isManualReload = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      if (!isManualReload) setLoading(true);
      setErrorState(null);

      const data = await getProfile(userId);
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          location: data.location || "",
          role: data.role || "Administrator",
          avatar_url: data.avatar_url || "",
          created_at: data.created_at || "",
        });
      }
      if (isManualReload) {
        toast.success("Data profil berhasil dimuat ulang.");
      }
    } catch (error) {
      console.error("Gagal memuat profile:", error);
      const errorMessage = error?.message || "Gagal memuat data profil.";
      setErrorState(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, user?.email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* =====================================================
      HANDLERS
  ===================================================== */
  const handleChange = useCallback((field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePasswordChange = useCallback((field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetPasswordForm = useCallback(() => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /* =====================================================
      AVATAR ACTIONS
  ===================================================== */
  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input value early so same file re-selection triggers onChange
    event.target.value = "";

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format file tidak didukung. Harap upload format JPG, PNG, WEBP, atau GIF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran gambar terlalu besar. Maksimal 2 MB.");
      return;
    }

    // Clean up previous blob URL if exists
    if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    const uploadToast = toast.loading("Sedang mengunggah foto profil...");

    try {
      setUploadingAvatar(true);
      const avatarUrl = await updateAvatar(userId, file);

      setProfile((prev) => ({
        ...prev,
        avatar_url: avatarUrl,
      }));
      
      if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl("");

      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Foto profil berhasil diperbarui!", { id: uploadToast });
    } catch (error) {
      console.error("Gagal unggah foto:", error);
      toast.error(
        error?.message || "Gagal mengunggah foto profil. Pastikan storage bucket 'avatars' sudah siap.",
        { id: uploadToast }
      );
      setLocalPreviewUrl("");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile.avatar_url || removingAvatar) return;

    const deleteToast = toast.loading("Sedang menghapus foto profil...");

    try {
      setRemovingAvatar(true);
      await deleteAvatar(userId);

      if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl("");

      setProfile((prev) => ({
        ...prev,
        avatar_url: "",
      }));

      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Foto profil berhasil dihapus.", { id: deleteToast });
    } catch (error) {
      console.error("Gagal hapus foto:", error);
      toast.error(error?.message || "Gagal menghapus foto profil.", { id: deleteToast });
    } finally {
      setRemovingAvatar(false);
    }
  };

  /* =====================================================
      SAVE PROFILE
  ===================================================== */
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (savingProfile) return;

    const trimmedName = profile.full_name?.trim();
    if (!trimmedName) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }

    const saveToast = toast.loading("Menyimpan perubahan profil...");

    try {
      setSavingProfile(true);

      const updatedData = await updateProfile(userId, {
        full_name: trimmedName,
        phone: (profile.phone || "").trim(),
        location: (profile.location || "").trim(),
      });

      setProfile((prev) => ({
        ...prev,
        full_name: updatedData?.full_name ?? trimmedName,
        phone: updatedData?.phone ?? (profile.phone || "").trim(),
        location: updatedData?.location ?? (profile.location || "").trim(),
        updated_at: updatedData?.updated_at,
      }));

      if (refreshUser) {
        await refreshUser();
      }
      toast.success("Perubahan profil berhasil disimpan!", { id: saveToast });
    } catch (error) {
      console.error("Gagal simpan profil:", error);
      toast.error(error?.message || "Gagal menyimpan perubahan profil.", { id: saveToast });
    } finally {
      setSavingProfile(false);
    }
  };

  /* =====================================================
      CHANGE PASSWORD
  ===================================================== */
  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (savingPassword) return;

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

      await changePassword(passwordForm.newPassword);

      toast.success("Password Anda berhasil diperbarui!", { id: passwordToast });
      resetPasswordForm();
      setOpenPasswordModal(false);
    } catch (error) {
      console.error("Gagal ubah password:", error);
      toast.error(error?.message || "Gagal memperbarui password akun.", { id: passwordToast });
    } finally {
      setSavingPassword(false);
    }
  };

  /* =====================================================
      COMPUTED MEMO
  ===================================================== */
  const avatarSource = useMemo(() => {
    if (localPreviewUrl) return localPreviewUrl;
    return profile.avatar_url || "";
  }, [localPreviewUrl, profile.avatar_url]);

  const isAnyActionBusy = loading || savingProfile || uploadingAvatar || removingAvatar || savingPassword;

  /* =====================================================
      RENDER STATES
  ===================================================== */
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profil"
          description="Kelola informasi akun dan akun AGRINEXUS Anda."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4 animate-pulse">
              <div className="h-28 w-full bg-[var(--muted)]/40 rounded-lg" />
              <div className="h-24 w-24 rounded-full bg-[var(--muted)]/40 -mt-12 border border-[var(--border)]" />
              <div className="h-5 w-32 bg-[var(--muted)]/40 rounded" />
              <div className="h-4 w-24 bg-[var(--muted)]/40 rounded" />
              <div className="w-full space-y-3 pt-6">
                <div className="h-4 w-full bg-[var(--muted)]/40 rounded" />
                <div className="h-4 w-full bg-[var(--muted)]/40 rounded" />
                <div className="h-4 w-full bg-[var(--muted)]/40 rounded" />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-2 p-6">
            <div className="space-y-6 animate-pulse">
              <div className="h-6 w-48 bg-[var(--muted)]/40 rounded" />
              <div className="grid gap-5 md:grid-cols-2">
                <div className="h-10 bg-[var(--muted)]/40 rounded" />
                <div className="h-10 bg-[var(--muted)]/40 rounded" />
                <div className="h-10 bg-[var(--muted)]/40 rounded" />
                <div className="h-10 bg-[var(--muted)]/40 rounded" />
              </div>
              <div className="h-10 bg-[var(--muted)]/40 rounded" />
              <div className="flex justify-end gap-3 pt-4">
                <div className="h-10 w-28 bg-[var(--muted)]/40 rounded" />
                <div className="h-10 w-36 bg-[var(--muted)]/40 rounded" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (errorState && !profile.email && !profile.full_name) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profil"
          description="Kelola informasi akun dan akun AGRINEXUS Anda."
        />
        <Card className="p-8 text-center max-w-xl mx-auto my-12">
          <div className="flex justify-center mb-4 text-[var(--destructive,#ef4444)]">
            <AlertCircle size={48} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Gagal Memuat Profil
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            {errorState}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => loadProfile(false)}
            startContent={<RotateCw size={16} />}
            className="min-h-[44px]"
          >
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Profil"
        description="Kelola informasi akun dan akun AGRINEXUS Anda."
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* PROFILE CARD */}
        <Card className="overflow-hidden p-0">
          <div className="h-28 bg-gradient-to-r from-[var(--primary,#10b981)] via-emerald-600 to-green-600" />
          <div className="relative px-6 pb-6">
            <div className="-mt-14 flex justify-center">
              <div className="relative group">
                <Avatar
                  src={avatarSource}
                  alt={profile.full_name || "User Avatar"}
                  name={getInitials(profile.full_name)}
                  size="2xl"
                  className="border-2 border-[var(--background)] shadow-sm object-cover"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  onChange={handleAvatarChange}
                  aria-label="Upload foto profil"
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isAnyActionBusy}
                  aria-label="Ganti foto profil"
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary,#10b981)] text-white shadow transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px] min-w-[44px]"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {profile.full_name || "-"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {profile.role || "Administrator"}
              </p>
              <div className="mt-3 flex justify-center">
                <Badge variant="success">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={uploadingAvatar}
                disabled={isAnyActionBusy}
                startContent={<Camera size={16} />}
                onClick={openFilePicker}
                className="min-h-[44px] px-4"
              >
                Ganti Foto
              </Button>
              {profile.avatar_url && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  loading={removingAvatar}
                  disabled={isAnyActionBusy}
                  startContent={<Trash2 size={16} />}
                  onClick={handleDeleteAvatar}
                  className="min-h-[44px] px-4"
                >
                  Hapus
                </Button>
              )}
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted-foreground)]">Email</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{profile.email || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted-foreground)]">Nomor Telepon</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{profile.phone || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted-foreground)]">Lokasi</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{profile.location || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted-foreground)]">Peran</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{profile.role || "Administrator"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted-foreground)]">Bergabung</p>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{formatDate(profile.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* FORM PROFIL */}
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Informasi Profil</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Perbarui informasi pribadi dan kontak akun AGRINEXUS Anda.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={profile.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                disabled={isAnyActionBusy}
                required
                aria-required="true"
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                disabled
                helperText="Email diikat pada autentikasi dan tidak dapat diubah di sini."
              />
              <Input
                label="Nomor Telepon"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isAnyActionBusy}
              />
              <Input
                label="Lokasi"
                placeholder="Kota / Kabupaten"
                value={profile.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                disabled={isAnyActionBusy}
              />
            </div>

            <Input
              label="Peran / Hak Akses"
              value={profile.role || "Administrator"}
              disabled
              helperText="Peran diatur oleh administrator sistem."
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-[var(--border)] pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isAnyActionBusy}
                onClick={() => loadProfile(true)}
                startContent={<RotateCw size={16} />}
                className="min-h-[44px] w-full sm:w-auto"
              >
                Muat Ulang
              </Button>
              <Button
                type="submit"
                loading={savingProfile}
                disabled={isAnyActionBusy}
                startContent={<Save size={18} />}
                className="min-h-[44px] w-full sm:w-auto"
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
            if (!savingPassword) {
              setOpenPasswordModal(false);
              resetPasswordForm();
            }
          }}
          title="Ubah Password Akun"
          size="md"
        >
          <form onSubmit={handleChangePassword} className="space-y-5 p-1">
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Masukkan password baru Anda di bawah ini. Gunakan minimal 6 karakter dengan kombinasi yang aman.
            </p>
            
            <PasswordInput
              label="Password Baru"
              placeholder="Masukkan password baru"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              disabled={savingPassword}
              required
              aria-required="true"
            />

            <PasswordInput
              label="Konfirmasi Password Baru"
              placeholder="Ulangi password baru"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              disabled={savingPassword}
              required
              aria-required="true"
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                disabled={savingPassword}
                onClick={() => {
                  setOpenPasswordModal(false);
                  resetPasswordForm();
                }}
                className="min-h-[44px] w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={savingPassword}
                disabled={savingPassword}
                startContent={<KeyRound size={18} />}
                className="min-h-[44px] w-full sm:w-auto"
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