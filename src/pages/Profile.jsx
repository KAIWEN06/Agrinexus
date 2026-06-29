import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  KeyRound,
  Save,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";

import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Profile() {
  return (
    <>
      <PageHeader
        title="Profil"
        description="Kelola informasi akun dan data pribadi Anda."
      />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* =======================================
            Profile Card
        ======================================= */}

        <Card className="p-6">

          <div className="flex flex-col items-center">

            <Avatar
              size="xl"
              name="Kevin Sondakh"
            />

            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
              Kevin Sondakh
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Administrator
            </p>

            <div className="mt-4">
              <Badge variant="success">
                Active
              </Badge>
            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">
              <Mail
                size={18}
                className="text-[var(--primary)]"
              />

              <span className="text-sm text-[var(--text-secondary)]">
                admin@agrinexus.id
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={18}
                className="text-[var(--primary)]"
              />

              <span className="text-sm text-[var(--text-secondary)]">
                +62 812-3456-7890
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                size={18}
                className="text-[var(--primary)]"
              />

              <span className="text-sm text-[var(--text-secondary)]">
                Manado, Sulawesi Utara
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck
                size={18}
                className="text-[var(--primary)]"
              />

              <span className="text-sm text-[var(--text-secondary)]">
                Administrator
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar
                size={18}
                className="text-[var(--primary)]"
              />

              <span className="text-sm text-[var(--text-secondary)]">
                Bergabung Juni 2026
              </span>
            </div>

          </div>

        </Card>

        {/* =======================================
            Form
        ======================================= */}

        <Card className="p-6 lg:col-span-2">

          <h2 className="mb-6 text-xl font-semibold">
            Informasi Profil
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Nama Lengkap"
              value="Kevin Sondakh"
              readOnly
            />

            <Input
              label="Alamat Email"
              value="admin@agrinexus.id"
              readOnly
            />

            <Input
              label="Nomor Telepon"
              value="+62 812-3456-7890"
            />

            <Input
              label="Lokasi"
              value="Manado"
            />

          </div>

          <div className="mt-8 flex flex-wrap gap-4">

            <Button
              startContent={<Save size={18} />}
            >
              Simpan Perubahan
            </Button>

            <Button
              variant="outline"
              startContent={<KeyRound size={18} />}
            >
              Ubah Password
            </Button>

          </div>

        </Card>

      </div>
    </>
  );
}