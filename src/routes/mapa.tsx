import { createFileRoute, Link } from "@tanstack/react-router";
import { Hospital, MapPin, PawPrint } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { places, statusLabel, usePets } from "@/lib/petnova";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de mascotas y refugios — PETNOVA" },
      {
        name: "description",
        content:
          "Visualiza en el mapa mascotas perdidas, encontradas, refugios y veterinarias cercanas.",
      },
      { property: "og:title", content: "Mapa de mascotas y refugios — PETNOVA" },
      {
        property: "og:description",
        content: "Reportes y organizaciones de rescate ubicados en tu zona.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mapa,
});

function Mapa() {
  const { pets } = usePets();
  const [sel, setSel] = useState<string | null>(null);
  const selected = pets.find((p) => p.id === sel);

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Mapa</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reportes, refugios y veterinarias cerca de ti.
      </p>

      <div className="relative mt-4 aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_0%/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_0%/0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        {pets.map((p) => (
          <button
            key={p.id}
            onClick={() => setSel(p.id)}
            style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 shadow-md transition-transform hover:scale-110",
              p.status === "perdido"
                ? "bg-destructive text-destructive-foreground"
                : p.status === "encontrado"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground",
            )}
            aria-label={p.name}
          >
            <PawPrint className="size-4" />
          </button>
        ))}
        {places.map((pl) => (
          <span
            key={pl.id}
            style={{ left: `${pl.coords.x}%`, top: `${pl.coords.y}%` }}
            title={pl.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-card p-1.5 text-foreground shadow-md ring-1 ring-border"
          >
            <Hospital className="size-4" />
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <Legend className="bg-destructive" label="Perdidas" />
        <Legend className="bg-primary" label="Encontradas" />
        <Legend className="bg-accent" label="En adopción" />
        <Legend className="bg-card ring-1 ring-border" label="Refugios y veterinarias" />
      </div>

      {selected && (
        <Link
          to="/mascota/$id"
          params={{ id: selected.id }}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
          <img src={selected.photo} alt={selected.name} className="size-14 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-bold text-foreground">{selected.name}</p>
            <p className="text-xs text-muted-foreground">
              {statusLabel[selected.status]} · {selected.location}
            </p>
          </div>
        </Link>
      )}

      <h2 className="mt-8 text-lg font-bold text-foreground">Refugios y veterinarias</h2>
      <div className="mt-3 space-y-3">
        {places.map((pl) => (
          <div key={pl.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground">{pl.name}</p>
              {pl.verified && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Verificado
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {pl.address}
            </p>
            <a href={`tel:${pl.phone}`} className="mt-1 block text-xs font-semibold text-primary">
              {pl.phone}
            </a>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded-full", className)} /> {label}
    </span>
  );
}
