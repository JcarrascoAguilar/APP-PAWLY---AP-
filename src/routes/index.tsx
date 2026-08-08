import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { usePets } from "@/lib/petnova";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAWLY — Mascotas perdidas, encontradas y en adopción" },
      {
        name: "description",
        content:
          "PAWLY conecta mascotas perdidas, encontradas y en adopción con su familia. Reporta, busca y adopta en pocos pasos.",
      },
      { property: "og:title", content: "PAWLY — Conectando mascotas con un hogar" },
      {
        property: "og:description",
        content: "Reporta, busca y adopta mascotas cerca de ti. Refugios, veterinarias y alertas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const accesos = [
  { to: "/publicar/perdida", emoji: "🐶", label: "Perdí mi mascota", desc: "Crea una alerta" },
  { to: "/publicar/encontrada", emoji: "📍", label: "Encontré una mascota", desc: "Ayúdala a volver" },
  { to: "/adopcion", emoji: "❤️", label: "Mascotas en adopción", desc: "Dale un hogar" },
  { to: "/explorar", emoji: "🔍", label: "Buscar mascotas", desc: "Filtra por zona" },
] as const;

function Index() {
  const { pets } = usePets();
  const [q, setQ] = useState("");
  const recientes = pets
    .filter((p) => p.status !== "reencuentro")
    .filter((p) =>
      q ? (p.name + p.species + p.district + p.breed).toLowerCase().includes(q.toLowerCase()) : true,
    )
    .slice(0, 6);

  return (
    <AppShell>
      <section className="animate-fade-up rounded-3xl bg-primary px-5 py-7 text-primary-foreground">
        <h1 className="text-2xl font-extrabold leading-tight">Conectando mascotas con un hogar</h1>
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
            placeholder="Buscar por nombre, raza o distrito"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </form>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {accesos.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="animate-fade-up rounded-3xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <span className="text-3xl">{a.emoji}</span>
            <p className="mt-3 text-sm font-bold text-foreground">{a.label}</p>
            <p className="text-xs text-muted-foreground">{a.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">Publicaciones recientes</h2>
          <Link to="/explorar" className="text-xs font-semibold text-primary">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {recientes.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      <Link
        to="/reencuentros"
        className="mt-8 flex items-center gap-3 rounded-3xl border border-success/40 bg-success/10 p-5"
      >
        <Heart className="size-6 shrink-0 text-success" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">Reencuentros</p>
          <p className="text-xs text-muted-foreground">
            Mira las mascotas que ya volvieron con su familia.
          </p>
        </div>
      </Link>
    </AppShell>
  );
}
