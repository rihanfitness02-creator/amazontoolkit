import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLocalState, type InventoryItem } from "@/lib/storage";
import { Package, Plus, Trash2, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

const empty: Omit<InventoryItem, "id" | "updatedAt"> = {
  sku: "",
  name: "",
  stock: 0,
  reorderAt: 10,
  cost: 0,
  price: 0,
};

function Inventory() {
  const [items, setItems] = useLocalState<InventoryItem[]>("ast_inventory", []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ ...empty });

  const startAdd = () => {
    setEditing(null);
    setForm({ ...empty });
    setOpen(true);
  };
  const startEdit = (i: InventoryItem) => {
    setEditing(i);
    setForm({ sku: i.sku, name: i.name, stock: i.stock, reorderAt: i.reorderAt, cost: i.cost, price: i.price });
    setOpen(true);
  };

  const save = () => {
    if (!form.sku || !form.name) return toast.error("SKU and name are required");
    if (editing) {
      setItems(items.map((i) => (i.id === editing.id ? { ...editing, ...form, updatedAt: Date.now() } : i)));
      toast.success("Item updated");
    } else {
      setItems([
        ...items,
        { id: crypto.randomUUID(), ...form, updatedAt: Date.now() },
      ]);
      toast.success("Item added");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    toast.success("Item removed");
  };

  const totalValue = items.reduce((s, i) => s + i.stock * i.cost, 0);
  const lowCount = items.filter((i) => i.stock <= i.reorderAt).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Inventory tracker</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} SKUs · ${totalValue.toFixed(2)} inventory value
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startAdd} className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="mr-1 h-4 w-4" /> Add product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
              <Field label="Product name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <NumberField label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
              <NumberField label="Reorder at" value={form.reorderAt} onChange={(v) => setForm({ ...form, reorderAt: v })} />
              <NumberField label="Cost / unit" value={form.cost} onChange={(v) => setForm({ ...form, cost: v })} step="0.01" />
              <NumberField label="Sell price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} step="0.01" />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} className="bg-brand text-brand-foreground hover:bg-brand/90">
                {editing ? "Save changes" : "Add product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {lowCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span>
            {lowCount} product{lowCount > 1 ? "s" : ""} at or below reorder threshold.
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-brand" /> Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No products yet. Add your first SKU to start tracking inventory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((i) => {
                    const low = i.stock <= i.reorderAt;
                    return (
                      <TableRow key={i.id}>
                        <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                        <TableCell className="font-medium">{i.name}</TableCell>
                        <TableCell className="text-right">{i.stock}</TableCell>
                        <TableCell className="text-right">${i.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${i.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {low ? (
                            <Badge variant="destructive">Reorder</Badge>
                          ) : (
                            <Badge className="bg-success text-success-foreground hover:bg-success/90">
                              In stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => startEdit(i)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function NumberField({
  label,
  value,
  onChange,
  step = "1",
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
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
