import { Outlet } from "react-router-dom";
import {
  Activity,
  ShieldCheck,
  Wifi,
  Leaf,
} from "lucide-react";

import logo from "../assets/logo/logo.png";
import loginBackground from "../assets/images/login-bg.jpg";
import FloatingLeaves from "../components/auth/FloatingLeaves";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="grid min-h-screen lg:grid-cols-[60%_40%]">

        {/* ================================================= */}
        {/* HERO SECTION */}
        {/* ================================================= */}

        <section className="relative hidden overflow-hidden lg:flex">

          {/* Background */}

          <img
            src={loginBackground}
            alt="AGRINEXUS"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-green-950/40 to-green-950/80" />

          {/* Decorative Blur */}

          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-14">

            {/* ---------------- Logo ---------------- */}

            <div>

              <img
                src={logo}
                alt="AGRINEXUS"
                className="h-40 w-40 object-contain drop-shadow-2xl"
              />

            </div>

            {/* ---------------- Hero ---------------- */}

            <div className="max-w-xl">

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-xl
                "
              >
                <Leaf size={16} />

                Smart Agriculture Platform

              </span>

              <h1 className="mt-8 text-6xl font-bold leading-tight tracking-tight text-white">

                AGRINEXUS

                <br />

                PKM-PI

              </h1>

              <p className="mt-8 text-lg leading-9 text-white/80">

                Monitor kualitas lingkungan perkebunan pisang secara
                <span className="font-semibold text-white">
                  {" "}real-time
                </span>
                {" "}
                menggunakan teknologi Internet of Things untuk
                membantu petani mengambil keputusan yang cepat,
                akurat, dan berbasis data.

              </p>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-between border-t border-white/10 pt-8">

              <div>

                <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                  Powered By
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-wide text-white">
                  AGRINEXUS
                </h2>

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* LOGIN PANEL */}
        {/* ================================================= */}

        <section className="relative flex items-center justify-center overflow-hidden bg-slate-50 px-8 py-12">

          {/* Decorative Background */}

          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-green-100 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />

          {/* Soft Fog */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white/30
              via-transparent
              to-green-100/20
              backdrop-blur-[1px]
              pointer-events-none
            "
          />

          {/* Floating Leaves */}

          <FloatingLeaves />

          {/* Login Container */}

          <div className="relative z-20 w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-10 flex justify-center lg:hidden">

              <img
                src={logo}
                alt="AGRINEXUS"
                className="h-20 w-20 object-contain"
              />

            </div>

            {/* Login Card */}

            <div
              className="
                rounded-[32px]
                border
                border-white/60
                bg-white/75
                p-10
                shadow-[0_30px_80px_rgba(15,23,42,.12)]
                backdrop-blur-2xl
              "
            >

              <Outlet />

            </div>

            {/* Footer */}

            <div className="mt-8 text-center">

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} AGRINEXUS
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Smart Plantation Monitoring Platform
              </p>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* MOBILE HERO */}
        {/* ================================================= */}

        <section className="relative flex min-h-[240px] items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 px-8 py-12 lg:hidden">

          <div className="absolute inset-0 opacity-20">
            <img
              src={loginBackground}
              alt="AGRINEXUS"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10">

            <div className="flex items-center gap-4">

              <img
                src={logo}
                alt="AGRINEXUS"
                className="h-16 w-16 object-contain"
              />

              <div>

                <h2 className="text-3xl font-bold text-white">
                  AGRINEXUS
                </h2>

                <p className="text-sm text-white/80">
                  Smart Plantation Monitoring
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}