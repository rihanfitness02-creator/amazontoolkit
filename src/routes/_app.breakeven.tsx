import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header, NumField, Row } from "./_app.profit";

export const Route = createFileRoute("/_app/breakeven")({ component: BreakEven });

function BreakEven() {
  const [f, setF] = useState({ fixedCosts: 500, sellPrice: 29.99, variableCost: 15 });

  const r = useMemo(() => {
    const contribution = f.sellPrice - f.variableCost;
    const units = contribution > 0 ? Math.ceil(f.fixedCosts / contribution) : Infinity;
    const revenue = units * f.sellPrice;
    return { contribution, units, revenue };
  }, [f]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Header title="Break-even Calculator" subtitle="How many units you need to cover fixed costs." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Cost structure</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <NumField label="Fixed costs ($)" value={f.fixedCosts} onChange={(v) => setF({ ...f, fixedCosts: v })} />
            <NumField label="Selling price / unit ($)" value={f.sellPrice} onChange={(v) => setF({ ...f, sellPrice: v })} />
            <NumField label="Variable cost / unit ($)" value={f.variableCost} onChange={(v) => setF({ ...f, variableCost: v })} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-sidebar text-sidebar-foreground">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">Break-even point</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Contribution / unit" value={`$${r.contribution.toFixed(2)}`} />
            <div className="rounded-xl bg-brand p-4 text-brand-foreground">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Break-even units</div>
              <div className="text-3xl font-black">
                {Number.isFinite(r.units) ? r.units.toLocaleString() : "∞"}
              </div>
            </div>
            <Row label="Revenue at break-even" value={Number.isFinite(r.units) ? `$${r.revenue.toFixed(2)}` : "—"} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
