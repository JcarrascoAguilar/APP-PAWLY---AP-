import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/petnova";
import { cn } from "@/lib/utils";
import logo from "@/assets/petnova-logo.png";

type Modo = "login" | "registro";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { modo: Modo } => ({
    modo: search['modo'] === "registro" ? "registro" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión o registrarse — PETNOVA" },
      {
        name: "description",
        content:
          "Accede a tu cuenta PETNOVA para publicar mascotas, guardar favoritos y recibir alertas cercanas.",
      },
      { property: "og:title", content: "Acceso a PETNOVA" },
      {
        property: "og:description",
        content: "Crea tu cuenta y únete a la comunidad del bienestar animal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary";

function Auth() {
  const { modo } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@") || form.password.length < 6) {
      toast.error("Correo válido y contraseña de al menos 6 caracteres");
      return;
    }
    if (modo === "registro" && !form.name.trim()) {
      toast.error("Ingresa tu nombre");
      return;
    }
    signIn({
      name: form.name.trim().slice(0, 60) || form.email.split("@")[0] || "Usuario",
      email: form.email.trim().slice(0, 120),
      phone: form.phone.trim().slice(0, 30),
    });
    toast.success(modo === "registro" ? "¡Cuenta creada!" : "¡Bienvenido de vuelta!");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <img src={logo} alt="Logo de PETNOVA" width={80} height={80} className="size-16" />
      <h1 className="mt-4 text-2xl font-extrabold text-foreground">
        {modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}
      </h1>

      <div className="mt-6 flex w-full max-w-sm gap-2 rounded-2xl bg-muted p-1">
        {(["login", "registro"] as const).map((m) => (
          <Link
            key={m}
            to="/auth"
            search={{ modo: m }}
            className={cn(
              "flex-1 rounded-xl py-2 text-center text-xs font-bold transition-colors",
              modo === m ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {m === "login" ? "Iniciar sesión" : "Registrarse"}
          </Link>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 w-full max-w-sm space-y-3">
        {modo === "registro" && (
          <input
            className={field}
            placeholder="Nombre completo"
            maxLength={60}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className={field}
          type="email"
          placeholder="Correo electrónico"
          maxLength={120}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {modo === "registro" && (
          <input
            className={field}
            placeholder="Teléfono / WhatsApp"
            maxLength={30}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        )}
        <input
          className={field}
          type="password"
          placeholder="Contraseña"
          maxLength={64}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground"
        >
          {modo === "registro" ? "Registrarme" : "Entrar"}
        </button>
      </form>

      <Link to="/" className="mt-6 text-xs font-semibold text-muted-foreground">
        Volver al inicio
      </Link>
    </div>
  );
}
