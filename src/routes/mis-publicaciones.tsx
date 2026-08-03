import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/PetCard";
import { usePets } from "@/lib/petnova";

export const Route = createFileRoute("/mis-publicaciones")({
  head: () => ({
    meta: [
      { title: "Mis publicaciones — PETNOVA" },
      {
        name: "description",
        content:
          "Administra tus reportes: edita, elimina o marca una mascota como encontrada o adoptada.",
      },
      { property: "og:title", content: "Mis publicaciones — PETNOVA" },
      {
        property: "og:description",
        content: "Gestiona el estado de las mascotas que publicaste en PETNOVA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MisPublicaciones,
});

function MisPublicaciones() {
  const { pets, updatePet, removePet } = usePets();
  const mine = pets.filter((p) => p.mine);

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Mis publicaciones</h1>

      {mine.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Aún no has publicado ninguna mascota.</p>
          <Link
            to="/publicar"
            className="mt-4 inline-block rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Publicar ahora
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {mine.map((pet) => (
            <div key={pet.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex gap-3">
                <img src={pet.photos[0]} alt={pet.name} className="size-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-bold text-foreground">{pet.name}</p>
                    <StatusBadge status={pet.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{pet.location}</p>
                  <p className="text-xs text-muted-foreground">Publicado el {pet.date}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {pet.status !== "reencuentro" && (
                  <button
                    onClick={() => {
                      updatePet(pet.id, { status: "reencuentro" });
                      toast.success("¡Marcada como encontrada! Ahora está en Reencuentros.");
                    }}
                    className="rounded-full bg-success/15 px-3 py-1.5 text-xs font-semibold text-success"
                  >
                    Marcar como encontrada
                  </button>
                )}
                {pet.status !== "adopcion" && (
                  <button
                    onClick={() => {
                      updatePet(pet.id, { status: "adopcion" });
                      toast.success("Marcada en adopción");
                    }}
                    className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent"
                  >
                    Marcar en adopción
                  </button>
                )}
                <button
                  onClick={() => {
                    const name = window.prompt("Nuevo nombre", pet.name);
                    if (name) updatePet(pet.id, { name: name.slice(0, 60) });
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <Pencil className="size-3.5" /> Editar
                </button>
                <button
                  onClick={() => {
                    removePet(pet.id);
                    toast("Publicación eliminada");
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive"
                >
                  <Trash2 className="size-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
