import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Package, TrendingUp, Calculator, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [li, setLi] = useState({ email: "", password: "" });
  const [rg, setRg] = useState({ name: "", email: "", password: "" });

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = login(li.email, li.password);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Welcome back!");
    nav({ to: "/dashboard" });
  };

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = register(rg.name, rg.email, rg.password);
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Account created");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-brand-foreground text-lg font-black">
            A
          </div>
          <div className="text-lg font-bold">Seller Toolkit</div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-black leading-tight">
            Sell smarter on <span className="text-brand">Amazon</span>.
          </h1>
          <p className="max-w-md text-sidebar-foreground/70">
            Calculate profit, FBA fees, ROI and break-even in seconds. Track inventory and
            monitor sales — all in one professional dashboard.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: TrendingUp, label: "Profit Insights" },
              { icon: Calculator, label: "FBA Calculator" },
              { icon: Package, label: "Inventory Tracker" },
              { icon: BarChart3, label: "Sales Analytics" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-sm"
              >
                <f.icon className="h-4 w-4 text-brand" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© Seller Toolkit</div>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md border-border/80 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-brand-foreground font-black">
                A
              </div>
              <div className="text-base font-bold">Seller Toolkit</div>
            </div>
            <h2 className="text-2xl font-bold">Get started</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Sign in or create an account to access your dashboard.
            </p>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <form onSubmit={submitLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="li-email">Email</Label>
                    <Input
                      id="li-email"
                      type="email"
                      required
                      value={li.email}
                      onChange={(e) => setLi({ ...li, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="li-pass">Password</Label>
                    <Input
                      id="li-pass"
                      type="password"
                      required
                      value={li.password}
                      onChange={(e) => setLi({ ...li, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                    Sign in
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <form onSubmit={submitRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rg-name">Name</Label>
                    <Input
                      id="rg-name"
                      required
                      value={rg.name}
                      onChange={(e) => setRg({ ...rg, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg-email">Email</Label>
                    <Input
                      id="rg-email"
                      type="email"
                      required
                      value={rg.email}
                      onChange={(e) => setRg({ ...rg, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg-pass">Password</Label>
                    <Input
                      id="rg-pass"
                      type="password"
                      required
                      minLength={6}
                      value={rg.password}
                      onChange={(e) => setRg({ ...rg, password: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Data is saved locally in your browser.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
