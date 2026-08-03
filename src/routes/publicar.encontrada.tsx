import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PetForm } from "@/components/PetForm";

export const Route = createFileRoute("/publicar/encontrada")({
  head: () => ({
    meta: [
      { title: "Publicar mascota encontrada — PETNOVA" },
      {
        name: "description",
        content:
          "Reporta una mascota encontrada: fotos, características, lugar y fecha del hallazgo y tu contacto.",
      },
      { property: "og:title", content: "Publicar mascota encontrada — PETNOVA" },
      {
        property: "og:description",
        content: "Ayuda a que una mascota regrese a casa publicando el hallazgo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Publicar mascota encontrada</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe dónde la encontraste y sus características.
      </p>
      <PetForm
        status="encontrado"
        dateLabel="Fecha del hallazgo"
        placeLabel="Lugar donde fue encontrada"
      />
    </AppShell>
  ),
});
