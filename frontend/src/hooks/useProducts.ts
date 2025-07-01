import { useQuery } from "@tanstack/react-query";

export type ProductFilters = {
  category?: string[];
  type?: string[];
  operatingWeight?: string[];
  oilFlow?: string[];
  applicableCarrier?: string[];
};

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const useProducts = (filters: ProductFilters = {}) => {
  // Only send filters if at least one filter is set
  const hasFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : !!v
  );
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => v && params.append(key, v));
        } else if (value) {
          params.append(key, value);
        }
      });
      const res = await fetch(
        hasFilters && params.size > 0
          ? `${API_URL}/products/filter?${params.toString()}`
          : `${API_URL}/products`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
};
