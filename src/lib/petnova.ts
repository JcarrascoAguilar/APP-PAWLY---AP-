import { useCallback, useEffect, useState } from "react";

export type PetStatus = "perdido" | "encontrado" | "adopcion" | "reencuentro";
export type Species = "perro" | "gato" | "otro";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  sex: "macho" | "hembra";
  size: "pequeño" | "mediano" | "grande";
  color: string;
  district: string;
  location: string;
  date: string;
  description: string;
  status: PetStatus;
  photos: string[];
  phone: string;
  whatsapp: string;
  owner: string;
  mine?: boolean;
  coords: { x: number; y: number };
}

export const statusLabel: Record<PetStatus, string> = {
  perdido: "Perdido",
  encontrado: "Encontrado",
  adopcion: "En adopción",
  reencuentro: "Encontrada",
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
    breed: "Mestizo",
    age: "3 años",
    sex: "macho",
    size: "mediano",
    color: "Café con blanco",
    district: "Miraflores",
    location: "Parque Kennedy, Miraflores",
    date: "2026-07-28",
    description:
      "Mestizo color café, collar rojo. Se perdió cerca del parque principal. Responde a su nombre y es muy sociable.",
    status: "perdido",
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 987 111 222",
    whatsapp: "51987111222",
    owner: "María Fernández",
    coords: { x: 28, y: 34 },
  },
  {
    id: "2",
    name: "Luna",
    species: "gato",
    breed: "Europeo común",
    age: "1 año",
    sex: "hembra",
    size: "pequeño",
    color: "Gris atigrado",
    district: "San Isidro",
    location: "Av. Camino Real, San Isidro",
    date: "2026-07-30",
    description:
      "Gata gris atigrada encontrada en la puerta de un edificio. Está sana y en resguardo temporal.",
    status: "encontrado",
    photos: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 986 222 333",
    whatsapp: "51986222333",
    owner: "Refugio PAWLY",
    coords: { x: 62, y: 22 },
  },
  {
    id: "3",
    name: "Nube",
    species: "perro",
    breed: "Labrador mix",
    age: "6 meses",
    sex: "hembra",
    size: "mediano",
    color: "Crema",
    district: "Surco",
    location: "Refugio Patitas Felices, Surco",
    date: "2026-07-20",
    description:
      "Cachorra rescatada de la calle. Vacunada, desparasitada y lista para una familia responsable.",
    status: "adopcion",
    photos: [
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 985 333 444",
    whatsapp: "51985333444",
    owner: "Refugio Patitas Felices",
    coords: { x: 45, y: 66 },
  },
  {
    id: "4",
    name: "Milo",
    species: "gato",
    breed: "Naranja doméstico",
    age: "2 años",
    sex: "macho",
    size: "pequeño",
    color: "Naranja",
    district: "Barranco",
    location: "Jr. Unión, Barranco",
    date: "2026-08-01",
    description: "Gato naranja muy cariñoso, se escapó por la ventana. Tiene microchip.",
    status: "perdido",
    photos: [
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 984 444 555",
    whatsapp: "51984444555",
    owner: "Carlos Rojas",
    coords: { x: 74, y: 55 },
  },
  {
    id: "5",
    name: "Rocky",
    species: "perro",
    breed: "Labrador",
    age: "5 años",
    sex: "macho",
    size: "grande",
    color: "Negro",
    district: "San Miguel",
    location: "Av. La Marina, San Miguel",
    date: "2026-07-25",
    description:
      "Perro grande, pelaje negro, muy tranquilo. Encontrado deambulando sin placa de identificación.",
    status: "encontrado",
    photos: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 983 555 666",
    whatsapp: "51983555666",
    owner: "Lucía Peña",
    coords: { x: 18, y: 72 },
  },
  {
    id: "6",
    name: "Coco",
    species: "otro",
    breed: "Conejo",
    age: "1 año",
    sex: "hembra",
    size: "pequeño",
    color: "Blanco",
    district: "Jesús María",
    location: "Refugio Nuevo Amanecer",
    date: "2026-07-18",
    description:
      "Coneja rescatada de abandono. Busca hogar con espacio y cuidados especiales.",
    status: "adopcion",
    photos: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 982 666 777",
    whatsapp: "51982666777",
    owner: "Refugio Nuevo Amanecer",
    coords: { x: 55, y: 44 },
  },
  {
    id: "7",
    name: "Simba",
    species: "perro",
    breed: "Golden Retriever",
    age: "4 años",
    sex: "macho",
    size: "grande",
    color: "Dorado",
    district: "La Molina",
    location: "Parque Central, La Molina",
    date: "2026-07-10",
    description:
      "Simba volvió a casa gracias a un vecino que lo reconoció por su publicación en PAWLY. ¡Gracias comunidad!",
    status: "reencuentro",
    photos: [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=900&q=70",
    ],
    phone: "+51 981 777 888",
    whatsapp: "51981777888",
    owner: "Familia Torres",
    coords: { x: 40, y: 30 },
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
    address: "Av. Primavera 450, Surco",
    phone: "+51 601 456 789",
    verified: true,
    coords: { x: 38, y: 58 },
  },
  {
    id: "p2",
    name: "Veterinaria San Roque",
    type: "veterinaria",
    address: "Calle Los Pinos 120, San Isidro",
    phone: "+51 601 222 334",
    verified: true,
    coords: { x: 68, y: 36 },
  },
  {
    id: "p3",
    name: "Refugio Nuevo Amanecer",
    type: "refugio",
    address: "Av. Brasil 1450, Jesús María",
    phone: "+51 601 888 112",
    verified: false,
    coords: { x: 22, y: 48 },
  },
  {
    id: "p4",
    name: "Clínica Veterinaria Huellitas",
    type: "veterinaria",
    address: "Av. Benavides 980, Miraflores",
    phone: "+51 601 445 909",
    verified: true,
    coords: { x: 55, y: 72 },
  },
];

const PETS_KEY = "petnova:pets";
const FAVS_KEY = "petnova:favs";
const USER_KEY = "petnova:user";
const THEME_KEY = "petnova:theme";

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

export interface AppUser {
  name: string;
  email: string;
  phone?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setUser(read<AppUser | null>(USER_KEY, null));
    setReady(true);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("petnova:update", sync);
    return () => window.removeEventListener("petnova:update", sync);
  }, [sync]);

  return {
    user,
    ready,
    signIn: (u: AppUser) => {
      window.localStorage.setItem(USER_KEY, JSON.stringify(u));
      emit();
    },
    signOut: () => {
      window.localStorage.removeItem(USER_KEY);
      emit();
    },
  };
}

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = read<string>(THEME_KEY, "light");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, JSON.stringify(next ? "dark" : "light"));
  };

  return { dark, toggle };
}

export function waLink(whatsapp: string, petName: string) {
  const digits = whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hola, te escribo desde PAWLY por la publicación de ${petName}.`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}
