import type { ProductDetail, StockHistoryPoint } from "../services/products";

export type StockTrendChartProps = {
  history: StockHistoryPoint[];
  minStock: number;
};

export type EditProductFormValues = {
  name: string;
  sku: string;
  barcode?: string;
  categoryId: number;
  brandId: number;
  supplierId: number;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: number;
  status: number;
  description?: string;
  isFeatured: boolean;
};

export type EditProductDialogProps = {
  open: boolean;
  product: ProductDetail;
  onClose: () => void;
  onUpdated: (updated: ProductDetail) => void;
};

export type StockEntryFormValues = {
  quantity: number;
};

export type StockEntryDialogProps = {
  open: boolean;
  productId: number;
  productName: string;
  onClose: () => void;
  onAdded: () => void;
};
