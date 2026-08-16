# PAWLY — Bienestar Animal

PAWLY es una aplicación web móvil de bienestar animal que conecta a personas con mascotas perdidas, encontradas, en adopción o que necesitan ser rescatadas. Su objetivo es facilitar el reencuentro de mascotas con sus familias y promover la adopción responsable.

## ¿Qué puedes hacer con PAWLY?

- **Buscar mascotas**: explora publicaciones de mascotas perdidas, encontradas y en adopción.
- **Publicar reportes**: crea avisos de mascota perdida, encontrada o en adopción con fotos, ubicación y contacto.
- **Marcar como encontrada**: cuando una mascota perdida vuelva a casa, cambia su estado a reencuentro y aparece en la sección especial.
- **Guardar favoritos**: guarda las mascotas que te interesen para revisarlas después.
- **Ver en mapa**: visualiza las publicaciones cercanas en un mapa interactivo.
- **Hablar con Nova**: asistente de voz y texto integrado que puede ayudarte a publicar y explorar mascotas.

## Público objetivo

- Personas que perdieron o encontraron una mascota.
- Familias interesadas en adoptar.
- Refugios, organizaciones de rescate y veterinarias.
- Amantes de los animales en general.

## Tecnologías

Este proyecto fue construido con:

- [TanStack Start](https://tanstack.com/start) — framework full-stack React.
- [React 19](https://react.dev) — interfaz de usuario.
- [TypeScript](https://www.typescriptlang.org) — tipado estático.
- [Tailwind CSS v4](https://tailwindcss.com) — estilos y diseño responsive.
- [ElevenLabs](https://elevenlabs.io) — asistente de voz Nova.
- [MCP](https://modelcontextprotocol.io) — integraciones con agentes externos.

## Desarrollo local

Requisitos: Node.js y npm (o bun).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

El servidor de desarrollo se levanta en `http://localhost:8080`.

## Estructura del proyecto

- `src/routes/` — rutas y pantallas de la aplicación.
- `src/components/` — componentes reutilizables (tarjetas, formularios, shell).
- `src/lib/` — lógica de negocio, hooks y utilidades.
- `src/lib/mcp/` — servidor MCP para integraciones con agentes.
- `public/` — activos estáticos como el favicon.

## Marca

- Nombre: **PAWLY**
- Logo: ilustración de un gato, perro y ave abrazándose, con la palabra PAWLY debajo.
- Colores principales: teal, coral/naranja, amarillo de marca y carbón para texto.

---

Construido con [Lovable](https://lovable.dev).
