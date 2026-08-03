import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/PetCard";
import { speciesLabel, useFavorites, usePets, waLink } from "@/lib/petnova";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mascota/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de la mascota — PETNOVA" },
      {
        name: "description",
        content:
          "Galería, características, ubicación en mapa y datos de contacto del reporte publicado en PETNOVA.",
      },
      { property: "og:title", content: "Detalle de la mascota — PETNOVA" },
      {
        property: "og:description",
        content: "Información completa del reporte y contacto directo por WhatsApp.",
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
  const { pets, updatePet } = usePets();
  const { isFav, toggle } = useFavorites();
  const [active, setActive] = useState(0);
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

      <div
        className={cn(
          "animate-fade-up mt-3 overflow-hidden rounded-3xl border bg-card",
          pet.status === "reencuentro" ? "border-success/50" : "border-border/70",
        )}
      >
        <img
          src={pet.photos[active] ?? pet.photos[0]}
          alt={`${speciesLabel[pet.species]} ${pet.name}`}
          className="aspect-[4/3] w-full object-cover"
        />
        {pet.photos.length > 1 && (
          <div className="flex gap-2 p-3">
            {pet.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={cn(
                  "size-16 overflow-hidden rounded-2xl border-2",
                  i === active ? "border-primary" : "border-transparent",
                )}
              >
                <img src={p} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-foreground">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">
                {speciesLabel[pet.species]} · {pet.breed} · {pet.age} · {pet.sex}
              </p>
            </div>
            <StatusBadge status={pet.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Tamaño" value={pet.size} />
            <Info label="Color" value={pet.color || "Sin especificar"} />
            <Info label="Distrito" value={pet.district} />
            <Info label="Publicado por" value={pet.owner} />
          </dl>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" /> {pet.location}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" /> {pet.date}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-foreground">{pet.description}</p>

          <div className="relative h-40 overflow-hidden rounded-2xl bg-muted">
            <div className="absolute inset-0 bg-[linear-gradient(oklch(0_0_0/0.06)_1px,transparent_1px),linear-gradient(90deg,oklch(0_0_0/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <span
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${pet.coords.x}%`, top: `${pet.coords.y}%` }}
            >
              <MapPin className="size-7 text-accent" />
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={`tel:${pet.phone}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="size-4" /> Contactar
            </a>
            <a
              href={waLink(pet.whatsapp || pet.phone, pet.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground"
            >
              <Share2 className="size-4" /> Compartir
            </button>
            <button
              onClick={() => toggle(pet.id)}
              aria-label="Guardar en favoritos"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3"
            >
              <Heart className={cn("size-4", isFav(pet.id) && "fill-accent text-accent")} />
            </button>
          </div>

          {pet.status === "perdido" && (
            <button
              onClick={() => {
                updatePet(pet.id, { status: "reencuentro" });
                toast.success("¡Marcada como encontrada! Ahora aparece en Reencuentros.");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-success/50 bg-success/10 px-4 py-3 text-sm font-bold text-success"
            >
              <CheckCircle2 className="size-4" /> Marcar como encontrada
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-semibold capitalize text-foreground">{value}</dd>
    </div>
  );
}
