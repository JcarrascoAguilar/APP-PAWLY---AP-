import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePets, type PetStatus, type Species } from "@/lib/petnova";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

export function PetForm({
  status,
  dateLabel,
  placeLabel,
}: {
  status: PetStatus;
  dateLabel: string;
  placeLabel: string;
}) {
  const navigate = useNavigate();
  const { addPet } = usePets();
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    species: "perro" as Species,
    breed: "",
    age: "",
    sex: "macho" as "macho" | "hembra",
    size: "mediano" as "pequeño" | "mediano" | "grande",
    color: "",
    district: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    phone: "",
    whatsapp: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 4)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => setPhotos((prev) => [...prev, String(reader.result)].slice(0, 4));
        reader.readAsDataURL(file);
      });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.district.trim() || !form.phone.trim()) {
      toast.error("Completa nombre, distrito y teléfono");
      return;
    }
    addPet({
      name: form.name.trim().slice(0, 60),
      species: form.species,
      breed: form.breed.trim().slice(0, 60) || "Sin especificar",
      age: form.age.trim().slice(0, 30) || "Sin especificar",
      sex: form.sex,
      size: form.size,
      color: form.color.trim().slice(0, 40),
      district: form.district.trim().slice(0, 60),
      location: form.location.trim().slice(0, 120) || form.district.trim(),
      date: form.date,
      description: form.description.trim().slice(0, 600),
      status,
      phone: form.phone.trim().slice(0, 30),
      whatsapp: (form.whatsapp || form.phone).replace(/\D/g, "").slice(0, 20),
      owner: "Tú",
      photos:
        photos.length > 0
          ? photos
          : [
              "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=70",
            ],
    });
    toast.success("¡Publicación creada!");
    navigate({ to: "/mis-publicaciones" });
  };

  return (
    <form onSubmit={submit} className="animate-fade-up mt-5 space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card px-4 py-8 text-center">
        <ImagePlus className="size-6 text-primary" />
        <span className="text-sm font-semibold text-foreground">Subir fotografías</span>
        <span className="text-xs text-muted-foreground">Hasta 4 imágenes JPG o PNG</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p} alt={`Foto ${i + 1}`} className="size-20 rounded-2xl object-cover" />
              <button
                type="button"
                aria-label="Quitar foto"
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        className={field}
        placeholder="Nombre (o 'Sin nombre')"
        maxLength={60}
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <select className={field} value={form.species} onChange={(e) => set("species", e.target.value)}>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>
        <input
          className={field}
          placeholder="Raza"
          maxLength={60}
          value={form.breed}
          onChange={(e) => set("breed", e.target.value)}
        />
        <select className={field} value={form.sex} onChange={(e) => set("sex", e.target.value)}>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
        <select className={field} value={form.size} onChange={(e) => set("size", e.target.value)}>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </select>
        <input
          className={field}
          placeholder="Edad"
          maxLength={30}
          value={form.age}
          onChange={(e) => set("age", e.target.value)}
        />
        <input
          className={field}
          placeholder="Color"
          maxLength={40}
          value={form.color}
          onChange={(e) => set("color", e.target.value)}
        />
      </div>

      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="size-4 text-primary" /> {placeLabel}
        </p>
        <div className="relative mt-3 h-32 overflow-hidden rounded-2xl bg-muted">
          <div className="absolute inset-0 bg-[linear-gradient(oklch(0_0_0/0.06)_1px,transparent_1px),linear-gradient(90deg,oklch(0_0_0/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <MapPin className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-full text-accent" />
        </div>
        <input
          className={cn(field, "mt-3")}
          placeholder="Distrito"
          maxLength={60}
          value={form.district}
          onChange={(e) => set("district", e.target.value)}
        />
        <input
          className={cn(field, "mt-3")}
          placeholder="Dirección o referencia"
          maxLength={120}
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>

      <label className="block text-xs font-semibold text-muted-foreground">
        {dateLabel}
        <input
          type="date"
          className={cn(field, "mt-1")}
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </label>

      <textarea
        className={cn(field, "min-h-28 resize-none")}
        placeholder="Descripción: señas particulares, collar, comportamiento…"
        maxLength={600}
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          className={field}
          placeholder="Teléfono"
          maxLength={30}
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <input
          className={field}
          placeholder="WhatsApp"
          maxLength={30}
          value={form.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground transition-transform active:scale-[0.99]"
      >
        Publicar
      </button>
    </form>
  );
}
