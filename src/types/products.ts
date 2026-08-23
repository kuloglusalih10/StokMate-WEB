import type { Product, ProductListParams } from "../services/products";
import type { Category } from "../services/categories";
import type { Brand } from "../services/brands";
import type { Supplier } from "../services/suppliers";

export type SortKey = NonNullable<ProductListParams["sort"]>;

export type ChipKey = "all" | "low" | "out" | "featured" | "pasif";

export type NewProductFormValues = {
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

export type NewProductDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (created: Product) => void;
};

export type QuickCreateCategoryFormValues = {
  name: string;
};

export type QuickCreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (category: Category) => void;
};

export type QuickCreateBrandFormValues = {
  name: string;
};

export type QuickCreateBrandModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (brand: Brand) => void;
};

export type QuickCreateSupplierFormValues = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

export type QuickCreateSupplierModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (supplier: Supplier) => void;
};
