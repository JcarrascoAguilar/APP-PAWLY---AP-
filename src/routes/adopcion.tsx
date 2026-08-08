import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { speciesLabel, usePets } from "@/lib/petnova";

export const Route = createFileRoute("/adopcion")({
  head: () => ({
    meta: [
      { title: "Mascotas en adopción — PAWLY" },
      {
        name: "description",
        content:
          "Conoce perros, gatos y otras mascotas en adopción responsable con refugios verificados de PAWLY.",
      },
      { property: "og:title", content: "Mascotas en adopción — PAWLY" },
      {
        property: "og:description",
        content: "Adopta con responsabilidad: cada mascota espera una familia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Adopcion,
});

function Adopcion() {
  const { pets } = usePets();
  const list = pets.filter((p) => p.status === "adopcion");

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Mascotas en adopción</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Adopción responsable con refugios y familias temporales.
      </p>

      <div className="mt-5 space-y-4">
        {list.map((pet) => (
          <article
            key={pet.id}
            className="animate-fade-up overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm"
          >
            <img
              src={pet.photos[0]}
              alt={`${speciesLabel[pet.species]} ${pet.name} en adopción`}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h2 className="text-lg font-bold text-foreground">{pet.name}</h2>
              <p className="text-xs text-muted-foreground">
                {pet.age} · {pet.sex} · Tamaño {pet.size}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {pet.district}
              </p>
              <p className="line-clamp-2 text-sm text-foreground">{pet.description}</p>
              <Link
                to="/mascota/$id"
                params={{ id: pet.id }}
                className="mt-2 block rounded-2xl bg-accent px-4 py-3 text-center text-sm font-bold text-accent-foreground"
              >
                Quiero adoptar
              </Link>
            </div>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Aún no hay mascotas en adopción publicadas.
        </p>
      )}
    </AppShell>
  );
}
