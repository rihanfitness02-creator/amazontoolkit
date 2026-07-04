import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const titles: Record<string, string> = {
  "/dashboard": "Sales Dashboard",
  "/inventory": "Inventory Tracker",
  "/profit": "Profit Calculator",
  "/fba": "FBA Fee Calculator",
  "/roi": "ROI Calculator",
  "/breakeven": "Break-even Calculator",
};

function AppLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!user) nav({ to: "/auth", replace: true });
  }, [user, nav]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-1 h-5" />
            <h1 className="truncate text-sm font-semibold">{titles[path] ?? "Seller Toolkit"}</h1>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
