import { defineMcp } from "@lovable.dev/mcp-js";
import listPets from "./tools/list-pets";
import getPet from "./tools/get-pet";
import reportGuide from "./tools/report-guide";

export default defineMcp({
  name: "pawly",
  title: "PAWLY",
  version: "0.1.0",
  instructions:
    "Herramientas del catálogo público de PAWLY, la app de bienestar animal. Usa `list_pets` para buscar mascotas perdidas, encontradas o en adopción, `get_pet` para ver la ficha completa y `report_guide` para explicar cómo publicar un reporte en la app.",
  tools: [listPets, getPet, reportGuide],
});
