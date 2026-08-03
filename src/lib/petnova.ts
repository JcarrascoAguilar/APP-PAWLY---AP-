import { useCallback, useEffect, useState } from "react";

export type PetStatus = "perdido" | "encontrado" | "adopcion";
export type Species = "perro" | "gato" | "otro";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  age: string;
  sex: "macho" | "hembra";
  location: string;
  date: string;
  description: string;
  status: PetStatus;
  photo: string;
  contact: string;
  mine?: boolean;
  coords: { x: number; y: number };
}

export const statusLabel: Record<PetStatus, string> = {
  perdido: "Perdido",
  encontrado: "Encontrado",
  adopcion: "En adopción",
};

export const speciesLabel: Record<Species, string> = {
  perro: "Perro",
  gato: "Gato",
  otro: "Otro",
};

export const seedPets: Pet[] = [
  {
    id: "1",
    name: "Toby",
    species: "perro",
    age: "3 años",
    sex: "macho",
    location: "Barrio Centro, Bogotá",
    date: "2026-07-28",
    description:
      "Mestizo color café, collar rojo. Se perdió cerca del parque principal. Responde a su nombre y es muy sociable.",
    status: "perdido",
    photo:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=70",
    contact: "+57 300 111 2233",
    coords: { x: 28, y: 34 },
  },
  {
    id: "2",
    name: "Luna",
    species: "gato",
    age: "1 año",
    sex: "hembra",
    location: "Chapinero",
    date: "2026-07-30",
    description:
      "Gata gris atigrada encontrada en la puerta de un edificio. Está sana y en resguardo temporal.",
    status: "encontrado",
    photo:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=70",
    contact: "refugio@petnova.org",
    coords: { x: 62, y: 22 },
  },
  {
    id: "3",
    name: "Nube",
    species: "perro",
    age: "6 meses",
    sex: "hembra",
    location: "Refugio Patitas Felices",
    date: "2026-07-20",
    description:
      "Cachorra rescatada de la calle. Vacunada, desparasitada y lista para una familia responsable.",
    status: "adopcion",
    photo:
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=800&q=70",
    contact: "adopciones@patitasfelices.org",
    coords: { x: 45, y: 66 },
  },
  {
    id: "4",
    name: "Milo",
    species: "gato",
    age: "2 años",
    sex: "macho",
    location: "Usaquén",
    date: "2026-08-01",
    description:
      "Gato naranja muy cariñoso, se escapó por la ventana. Tiene microchip.",
    status: "perdido",
    photo:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=70",
    contact: "+57 311 555 8899",
    coords: { x: 74, y: 55 },
  },
  {
    id: "5",
    name: "Rocky",
    species: "perro",
    age: "5 años",
    sex: "macho",
    location: "Suba",
    date: "2026-07-25",
    description:
      "Perro grande, pelaje negro, muy tranquilo. Encontrado deambulando sin placa de identificación.",
    status: "encontrado",
    photo:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=70",
    contact: "+57 320 777 4455",
    coords: { x: 18, y: 72 },
  },
  {
    id: "6",
    name: "Coco",
    species: "otro",
    age: "1 año",
    sex: "hembra",
    location: "Refugio Nuevo Amanecer",
    date: "2026-07-18",
    description:
      "Coneja rescatada de abandono. Busca hogar con espacio y cuidados especiales.",
    status: "adopcion",
    photo:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=70",
    contact: "hola@nuevoamanecer.org",
    coords: { x: 55, y: 44 },
  },
];

export interface Place {
  id: string;
  name: string;
  type: "refugio" | "veterinaria";
  address: string;
  phone: string;
  verified: boolean;
  coords: { x: number; y: number };
}

export const places: Place[] = [
  {
    id: "p1",
    name: "Refugio Patitas Felices",
    type: "refugio",
    address: "Cra 15 #45-20",
    phone: "+57 601 456 7890",
    verified: true,
    coords: { x: 38, y: 58 },
  },
  {
    id: "p2",
    name: "Veterinaria San Roque",
    type: "veterinaria",
    address: "Calle 80 #12-05",
    phone: "+57 601 222 3344",
    verified: true,
    coords: { x: 68, y: 36 },
  },
  {
    id: "p3",
    name: "Refugio Nuevo Amanecer",
    type: "refugio",
    address: "Av. Suba #110-14",
    phone: "+57 601 888 1122",
    verified: false,
    coords: { x: 22, y: 48 },
  },
];

const PETS_KEY = "petnova:pets";
const FAVS_KEY = "petnova:favs";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function emit() {
  window.dispatchEvent(new Event("petnova:update"));
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>(seedPets);

  const sync = useCallback(() => setPets(read<Pet[]>(PETS_KEY, seedPets)), []);

  useEffect(() => {
    sync();
    window.addEventListener("petnova:update", sync);
    return () => window.removeEventListener("petnova:update", sync);
  }, [sync]);

  const save = (next: Pet[]) => {
    window.localStorage.setItem(PETS_KEY, JSON.stringify(next));
    emit();
  };

  return {
    pets,
    addPet: (pet: Omit<Pet, "id" | "mine" | "coords">) =>
      save([
        {
          ...pet,
          id: crypto.randomUUID(),
          mine: true,
          coords: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
        },
        ...pets,
      ]),
    updatePet: (id: string, patch: Partial<Pet>) =>
      save(pets.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    removePet: (id: string) => save(pets.filter((p) => p.id !== id)),
  };
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);

  const sync = useCallback(() => setFavs(read<string[]>(FAVS_KEY, [])), []);

  useEffect(() => {
    sync();
    window.addEventListener("petnova:update", sync);
    return () => window.removeEventListener("petnova:update", sync);
  }, [sync]);

  const toggle = (id: string) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    window.localStorage.setItem(FAVS_KEY, JSON.stringify(next));
    emit();
  };

  return { favs, toggle, isFav: (id: string) => favs.includes(id) };
}
