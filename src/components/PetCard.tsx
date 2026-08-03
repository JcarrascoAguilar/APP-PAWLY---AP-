import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusLabel, speciesLabel, useFavorites, type Pet } from "@/lib/petnova";

const statusStyles: Record<Pet["status"], string> = {
  perdido: "bg-accent/15 text-accent",
  encontrado: "bg-primary/10 text-primary",
  adopcion: "bg-primary/10 text-primary",
  reencuentro: "bg-success/15 text-success",
};

export function StatusBadge({ status }: { status: Pet["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function PetCard({ pet }: { pet: Pet }) {
  const { isFav, toggle } = useFavorites();

  return (
    <div
      className={cn(
        "group animate-fade-up relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        pet.status === "reencuentro" ? "border-success/50" : "border-border/70",
      )}
    >
      <Link to="/mascota/$id" params={{ id: pet.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={pet.photos[0]}
            alt={`${speciesLabel[pet.species]} ${pet.name}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={pet.status} />
          </div>
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-base font-bold text-foreground">{pet.name}</h3>
          <p className="text-xs text-muted-foreground">
            {speciesLabel[pet.species]} · {pet.breed} · {pet.age}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{pet.district}</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-label="Guardar en favoritos"
        onClick={() => toggle(pet.id)}
        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-accent"
      >
        <Heart className={cn("size-4", isFav(pet.id) && "fill-accent text-accent")} />
      </button>
    </div>
  );
}
