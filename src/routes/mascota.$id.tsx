import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Heart, MapPin, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/PetCard";
import { speciesLabel, useFavorites, usePets } from "@/lib/petnova";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mascota/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de la mascota — PETNOVA" },
      {
        name: "description",
        content:
          "Consulta la información completa del reporte: especie, edad, ubicación, estado y datos de contacto.",
      },
      { property: "og:title", content: "Detalle de la mascota — PETNOVA" },
      {
        property: "og:description",
        content: "Información completa del reporte y contacto directo con quien publicó.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Detalle,
  notFoundComponent: () => (
    <AppShell>
      <p className="py-16 text-center text-sm text-muted-foreground">
        No encontramos esta publicación.
      </p>
    </AppShell>
  ),
});

function Detalle() {
  const { id } = Route.useParams();
  const { pets } = usePets();
  const { isFav, toggle } = useFavorites();
  const pet = pets.find((p) => p.id === id);

  if (!pet) throw notFound();

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: `PETNOVA · ${pet.name}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Enlace copiado");
      }
    } catch {
      /* cancelado */
    }
  };

  return (
    <AppShell>
      <Link
        to="/explorar"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="mt-3 overflow-hidden rounded-3xl border border-border/70 bg-card">
        <img
          src={pet.photo}
          alt={`${speciesLabel[pet.species]} ${pet.name}`}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">
                {speciesLabel[pet.species]} · {pet.age} · {pet.sex}
              </p>
            </div>
            <StatusBadge status={pet.status} />
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {pet.location}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4" /> Reportado el {pet.date}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-foreground">{pet.description}</p>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={pet.contact.includes("@") ? `mailto:${pet.contact}` : `tel:${pet.contact}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="size-4" /> Contactar
            </a>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground"
            >
              <Share2 className="size-4" /> Compartir
            </button>
            <button
              onClick={() => toggle(pet.id)}
              aria-label="Favorito"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3"
            >
              <Heart className={cn("size-4", isFav(pet.id) && "fill-accent text-accent")} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
