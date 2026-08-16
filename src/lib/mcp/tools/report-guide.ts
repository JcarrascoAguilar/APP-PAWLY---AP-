import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const guides = {
  perdido: {
    ruta: "/publicar/perdida",
    pasos: [
      "Abre PAWLY y entra a Publicar → Reportar mascota perdida.",
      "Sube 1 a 3 fotos claras del animal.",
      "Indica nombre, especie, raza, color, tamaño y sexo.",
      "Añade distrito, punto de referencia y fecha de la pérdida.",
      "Deja teléfono y WhatsApp de contacto y publica.",
      "Cuando aparezca, usa 'Marcar como encontrada' para moverla a Reencuentros.",
    ],
  },
  encontrado: {
    ruta: "/publicar/encontrada",
    pasos: [
      "Entra a Publicar → Reportar mascota encontrada.",
      "Sube fotos y describe señas particulares (collar, manchas, placa).",
      "Indica dónde y cuándo la encontraste.",
      "Deja un contacto para que la familia pueda escribirte.",
    ],
  },
  adopcion: {
    ruta: "/publicar/adopcion",
    pasos: [
      "Entra a Publicar → Dar en adopción.",
      "Sube fotos y cuenta el carácter y los cuidados del animal.",
      "Indica edad aproximada, tamaño, sexo y distrito.",
      "Deja contacto para coordinar la adopción responsable.",
    ],
  },
} as const;

export default defineTool({
  name: "report_guide",
  title: "Guía para publicar",
  description:
    "Explica paso a paso cómo publicar en PAWLY una mascota perdida, encontrada o en adopción, e indica la ruta de la app.",
  inputSchema: {
    tipo: z.enum(["perdido", "encontrado", "adopcion"]).describe("Tipo de publicación."),
  },
  outputSchema: { tipo: z.string(), ruta: z.string(), pasos: z.array(z.string()) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ tipo }) => {
    const guide = guides[tipo];
    return {
      content: [
        {
          type: "text" as const,
          text: `Ruta: ${guide.ruta}\n\n${guide.pasos.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
        },
      ],
      structuredContent: { tipo, ...guide },
    };
  },
});
