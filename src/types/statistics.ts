import type { CategoryBreakdownItem } from "../services/products";

export type MatrixFilter = "saglikli" | "kritik" | "tukenen";

export type HealthMatrixRowProps = {
  category: CategoryBreakdownItem;
  maxCount: number;
  filter: MatrixFilter | null;
};

export type CategoryValueChartProps = {
  categories: { key: string; name: string; valueTL: number }[];
  total: number;
  mounted: boolean;
};

export type BrandBarChartProps = {
  brands: { key: string; name: string; count: number }[];
  mounted: boolean;
};

export type SupplierDonutProps = {
  suppliers: { key: string; name: string; count: number }[];
  mounted: boolean;
};
