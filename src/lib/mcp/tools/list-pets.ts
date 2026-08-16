import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { seedPets, speciesLabel, statusLabel } from "@/lib/petnova";

export default defineTool({
  name: "list_pets",
  title: "Listar mascotas",
  description:
    "Lista las mascotas publicadas en el catálogo público de PAWLY (perdidas, encontradas, en adopción o reencuentros), con filtros opcionales.",
  inputSchema: {
    status: z
      .enum(["perdido", "encontrado", "adopcion", "reencuentro"])
      .optional()
      .describe("Filtrar por estado de la publicación."),
    species: z.enum(["perro", "gato", "otro"]).optional().describe("Filtrar por especie."),
    district: z.string().optional().describe("Filtrar por distrito (coincidencia parcial)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, species, district }) => {
    const d = district?.trim().toLowerCase();
    const rows = seedPets
      .filter((p) => (status ? p.status === status : true))
      .filter((p) => (species ? p.species === species : true))
      .filter((p) => (d ? p.district.toLowerCase().includes(d) : true))
      .map((p) => ({
        id: p.id,
        name: p.name,
        species: speciesLabel[p.species],
        breed: p.breed,
        status: statusLabel[p.status],
        district: p.district,
        date: p.date,
      }));

    return {
      content: [
        {
          type: "text" as const,
          text: rows.length
            ? rows.map((r) => `${r.id}. ${r.name} — ${r.species}, ${r.status}, ${r.district} (${r.date})`).join("\n")
            : "No hay mascotas que coincidan con esos filtros.",
        },
      ],
      structuredContent: { count: rows.length, pets: rows },
    };
  },
});
