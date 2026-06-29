import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "../components/ui/Button";
import { ROUTES } from "../constants/app/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-bold text-[var(--primary)]">
          404
        </h1>

        <h2 className="mt-6 text-2xl font-semibold text-[var(--foreground)]">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mt-3 text-[var(--text-secondary)]">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <div className="mt-8">
          <Link to={ROUTES.DASHBOARD}>
            <Button startContent={<ArrowLeft size={18} />}>
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}