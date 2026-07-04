import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalState, type Sale, type InventoryItem } from "@/lib/storage";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, ShoppingCart, TrendingUp, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function seedSales(): Sale[] {
  const skus = ["SKU-001", "SKU-002", "SKU-003", "SKU-004"];
  const out: Sale[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const n = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      const sku = skus[Math.floor(Math.random() * skus.length)];
      const units = 1 + Math.floor(Math.random() * 6);
      const revenue = +(units * (15 + Math.random() * 40)).toFixed(2);
      const profit = +(revenue * (0.15 + Math.random() * 0.25)).toFixed(2);
      out.push({ id: `${date}-${k}-${sku}`, date, sku, units, revenue, profit });
    }
  }
  return out;
}

function Dashboard() {
  const [sales, setSales] = useLocalState<Sale[]>("ast_sales", []);
  const [inv] = useLocalState<InventoryItem[]>("ast_inventory", []);

  const seed = () => setSales(seedSales());

  const stats = useMemo(() => {
    const revenue = sales.reduce((s, x) => s + x.revenue, 0);
    const profit = sales.reduce((s, x) => s + x.profit, 0);
    const orders = sales.length;
    const units = sales.reduce((s, x) => s + x.units, 0);
    return { revenue, profit, orders, units };
  }, [sales]);

  const daily = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; profit: number }>();
    sales.forEach((s) => {
      const d = map.get(s.date) || { date: s.date, revenue: 0, profit: 0 };
      d.revenue += s.revenue;
      d.profit += s.profit;
      map.set(s.date, d);
    });
    return Array.from(map.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, day: d.date.slice(5) }));
  }, [sales]);

  const bySku = useMemo(() => {
    const map = new Map<string, { sku: string; revenue: number; units: number }>();
    sales.forEach((s) => {
      const d = map.get(s.sku) || { sku: s.sku, revenue: 0, units: 0 };
      d.revenue += s.revenue;
      d.units += s.units;
      map.set(s.sku, d);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  const pie = bySku.slice(0, 5);
  const pieColors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ];

  const cards = [
    { title: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, tint: "bg-primary/10 text-primary" },
    { title: "Profit", value: `$${stats.profit.toFixed(2)}`, icon: TrendingUp, tint: "bg-success/10 text-success" },
    { title: "Orders", value: stats.orders.toString(), icon: ShoppingCart, tint: "bg-brand/15 text-brand" },
    { title: "Units Sold", value: stats.units.toString(), icon: Package, tint: "bg-accent text-accent-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Sales overview</h2>
          <p className="text-sm text-muted-foreground">
            {sales.length ? "Last 30 days of activity." : "No data yet — seed a demo dataset to explore charts."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={seed}>
            <Plus className="mr-1 h-4 w-4" /> Seed demo data
          </Button>
          {sales.length > 0 && (
            <Button variant="ghost" onClick={() => setSales([])}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.tint}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.title}</div>
                <div className="truncate text-xl font-bold">{c.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & profit trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {daily.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prof" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" fill="url(#rev)" />
                  <Area type="monotone" dataKey="profit" stroke="var(--color-chart-1)" fill="url(#prof)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top SKUs by revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {pie.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="revenue"
                    nameKey="sku"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pie.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Units sold by SKU</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {bySku.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySku}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="sku" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Bar dataKey="units" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory status</CardTitle>
          </CardHeader>
          <CardContent>
            {inv.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No inventory yet. Add products in the Inventory Tracker.
              </p>
            ) : (
              <div className="space-y-3">
                {inv.slice(0, 6).map((i) => {
                  const low = i.stock <= i.reorderAt;
                  return (
                    <div key={i.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{i.name}</div>
                        <div className="text-xs text-muted-foreground">{i.sku}</div>
                      </div>
                      <div className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${low ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                        {i.stock} in stock
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-full place-items-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}
