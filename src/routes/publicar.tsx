import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { usePets, type PetStatus, type Species } from "@/lib/petnova";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar mascota — PETNOVA" },
      {
        name: "description",
        content:
          "Publica una mascota perdida, encontrada o en adopción con fotos, ubicación y datos de contacto.",
      },
      { property: "og:title", content: "Publicar mascota — PETNOVA" },
      {
        property: "og:description",
        content: "Crea un reporte en minutos y llega a la comunidad cercana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Publicar,
});

const tipos: { key: PetStatus; label: string }[] = [
  { key: "perdido", label: "Perdida" },
  { key: "encontrado", label: "Encontrada" },
  { key: "adopcion", label: "Adopción" },
];

function Publicar() {
  const navigate = useNavigate();
  const { addPet } = usePets();
  const [status, setStatus] = useState<PetStatus>("perdido");
  const [photo, setPhoto] = useState("");
  const [form, setForm] = useState({
    name: "",
    species: "perro" as Species,
    age: "",
    sex: "macho" as "macho" | "hembra",
    location: "",
    description: "",
    contact: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.contact.trim()) {
      toast.error("Completa nombre, ubicación y contacto");
      return;
    }
    addPet({
      ...form,
      name: form.name.trim().slice(0, 60),
      location: form.location.trim().slice(0, 120),
      description: form.description.trim().slice(0, 600),
      contact: form.contact.trim().slice(0, 80),
      status,
      date: new Date().toISOString().slice(0, 10),
      photo:
        photo ||
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=70",
    });
    toast.success("¡Publicación creada!");
    navigate({ to: "/mis-publicaciones" });
  };

  const field = "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-foreground">Publicar mascota</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cuéntanos sobre la mascota para que la comunidad pueda ayudar.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="flex gap-2">
          {tipos.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              className={cn(
                "flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                status === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card px-4 py-8 text-center">
          {photo ? (
            <img src={photo} alt="Vista previa" className="h-40 rounded-2xl object-cover" />
          ) : (
            <>
              <ImagePlus className="size-6 text-primary" />
              <span className="text-sm font-semibold text-foreground">Subir fotografía</span>
              <span className="text-xs text-muted-foreground">JPG o PNG</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>

        <input
          className={field}
          placeholder="Nombre (o 'Sin nombre')"
          maxLength={60}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className={field}
            value={form.species}
            onChange={(e) => set("species", e.target.value)}
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
          <select className={field} value={form.sex} onChange={(e) => set("sex", e.target.value)}>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>

        <input
          className={field}
          placeholder="Edad aproximada"
          maxLength={30}
          value={form.age}
          onChange={(e) => set("age", e.target.value)}
        />

        <div className="rounded-3xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="size-4 text-primary" /> Ubicación
          </p>
          <div className="relative mt-3 h-32 overflow-hidden rounded-2xl bg-muted">
            <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_0%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_0%/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <MapPin className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-full text-accent" />
          </div>
          <input
            className={cn(field, "mt-3")}
            placeholder="Barrio, ciudad"
            maxLength={120}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>

        <textarea
          className={cn(field, "min-h-28 resize-none")}
          placeholder="Descripción: señas particulares, collar, comportamiento…"
          maxLength={600}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <input
          className={field}
          placeholder="Teléfono o correo de contacto"
          maxLength={80}
          value={form.contact}
          onChange={(e) => set("contact", e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground"
        >
          Publicar
        </button>
      </form>
    </AppShell>
  );
}
