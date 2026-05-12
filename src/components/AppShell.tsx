import { CyberBackdrop } from "@/components/CyberBackdrop";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Bell, Github } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <CyberBackdrop />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/40 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-safe shadow-[0_0_10px_oklch(0.78_0.18_155)]" />
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">SOC online</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/scanner" className="hidden text-xs text-muted-foreground hover:text-primary sm:block">
                Quick scan
              </Link>
              <button className="rounded-md border border-border/70 bg-card/50 p-2 text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4" />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border/70 bg-card/50 p-2 text-muted-foreground hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
