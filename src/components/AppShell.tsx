import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Home, MapPin, PawPrint, PlusCircle, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/publicar", label: "Publicar", icon: PlusCircle },
  { to: "/mapa", label: "Mapa", icon: MapPin },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              PET<span className="text-accent">NOVA</span>
            </span>
          </Link>
          <Link
            to="/mis-publicaciones"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Mis publicaciones
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-stretch justify-between px-2 py-2">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "fill-primary/10")} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
