import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Heart, History, LogIn, Settings, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { useFavorites, usePets } from "@/lib/petnova";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — PETNOVA" },
      {
        name: "description",
        content:
          "Tus datos, mascotas publicadas, favoritos, historial y configuración de alertas en PETNOVA.",
      },
      { property: "og:title", content: "Mi perfil — PETNOVA" },
      {
        property: "og:description",
        content: "Gestiona tus favoritos, publicaciones y notificaciones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { pets } = usePets();
  const { favs } = useFavorites();
  const favoritos = pets.filter((p) => favs.includes(p.id));
  const mias = pets.filter((p) => p.mine);

  return (
    <AppShell>
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
          🐾
        </span>
        <div>
          <p className="text-lg font-bold text-foreground">Invitado</p>
          <p className="text-xs text-muted-foreground">
            Inicia sesión para sincronizar tus publicaciones
          </p>
        </div>
      </div>

      <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
        <LogIn className="size-4" /> Iniciar sesión / Registrarse
      </button>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat value={mias.length} label="Publicadas" />
        <Stat value={favoritos.length} label="Favoritos" />
        <Stat value={pets.length} label="Vistas" />
      </div>

      <div className="mt-6 space-y-2">
        <Row icon={<Heart className="size-4" />} label="Favoritos" value={`${favoritos.length}`} />
        <Row icon={<History className="size-4" />} label="Historial" value="Reciente" />
        <Row icon={<Bell className="size-4" />} label="Alertas cercanas" value="Activadas" />
        <Row icon={<ShieldCheck className="size-4" />} label="Verificar refugio" value="Solicitar" />
        <Row icon={<Settings className="size-4" />} label="Configuración" value="" />
      </div>

      <h2 className="mt-8 text-lg font-bold text-foreground">Mis favoritos</h2>
      {favoritos.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Toca el corazón en cualquier mascota para guardarla aquí.
        </p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {favoritos.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      <Link
        to="/mis-publicaciones"
        className="mt-6 inline-block text-sm font-semibold text-primary"
      >
        Ver mis publicaciones →
      </Link>
    </AppShell>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card py-3">
      <p className="text-lg font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
