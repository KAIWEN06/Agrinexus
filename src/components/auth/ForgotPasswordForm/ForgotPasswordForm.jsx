import { useMemo, useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../services/authService";

import Button from "../../ui/Button";
import Input from "../../ui/Input";

import { ROUTES } from "../../../constants/app/routes";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const isValid = useMemo(() => {
    return (
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  }, [email]);

  const validate = () => {
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      return false;
    }

    setError("");
    return true;
  };

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
        setLoading(true);
        setError("");
        setSuccess(false);

        await forgotPassword(email);

        setSuccess(true);

    } catch (err) {
        console.error(err);

        setError(
        err?.message ||
        "Gagal mengirim tautan reset password."
        );
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
          Lupa Kata Sandi
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
          Masukkan alamat email yang terdaftar untuk menerima
          tautan reset kata sandi.
        </p>

      </div>

      {/* Success Message */}

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
          Tautan reset kata sandi berhasil dikirim. Silakan
          periksa email Anda.
        </div>
      )}

      {/* Email */}

      <Input
        label="Alamat Email"
        type="email"
        placeholder="contoh@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);

          if (error) {
            setError("");
          }
        }}
        error={error}
      />

      {/* Submit */}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!isValid || loading}
        startContent={<Mail size={18} />}
      >
        Kirim Tautan Reset
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