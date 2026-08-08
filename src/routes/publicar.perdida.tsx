import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PetForm } from "@/components/PetForm";

export const Route = createFileRoute("/publicar/perdida")({
  head: () => ({
    meta: [
      { title: "Publicar mascota perdida — PAWLY" },
      {
        name: "description",
        content:
          "Reporta tu mascota perdida con fotos, raza, color, última ubicación, fecha y contacto de WhatsApp.",
      },
      { property: "og:title", content: "Publicar mascota perdida — PAWLY" },
      {
        property: "og:description",
        content: "Crea una alerta y activa a la comunidad cercana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Publicar mascota perdida</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Mientras más detalles agregues, más fácil será encontrarla.
      </p>
      <PetForm status="perdido" dateLabel="Fecha de pérdida" placeLabel="Última ubicación" />
    </AppShell>
  ),
});
