import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header, NumField, Row } from "./_app.profit";

export const Route = createFileRoute("/_app/roi")({ component: RoiCalc });

function RoiCalc() {
  const [f, setF] = useState({ cost: 10, sellPrice: 29.99, fees: 8, units: 100 });

  const r = useMemo(() => {
    const profitPerUnit = f.sellPrice - f.cost - f.fees;
    const totalProfit = profitPerUnit * f.units;
    const totalCost = f.cost * f.units;
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const margin = f.sellPrice > 0 ? (profitPerUnit / f.sellPrice) * 100 : 0;
    return { profitPerUnit, totalProfit, totalCost, roi, margin };
  }, [f]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Header title="ROI Calculator" subtitle="See return on investment for a batch of units." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Investment inputs</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <NumField label="Cost per unit ($)" value={f.cost} onChange={(v) => setF({ ...f, cost: v })} />
            <NumField label="Selling price ($)" value={f.sellPrice} onChange={(v) => setF({ ...f, sellPrice: v })} />
            <NumField label="Total fees per unit ($)" value={f.fees} onChange={(v) => setF({ ...f, fees: v })} />
            <NumField label="Units purchased" value={f.units} step="1" onChange={(v) => setF({ ...f, units: v })} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-sidebar text-sidebar-foreground">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Total invested" value={`$${r.totalCost.toFixed(2)}`} />
            <Row label="Profit / unit" value={`$${r.profitPerUnit.toFixed(2)}`} />
            <Row label="Total profit" value={`$${r.totalProfit.toFixed(2)}`} />
            <Row label="Margin" value={`${r.margin.toFixed(1)}%`} />
            <div className="rounded-xl bg-brand p-4 text-brand-foreground">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">ROI</div>
              <div className="text-3xl font-black">{r.roi.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
