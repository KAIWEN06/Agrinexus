import { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Edit2, RotateCw, Mail, Phone, MapPin, Shield } from "lucide-react";
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
  
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
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

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ id: "", full_name: "", email: "", password: "", role: "Petani", phone: "", location: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setFormData({
      id: user.id,
      full_name: user.full_name || "",
      email: user.email || "",
      password: "",
      role: user.role || "Petani",
      phone: user.phone || "",
      location: user.location || "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.full_name.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }

    const actionToast = toast.loading(isEditing ? "Memperbarui akun..." : "Membuat akun baru...");

    try {
      setSubmitting(true);

      if (isEditing) {
        await updateUser(formData.id, {
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone,
          location: formData.location,
        });
        toast.success("Data akun berhasil diperbarui!", { id: actionToast });
      } else {
        // Registrasi user baru via auth signUp (memasukkan metadata role)
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
              role: formData.role,
            },
          },
        });

        if (error) throw error;
        toast.success("Akun berhasil dibuat!", { id: actionToast });
      }

      setOpenModal(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.message || "Gagal menyimpan data akun.", { id: actionToast });
    } finally {
      setSubmitting(false);
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

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <Button
          variant="outline"
          onClick={loadUsers}
          startContent={<RotateCw size={16} />}
        >
          Muat Ulang
        </Button>
        <Button
          onClick={handleOpenAdd}
          startContent={<UserPlus size={18} />}
        >
          Tambah Akun
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
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
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--muted)]/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[var(--foreground)]">{u.full_name || "-"}</div>
                      <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {u.email || "-"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getRoleBadgeVariant(u.role)}>
                        {u.role || "Petani"}
                      </Badge>
                    </td>
                    <td className="p-4 space-y-1 text-xs text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1"><Phone size={12} /> {u.phone || "-"}</div>
                      <div className="flex items-center gap-1"><MapPin size={12} /> {u.location || "-"}</div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(u)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(u.id, u.full_name)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL FORM TAMBAH / EDIT */}
      <Modal
        isOpen={openModal}
        onClose={() => !submitting && setOpenModal(false)}
        title={isEditing ? "Edit Profil & Peran Pengguna" : "Tambah Akun Pengguna Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            disabled={submitting}
            required
          />

          {!isEditing && (
            <>
              <Input
                label="Email"
                type="email"
                placeholder="nama@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={submitting}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={submitting}
                required
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
              Peran (Role)
            </label>
            <select
              className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={submitting}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nomor Telepon"
            placeholder="08xxxxxxxxxx"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={submitting}
          />

          <Input
            label="Lokasi"
            placeholder="Kota / Kabupaten"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            disabled={submitting}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenModal(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="submit" loading={submitting}>
              {isEditing ? "Simpan Perubahan" : "Buat Akun"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}