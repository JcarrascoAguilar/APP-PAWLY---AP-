import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PetForm } from "@/components/PetForm";

export const Route = createFileRoute("/publicar/adopcion")({
  head: () => ({
    meta: [
      { title: "Dar una mascota en adopción — PAWLY" },
      {
        name: "description",
        content:
          "Publica una mascota en adopción responsable con fotos, tamaño, edad, ubicación y contacto.",
      },
      { property: "og:title", content: "Dar en adopción — PAWLY" },
      {
        property: "og:description",
        content: "Encuentra un hogar responsable para una mascota rescatada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Dar en adopción</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cuenta su historia para conectar con la familia ideal.
      </p>
      <PetForm status="adopcion" dateLabel="Disponible desde" placeLabel="Ubicación de la mascota" />
    </AppShell>
  ),
});
