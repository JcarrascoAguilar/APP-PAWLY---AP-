import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/pawly-logo.png.asset.json";

export const Route = createFileRoute("/bienvenida")({
  head: () => ({
    meta: [
      { title: "Bienvenido a PAWLY — Conectando mascotas con un hogar" },
      {
        name: "description",
        content:
          "Inicia sesión o regístrate en PAWLY para reportar mascotas perdidas, encontradas y adoptar de forma responsable.",
      },
      { property: "og:title", content: "Bienvenido a PAWLY" },
      {
        property: "og:description",
        content: "Conectando mascotas con un hogar. Crea tu cuenta y únete a la comunidad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bienvenida,
});

function Bienvenida() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <img
        src={logo.url}
        alt="Logo de PAWLY"
        width={140}
        height={140}
        className="animate-fade-up size-32"
      />
      <h1 className="animate-fade-up mt-6 text-4xl font-extrabold tracking-tight text-foreground">
        PAW<span className="text-accent">LY</span>
      </h1>
      <p className="animate-fade-up mt-2 text-base text-muted-foreground">
        Conectando mascotas con un hogar.
      </p>

      <div className="animate-fade-up mt-10 w-full max-w-xs space-y-3">
        <Link
          to="/auth"
          search={{ modo: "login" }}
          className="block rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/auth"
          search={{ modo: "registro" }}
          className="block rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-bold text-foreground"
        >
          Registrarse
        </Link>
        <Link to="/" className="block py-2 text-xs font-semibold text-muted-foreground">
          Explorar sin cuenta
        </Link>
      </div>
    </div>
  );
}
