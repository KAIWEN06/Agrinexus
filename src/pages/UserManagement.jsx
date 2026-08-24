import { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Edit2, RotateCw, Mail, Phone, MapPin, Check, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button/index";
import Input from "../components/ui/Input/index";
import Modal from "../components/ui/Modal/index";
import Badge from "../components/ui/Badge/index";

import { getUsers, updateUser, deleteUser } from "../services/userService";
import { supabase } from "../lib/supabase";

const ROLES = ["Administrator", "Developer", "TIM PKM-PI", "Petani"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State untuk Modal Tambah Akun Baru
  const [openModal, setOpenModal] = useState(false);

  // State untuk Inline Editing
  const [editingId, setEditingId] = useState(null);
  const [inlineData, setInlineData] = useState({});
  const [savingInlineId, setSavingInlineId] = useState(null);

  // Form State untuk Tambah Akun Baru
  const [newUserData, setNewUserData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Petani",
    phone: "",
    location: "",
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error(error?.message || "Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Modal Tambah User Baru
  const handleOpenAdd = () => {
    setNewUserData({ full_name: "", email: "", password: "", role: "Petani", phone: "", location: "" });
    setOpenModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!newUserData.full_name.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }

    const actionToast = toast.loading("Membuat akun baru...");

    try {
      setSubmitting(true);
      
      // Menggunakan supabase client terpisah agar session Admin yang sedang login tidak ter-override
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            full_name: newUserData.full_name,
            role: newUserData.role,
          },
        },
      });

      if (authError) throw authError;

      // Update data tambahan (phone & location) ke tabel profiles/users jika auth berhasil
      if (authData?.user?.id) {
        await updateUser(authData.user.id, {
          phone: newUserData.phone,
          location: newUserData.location,
        });
      }

      toast.success("Akun berhasil dibuat!", { id: actionToast });

      setOpenModal(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.message || "Gagal menyimpan data akun.", { id: actionToast });
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Inline Editing
  const handleStartInlineEdit = (user) => {
    setEditingId(user.id);
    setInlineData({
      full_name: user.full_name || "",
      role: user.role || "Petani",
      phone: user.phone || "",
      location: user.location || "",
    });
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
    setInlineData({});
  };

  const handleSaveInline = async (id) => {
    if (!inlineData.full_name?.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }

    try {
      setSavingInlineId(id);
      await updateUser(id, {
        full_name: inlineData.full_name,
        role: inlineData.role,
        phone: inlineData.phone,
        location: inlineData.location,
      });

      toast.success("Perubahan berhasil disimpan.");
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...inlineData } : u))
      );
      setEditingId(null);
    } catch (error) {
      toast.error(error?.message || "Gagal memperbarui data akun.");
    } finally {
      setSavingInlineId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus akun ${name || "ini"}?`)) return;

    const delToast = toast.loading("Menghapus akun...");
    try {
      await deleteUser(id);
      toast.success("Akun berhasil dihapus.", { id: delToast });
      loadUsers();
    } catch (error) {
      toast.error(error?.message || "Gagal menghapus akun.", { id: delToast });
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Administrator": return "danger";
      case "Developer": return "primary";
      case "TIM PKM-PI": return "warning";
      default: return "success";
    }
  };

  return (
    <>
      <PageHeader
        title="Manajemen Akun Pengguna"
        description="Kelola hak akses dan peran (Role) pengguna sistem AGRINEXUS."
      />

      <div className="mb-6 flex flex-col-reverse sm:flex-row justify-between gap-3 items-stretch sm:items-center">
        <Button
          variant="outline"
          onClick={loadUsers}
          startContent={<RotateCw size={16} />}
          className="w-full sm:w-auto justify-center"
        >
          Muat Ulang
        </Button>
        <Button
          onClick={handleOpenAdd}
          startContent={<UserPlus size={18} />}
          className="w-full sm:w-auto justify-center"
        >
          Tambah Akun
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border border-[var(--border)]">
        {/* TAMPILAN DESKTOP TABLE WITH INLINE EDIT */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="p-4">Pengguna</th>
                <th className="p-4">Role / Peran</th>
                <th className="p-4">Kontak & Lokasi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-[var(--muted-foreground)]">
                    Memuat data akun...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-[var(--muted-foreground)]">
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isEditingThis = editingId === u.id;
                  const isSavingThis = savingInlineId === u.id;

                  return (
                    <tr 
                      key={u.id} 
                      className={`transition-colors ${isEditingThis ? "bg-[var(--primary)]/5" : "hover:bg-[var(--muted)]/20"}`}
                    >
                      {/* Kolom Pengguna */}
                      <td className="p-4 min-w-[220px]">
                        {isEditingThis ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={inlineData.full_name}
                              onChange={(e) => setInlineData({ ...inlineData, full_name: e.target.value })}
                              placeholder="Nama lengkap"
                              className="w-full px-2.5 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                            />
                            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <Mail size={12} className="shrink-0" /> {u.email || "-"}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-[var(--foreground)] break-words">{u.full_name || "-"}</div>
                            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5 break-all">
                              <Mail size={12} className="shrink-0" /> {u.email || "-"}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Kolom Role */}
                      <td className="p-4 shrink-0">
                        {isEditingThis ? (
                          <select
                            value={inlineData.role}
                            onChange={(e) => setInlineData({ ...inlineData, role: e.target.value })}
                            className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant={getRoleBadgeVariant(u.role)}>
                            {u.role || "Petani"}
                          </Badge>
                        )}
                      </td>

                      {/* Kolom Kontak & Lokasi */}
                      <td className="p-4 space-y-1 text-xs text-[var(--muted-foreground)] min-w-[200px]">
                        {isEditingThis ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} className="shrink-0" />
                              <input
                                type="text"
                                value={inlineData.phone}
                                onChange={(e) => setInlineData({ ...inlineData, phone: e.target.value })}
                                placeholder="Telepon"
                                className="w-full px-2 py-0.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="shrink-0" />
                              <input
                                type="text"
                                value={inlineData.location}
                                onChange={(e) => setInlineData({ ...inlineData, location: e.target.value })}
                                placeholder="Lokasi"
                                className="w-full px-2 py-0.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 break-words">
                              <Phone size={12} className="shrink-0" /> {u.phone || "-"}
                            </div>
                            <div className="flex items-center gap-1.5 break-words">
                              <MapPin size={12} className="shrink-0" /> {u.location || "-"}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Kolom Aksi */}
                      <td className="p-4 text-right shrink-0">
                        {isEditingThis ? (
                          <div className="flex justify-end items-center gap-1">
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveInline(u.id)} 
                              disabled={isSavingThis}
                              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {isSavingThis ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelInlineEdit} 
                              disabled={isSavingThis}
                              className="px-2.5 py-1 text-xs"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => handleStartInlineEdit(u)}>
                              <Edit2 size={14} />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(u.id, u.full_name)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TAMPILAN MOBILE CARD VIEW WITH INLINE EDIT */}
        <div className="block md:hidden divide-y divide-[var(--border)]">
          {loading ? (
            <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              Memuat data akun...
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              Belum ada data pengguna.
            </div>
          ) : (
            users.map((u) => {
              const isEditingThis = editingId === u.id;
              const isSavingThis = savingInlineId === u.id;

              return (
                <div key={u.id} className={`p-4 space-y-3 ${isEditingThis ? "bg-[var(--primary)]/5" : "bg-[var(--background)]"}`}>
                  {isEditingThis ? (
                    /* Inline Mode HP */
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">Nama Lengkap</label>
                        <input
                          type="text"
                          value={inlineData.full_name}
                          onChange={(e) => setInlineData({ ...inlineData, full_name: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">Role</label>
                        <select
                          value={inlineData.role}
                          onChange={(e) => setInlineData({ ...inlineData, role: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">Telepon</label>
                          <input
                            type="text"
                            value={inlineData.phone}
                            onChange={(e) => setInlineData({ ...inlineData, phone: e.target.value })}
                            className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">Lokasi</label>
                          <input
                            type="text"
                            value={inlineData.location}
                            onChange={(e) => setInlineData({ ...inlineData, location: e.target.value })}
                            className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveInline(u.id)}
                          disabled={isSavingThis}
                          className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          startContent={isSavingThis ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        >
                          Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelInlineEdit}
                          disabled={isSavingThis}
                          className="flex-1 justify-center text-xs"
                          startContent={<X size={13} />}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Read Mode HP */
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-[var(--foreground)] break-words">
                            {u.full_name || "-"}
                          </h4>
                          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-1 break-all">
                            <Mail size={12} className="shrink-0" /> {u.email || "-"}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Badge variant={getRoleBadgeVariant(u.role)}>
                            {u.role || "Petani"}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[var(--border)]/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1.5 break-words">
                          <Phone size={13} className="shrink-0 text-[var(--primary)]" /> 
                          <span>{u.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 break-words">
                          <MapPin size={13} className="shrink-0 text-[var(--primary)]" /> 
                          <span>{u.location || "-"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStartInlineEdit(u)}
                          className="flex-1 justify-center text-xs"
                          startContent={<Edit2 size={13} />}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          onClick={() => handleDelete(u.id, u.full_name)}
                          className="flex-1 justify-center text-xs"
                          startContent={<Trash2 size={13} />}
                        >
                          Hapus
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

{/* MODAL FORM TAMBAH USER BARU - Hanya dirender jika openModal === true */}
{openModal && (
  <Modal
    isOpen={openModal}
    onClose={() => !submitting && setOpenModal(false)}
    title="Tambah Akun Pengguna Baru"
  >
    <form onSubmit={handleAddSubmit} className="space-y-4">
      <Input
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        value={newUserData.full_name}
        onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
        disabled={submitting}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="nama@domain.com"
        value={newUserData.email}
        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
        disabled={submitting}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Minimal 6 karakter"
        value={newUserData.password}
        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
        disabled={submitting}
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
          Peran (Role)
        </label>
        <select
          className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={newUserData.role}
          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
          disabled={submitting}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Nomor Telepon"
          placeholder="0812xxxx"
          value={newUserData.phone}
          onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
          disabled={submitting}
        />

        <Input
          label="Lokasi"
          placeholder="Kota / Wilayah"
          value={newUserData.location}
          onChange={(e) => setNewUserData({ ...newUserData, location: e.target.value })}
          disabled={submitting}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenModal(false)}
          disabled={submitting}
          className="w-full sm:w-auto justify-center"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          loading={submitting}
          className="w-full sm:w-auto justify-center"
        >
          Buat Akun
        </Button>
      </div>
    </form>
  </Modal>
)}
    </>
  );
}