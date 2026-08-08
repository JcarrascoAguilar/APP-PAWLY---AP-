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
      { title: "Buscar mascotas — PAWLY" },
      {
        name: "description",
        content:
          "Busca por nombre, especie, raza, distrito o estado: mascotas perdidas, encontradas y en adopción.",
      },
      { property: "og:title", content: "Buscar mascotas — PAWLY" },
      {
        property: "og:description",
        content: "Filtra perros, gatos y más por raza, distrito y estado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Buscar,
});

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "perdido", label: "Perdidas" },
  { key: "encontrado", label: "Encontradas" },
  { key: "adopcion", label: "En adopción" },
] as const;

const especies = [
  { key: "todas", label: "Todas" },
  { key: "perro", label: "Perros" },
  { key: "gato", label: "Gatos" },
  { key: "otro", label: "Otros" },
] as const;

function Buscar() {
  const { pets } = usePets();
  const [estado, setEstado] = useState<(typeof filtros)[number]["key"]>("todos");
  const [especie, setEspecie] = useState<(typeof especies)[number]["key"]>("todas");
  const [q, setQ] = useState("");

  const list = pets
    .filter((p) => p.status !== "reencuentro")
    .filter((p) => (estado === "todos" ? true : p.status === estado))
    .filter((p) => (especie === "todas" ? true : p.species === especie))
    .filter((p) =>
      q
        ? (p.name + p.breed + p.district + p.location + p.description)
            .toLowerCase()
            .includes(q.toLowerCase())
        : true,
    );

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Buscar mascotas</h1>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, raza o distrito"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setEstado(f.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              estado === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
        {especies.map((f) => (
          <button
            key={f.key}
            onClick={() => setEspecie(f.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              especie === f.key
                ? "border-accent bg-accent text-accent-foreground"
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
