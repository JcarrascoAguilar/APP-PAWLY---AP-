import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { usePets } from "@/lib/petnova";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explorar")({
  head: () => ({
    meta: [
      { title: "Explorar mascotas — PETNOVA" },
      {
        name: "description",
        content:
          "Filtra mascotas perdidas, encontradas o en adopción por especie y cercanía en PETNOVA.",
      },
      { property: "og:title", content: "Explorar mascotas — PETNOVA" },
      {
        property: "og:description",
        content: "Perros, gatos y más: perdidos, encontrados y en adopción cerca de ti.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explorar,
});

const filters = [
  { key: "todos", label: "Todos" },
  { key: "perro", label: "Perros" },
  { key: "gato", label: "Gatos" },
  { key: "perdido", label: "Perdidos" },
  { key: "encontrado", label: "Encontrados" },
  { key: "adopcion", label: "En adopción" },
  { key: "cerca", label: "Cerca de mí" },
] as const;

function Explorar() {
  const { pets } = usePets();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("todos");
  const [q, setQ] = useState("");

  const list = pets
    .filter((p) => {
      if (filter === "todos") return true;
      if (filter === "cerca") return p.coords.x < 55;
      if (filter === "perro" || filter === "gato") return p.species === filter;
      return p.status === filter;
    })
    .filter((p) =>
      q ? (p.name + p.location + p.description).toLowerCase().includes(q.toLowerCase()) : true,
    );

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Explorar</h1>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar mascota o zona"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{list.length} resultados</p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {list.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No encontramos mascotas con esos filtros.
        </p>
      )}
    </AppShell>
  );
}
