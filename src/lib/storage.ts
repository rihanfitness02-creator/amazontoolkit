import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  stock: number;
  reorderAt: number;
  cost: number;
  price: number;
  updatedAt: number;
};

export type Sale = {
  id: string;
  date: string; // yyyy-mm-dd
  sku: string;
  units: number;
  revenue: number;
  profit: number;
};
