import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { seedPets, speciesLabel, statusLabel } from "@/lib/petnova";

export default defineTool({
  name: "get_pet",
  title: "Ver mascota",
  description: "Devuelve la ficha completa de una mascota del catálogo público de PAWLY por su id.",
  inputSchema: { id: z.string().describe("Id de la mascota, tal como aparece en list_pets.") },
  outputSchema: { pet: z.record(z.string(), z.unknown()) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const pet = seedPets.find((p) => p.id === id.trim());
    if (!pet) throw new ToolError(`No existe una mascota con id "${id}".`);

    const detail = {
      id: pet.id,
      name: pet.name,
      species: speciesLabel[pet.species],
      breed: pet.breed,
      age: pet.age,
      sex: pet.sex,
      size: pet.size,
      color: pet.color,
      status: statusLabel[pet.status],
      district: pet.district,
      location: pet.location,
      date: pet.date,
      description: pet.description,
      photos: pet.photos,
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(detail, null, 2) }],
      structuredContent: { pet: detail },
    };
  },
});
