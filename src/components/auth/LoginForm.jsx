import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO:
    // Login menggunakan Supabase Auth
  };

  return (
    <div className="login-card">
      {/* Header */}
      <div className="login-header">
        <div className="login-icon">
          <ShieldCheck size={28} strokeWidth={2} />
        </div>

        <h2>Selamat Datang</h2>

        <p className="subtitle">
          Masuk untuk mengakses dashboard monitoring Agrinexus.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email</label>

          <div className="input-box">
            <Mail size={18} />

            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Kata Sandi</label>

          <div className="input-box">
            <Lock size={18} />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="eye-btn"
              aria-label={
                showPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Opsi */}
        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" />

            <span>Ingat saya</span>
          </label>

          <button
            type="button"
            className="forgot-password"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Tombol */}
        <button
          type="submit"
          className="login-btn"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}