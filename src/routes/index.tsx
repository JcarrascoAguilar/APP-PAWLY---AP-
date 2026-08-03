import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Megaphone, MapPinned, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { usePets } from "@/lib/petnova";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PETNOVA — Mascotas perdidas, encontradas y en adopción" },
      {
        name: "description",
        content:
          "PETNOVA conecta a personas con mascotas perdidas, encontradas o en adopción para promover el bienestar animal y el reencuentro con sus familias.",
      },
      { property: "og:title", content: "PETNOVA — Bienestar animal en tu ciudad" },
      {
        property: "og:description",
        content:
          "Reporta, busca y adopta mascotas cerca de ti. Refugios, veterinarias y alertas geolocalizadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const actions = [
  { to: "/explorar", emoji: "🐶", label: "Buscar mascota" },
  { to: "/explorar", emoji: "❤️", label: "Adoptar", search: true },
  { to: "/publicar", emoji: "📢", label: "Reportar perdida" },
  { to: "/publicar", emoji: "📍", label: "Reportar encontrada" },
] as const;

function Index() {
  const { pets } = usePets();
  const [q, setQ] = useState("");
  const featured = pets.slice(0, 6);

  return (
    <AppShell>
      <section className="rounded-3xl bg-primary px-5 py-7 text-primary-foreground">
        <h1 className="text-2xl font-extrabold leading-tight">
          Cada mascota merece volver a casa
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/85">
          Reporta, busca y adopta. Una comunidad por el bienestar animal.
        </p>
        <form
          className="mt-5 flex items-center gap-2 rounded-2xl bg-background px-3 py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, especie o zona"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </form>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <Link
            key={i}
            to={a.to}
            className="rounded-2xl border border-border/70 bg-card p-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/50"
          >
            <span className="text-xl">{a.emoji}</span>
            <p className="mt-2">{a.label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">Mascotas destacadas</h2>
          <Link to="/explorar" className="text-xs font-semibold text-primary">
            Ver todas
          </Link>
        </div>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {featured
            .filter((p) =>
              q ? (p.name + p.species + p.location).toLowerCase().includes(q.toLowerCase()) : true,
            )
            .map((pet) => (
              <div key={pet.id} className="w-56 shrink-0 snap-start">
                <PetCard pet={pet} />
              </div>
            ))}
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Feature icon={<MapPinned className="size-5" />} title="Alertas cercanas">
          Avisos cuando se reporta una mascota cerca de ti.
        </Feature>
        <Feature icon={<Megaphone className="size-5" />} title="Refugios verificados">
          Organizaciones y veterinarias con perfil confiable.
        </Feature>
        <Feature icon={<Heart className="size-5" />} title="Adopción responsable">
          Historias con final feliz para cada rescate.
        </Feature>
      </section>
    </AppShell>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
        {icon}
      </span>
      <h3 className="mt-3 text-sm font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}
