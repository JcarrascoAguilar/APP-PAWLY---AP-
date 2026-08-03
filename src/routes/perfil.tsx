import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Heart,
  LogIn,
  LogOut,
  Moon,
  PawPrint,
  PartyPopper,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { useAuth, useFavorites, usePets, useTheme } from "@/lib/petnova";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — PETNOVA" },
      {
        name: "description",
        content:
          "Tus datos, mascotas publicadas, favoritos, reencuentros y configuración de alertas en PETNOVA.",
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
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const favoritos = pets.filter((p) => favs.includes(p.id));
  const mias = pets.filter((p) => p.mine);
  const reencuentros = pets.filter((p) => p.status === "reencuentro");

  return (
    <AppShell>
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
          🐾
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-foreground">{user?.name ?? "Invitado"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? "Inicia sesión para sincronizar tus publicaciones"}
          </p>
        </div>
      </div>

      {user ? (
        <button
          onClick={() => {
            signOut();
            toast("Sesión cerrada");
            navigate({ to: "/bienvenida" });
          }}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      ) : (
        <Link
          to="/auth"
          search={{ modo: "login" }}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          <LogIn className="size-4" /> Iniciar sesión / Registrarse
        </Link>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat value={mias.length} label="Publicadas" />
        <Stat value={favoritos.length} label="Favoritos" />
        <Stat value={reencuentros.length} label="Reencuentros" />
      </div>

      <div className="mt-6 space-y-2">
        <Link
          to="/mis-publicaciones"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <PawPrint className="size-4" /> Mis publicaciones
          </span>
          <span className="text-xs text-muted-foreground">{mias.length}</span>
        </Link>
        <Link
          to="/reencuentros"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <PartyPopper className="size-4" /> Reencuentros
          </span>
          <span className="text-xs text-muted-foreground">{reencuentros.length}</span>
        </Link>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Bell className="size-4" /> Alertas cercanas
          </span>
          <span className="text-xs text-muted-foreground">Activadas</span>
        </div>
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Moon className="size-4" /> Modo oscuro
          </span>
          <span className="text-xs text-muted-foreground">{dark ? "Activado" : "Desactivado"}</span>
        </button>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Settings className="size-4" /> Configuración
          </span>
          <span className="text-xs text-muted-foreground">Cuenta y privacidad</span>
        </div>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-bold text-foreground">
        <Heart className="size-4 text-accent" /> Favoritos
      </h2>
      {favoritos.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Aún no has guardado mascotas.</p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {favoritos.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
