import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/publicar/")({
  head: () => ({
    meta: [
      { title: "Publicar una mascota — PETNOVA" },
      {
        name: "description",
        content:
          "Elige el tipo de publicación: mascota perdida, mascota encontrada o mascota en adopción.",
      },
      { property: "og:title", content: "Publicar una mascota — PETNOVA" },
      {
        property: "og:description",
        content: "Crea tu reporte en minutos y llega a la comunidad cercana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicarIndex,
});

const opciones = [
  {
    to: "/publicar/perdida",
    emoji: "🐶",
    title: "Perdí mi mascota",
    desc: "Publica una alerta con fotos y última ubicación.",
  },
  {
    to: "/publicar/encontrada",
    emoji: "📍",
    title: "Encontré una mascota",
    desc: "Ayuda a que vuelva con su familia.",
  },
  {
    to: "/publicar/adopcion",
    emoji: "❤️",
    title: "Dar en adopción",
    desc: "Encuentra un hogar responsable.",
  },
] as const;

function PublicarIndex() {
  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Publicar mascota</h1>
      <p className="mt-1 text-sm text-muted-foreground">¿Qué quieres publicar hoy?</p>

      <div className="mt-5 space-y-3">
        {opciones.map((o) => (
          <Link
            key={o.to}
            to={o.to}
            className="animate-fade-up flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <span className="text-3xl">{o.emoji}</span>
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground">{o.title}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
