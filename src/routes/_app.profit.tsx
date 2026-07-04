import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/profit")({ component: ProfitCalc });

function ProfitCalc() {
  const [f, setF] = useState({ price: 29.99, cost: 8, fbaFees: 6.5, referral: 15, shipping: 2, misc: 0 });

  const r = useMemo(() => {
    const referralFee = (f.price * f.referral) / 100;
    const totalFees = referralFee + Number(f.fbaFees) + Number(f.shipping) + Number(f.misc);
    const profit = f.price - Number(f.cost) - totalFees;
    const margin = f.price > 0 ? (profit / f.price) * 100 : 0;
    const roi = f.cost > 0 ? (profit / Number(f.cost)) * 100 : 0;
    return { referralFee, totalFees, profit, margin, roi };
  }, [f]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Header title="Amazon Profit Calculator" subtitle="Calculate net profit, margin and ROI for a single sale." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Product inputs</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <NumField label="Selling price ($)" value={f.price} onChange={(v) => setF({ ...f, price: v })} />
            <NumField label="Product cost ($)" value={f.cost} onChange={(v) => setF({ ...f, cost: v })} />
            <NumField label="Amazon referral fee (%)" value={f.referral} onChange={(v) => setF({ ...f, referral: v })} />
            <NumField label="FBA fulfillment fee ($)" value={f.fbaFees} onChange={(v) => setF({ ...f, fbaFees: v })} />
            <NumField label="Inbound shipping ($)" value={f.shipping} onChange={(v) => setF({ ...f, shipping: v })} />
            <NumField label="Other costs ($)" value={f.misc} onChange={(v) => setF({ ...f, misc: v })} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-sidebar text-sidebar-foreground">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Referral fee" value={`$${r.referralFee.toFixed(2)}`} />
            <Row label="Total fees" value={`$${r.totalFees.toFixed(2)}`} />
            <div className="rounded-xl bg-brand p-4 text-brand-foreground">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Net profit / unit</div>
              <div className="text-3xl font-black">${r.profit.toFixed(2)}</div>
            </div>
            <Row label="Profit margin" value={`${r.margin.toFixed(1)}%`} />
            <Row label="ROI" value={`${r.roi.toFixed(1)}%`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function NumField({
  label,
  value,
  onChange,
  step = "0.01",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sidebar-border pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-sidebar-foreground/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
