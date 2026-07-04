import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Header, NumField, Row } from "./_app.profit";

export const Route = createFileRoute("/_app/fba")({ component: FbaCalc });

const tiers = [
  { key: "small-std", label: "Small standard (≤1 lb)", fee: 3.22 },
  { key: "large-std-1", label: "Large standard (≤1 lb)", fee: 4.09 },
  { key: "large-std-2", label: "Large standard (1–2 lb)", fee: 4.99 },
  { key: "large-std-3", label: "Large standard (2–3 lb)", fee: 5.42 },
  { key: "large-oversize", label: "Large oversize (≤50 lb)", fee: 10.5 },
];

function FbaCalc() {
  const [size, setSize] = useState(tiers[0].key);
  const [f, setF] = useState({ weight: 0.8, storageMonths: 1, storageCuFt: 0.05, category: 15 });

  const r = useMemo(() => {
    const tier = tiers.find((t) => t.key === size)!;
    const fulfillment = tier.fee + (f.weight > 3 ? (f.weight - 3) * 0.38 : 0);
    const storage = f.storageCuFt * 0.87 * f.storageMonths;
    const total = fulfillment + storage;
    return { fulfillment, storage, total, tier };
  }, [size, f]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Header title="FBA Fee Calculator" subtitle="Estimate Amazon FBA fulfillment and storage costs." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Package details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Size tier</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((t) => (
                    <SelectItem key={t.key} value={t.key}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <NumField label="Unit weight (lb)" value={f.weight} onChange={(v) => setF({ ...f, weight: v })} />
            <NumField label="Category referral fee (%)" value={f.category} onChange={(v) => setF({ ...f, category: v })} />
            <NumField label="Storage volume (cu ft)" value={f.storageCuFt} onChange={(v) => setF({ ...f, storageCuFt: v })} />
            <NumField label="Storage months" value={f.storageMonths} step="1" onChange={(v) => setF({ ...f, storageMonths: v })} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-sidebar text-sidebar-foreground">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">Estimated FBA fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Tier base fee" value={`$${r.tier.fee.toFixed(2)}`} />
            <Row label="Fulfillment" value={`$${r.fulfillment.toFixed(2)}`} />
            <Row label="Monthly storage" value={`$${r.storage.toFixed(2)}`} />
            <div className="rounded-xl bg-brand p-4 text-brand-foreground">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Total FBA cost</div>
              <div className="text-3xl font-black">${r.total.toFixed(2)}</div>
            </div>
            <p className="text-xs text-sidebar-foreground/60">
              Approximate. Actual fees depend on dimensions, season and category.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
