import type { Category } from "../services/categories";
import type { Brand } from "../services/brands";
import type { Supplier } from "../services/suppliers";

export type TabKey = "categories" | "brands" | "suppliers";

export type CategoryFormValues = {
  name: string;
};

export type CategoryFormModalProps = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: (category: Category) => void;
};

export type BrandFormValues = {
  name: string;
};

export type BrandFormModalProps = {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSaved: (brand: Brand) => void;
};

export type SupplierFormValues = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

export type SupplierFormModalProps = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSaved: (supplier: Supplier) => void;
};
