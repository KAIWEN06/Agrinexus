import { useMemo, useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import PasswordInput from "../../ui/PasswordInput";

import useAuth from "../../../hooks/useAuth";

import { ROUTES } from "../../../constants/app/routes";

export default function LoginForm() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const isValid = useMemo(() => {
    return (
      form.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.password.length >= 8
    );
  }, [form]);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!form.password) {
      newErrors.password = "Kata sandi wajib diisi.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "Kata sandi minimal 8 karakter.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value =
      field === "remember"
        ? event.target.checked
        : event.target.value;

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

    const success = await login(
      form.email,
      form.password,
      form.remember
    );

    if (success) {
      navigate(ROUTES.DASHBOARD, {
        replace: true,
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "Email atau kata sandi salah.",
      }));
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
          Masuk
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
          Masuk untuk mengakses dashboard monitoring
          Agrinexus.
        </p>
      </div>

      {/* Email */}

      <Input
        label="Alamat Email"
        type="email"
        placeholder="contoh@email.com"
        value={form.email}
        onChange={handleChange("email")}
        error={errors.email}
      />

      {/* Password */}

      <PasswordInput
        label="Kata Sandi"
        placeholder="Masukkan kata sandi"
        value={form.password}
        onChange={handleChange("password")}
        error={errors.password}
      />

      {/* Remember */}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={handleChange("remember")}
          />

          Ingat saya
        </label>

        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Lupa kata sandi?
        </Link>
      </div>

      {/* Submit */}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!isValid || loading}
        startContent={<LogIn size={18} />}
      >
        Masuk
      </Button>
    </form>
  );
}