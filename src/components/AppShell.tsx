import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Home, MapPin, Moon, PlusCircle, Sun, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/petnova";
import logo from "@/assets/pawly-logo.png.asset.json";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Buscar", icon: Compass },
  { to: "/publicar", label: "Publicar", icon: PlusCircle },
  { to: "/mapa", label: "Mapa", icon: MapPin },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src={logo.url} alt="Logo PAWLY" width={40} height={40} className="size-9 shrink-0" />
            <span className="truncate text-lg font-extrabold tracking-tight text-foreground">
              PAW<span className="text-accent">LY</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/reencuentros"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Reencuentros
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Cambiar tema"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
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
