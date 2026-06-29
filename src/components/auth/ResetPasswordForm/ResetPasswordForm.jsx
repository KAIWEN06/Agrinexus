import { useMemo, useState } from "react";
import { CheckCircle2, ArrowLeft, KeyRound} from "lucide-react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { resetPassword } from "../../../services/authService";

import PasswordInput from "../../ui/PasswordInput";
import Button from "../../ui/Button";

import { ROUTES } from "../../../constants/app/routes";

export default function ResetPasswordForm() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.password.length >= 8 &&
      form.confirmPassword.length >= 8 &&
      form.password === form.confirmPassword
    );
  }, [form]);

  const validate = () => {
    const newErrors = {};

    if (!form.password) {
      newErrors.password = "Kata sandi baru wajib diisi.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "Kata sandi minimal 8 karakter.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword =
        "Konfirmasi kata sandi wajib diisi.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        "Konfirmasi kata sandi tidak sesuai.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
        setLoading(true);

        setErrors({});

        setSuccess(false);

        await resetPassword(form.password);

        setSuccess(true);

        setTimeout(() => {
        navigate(ROUTES.LOGIN, {
            replace: true,
        });
        }, 2000);

    } catch (error) {
        console.error(error);

        setErrors({
        general:
            error?.message ||
            "Gagal mengubah kata sandi. Silakan coba lagi.",
        });
    } finally {
        setLoading(false);
    }
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      {/* Header */}

      <div className="space-y-2 text-center">

        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Reset Kata Sandi
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
          Masukkan kata sandi baru untuk akun Anda.
        </p>

      </div>

      {/* Success */}

      {success && (
        <div
          className="
            rounded-xl
            border
            border-green-200
            bg-green-50
            p-4
            text-sm
            text-green-700
          "
        >
          <div className="flex items-center gap-2">

            <CheckCircle2 size={18} />

            Kata sandi berhasil diperbarui.

          </div>
        </div>
      )}

      {/* Error */}

      {errors.general && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          {errors.general}
        </div>
      )}

      {/* Password */}

      <PasswordInput
        label="Kata Sandi Baru"
        placeholder="Masukkan kata sandi baru"
        value={form.password}
        onChange={handleChange("password")}
        error={errors.password}
      />

      {/* Confirm */}

      <PasswordInput
        label="Konfirmasi Kata Sandi"
        placeholder="Ulangi kata sandi baru"
        value={form.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={errors.confirmPassword}
      />

      {/* Submit */}

        <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!isValid || loading}
        startContent={<KeyRound size={18} />}
        >
        Perbarui Kata Sandi
        </Button>

      {/* Back */}

      <div className="flex justify-center">

        <Link
          to={ROUTES.LOGIN}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[var(--primary)]
            hover:underline
          "
        >
          <ArrowLeft size={16} />

          Kembali ke Login

        </Link>

      </div>

    </form>
  );
}