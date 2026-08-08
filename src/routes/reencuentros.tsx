import { createFileRoute } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PetCard } from "@/components/PetCard";
import { usePets } from "@/lib/petnova";

export const Route = createFileRoute("/reencuentros")({
  head: () => ({
    meta: [
      { title: "Reencuentros — PAWLY" },
      {
        name: "description",
        content:
          "Historias felices: mascotas que ya regresaron con sus familias gracias a la comunidad PAWLY.",
      },
      { property: "og:title", content: "Reencuentros — PAWLY" },
      {
        property: "og:description",
        content: "Mascotas encontradas que volvieron a casa. ¡Gracias comunidad!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reencuentros,
});

function Reencuentros() {
  const { pets } = usePets();
  const list = pets.filter((p) => p.status === "reencuentro");

  return (
    <AppShell>
      <div className="flex items-center gap-3 rounded-3xl border border-success/40 bg-success/10 p-5">
        <PartyPopper className="size-7 shrink-0 text-success" />
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold text-foreground">Reencuentros</h1>
          <p className="text-xs text-muted-foreground">
            Mascotas que ya volvieron con su familia.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {list.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Aún no hay reencuentros registrados.
        </p>
      )}
    </AppShell>
  );
}
