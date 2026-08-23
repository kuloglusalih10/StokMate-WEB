import { request } from "../request";

export type Product = {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  brandId: number;
  brandName: string;
  price: number;
  stock: number;
  minStock: number;
  unit: number;
  status: number;
  isFeatured: boolean;
  updatedAt: string;
};

export type ProductDetail = Product & {
  supplierId: number;
  supplierName: string;
  costPrice: number;
  description: string;
  createdAt: string;
};

export type ProductListParams = {
  q?: string;
  categoryId?: number;
  brandId?: number;
  status?: number;
  page?: number;
  pageSize?: number;
  sort?: "name" | "price" | "stock" | "updatedAt" | "category" | "brand" | "status";
  dir?: "asc" | "desc";
};

export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProductStats = {
  total: number;
  outOfStock: number;
  lowStock: number;
  totalInventoryValue: number;
};

const buildQuery = (params: Record<string, unknown>) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const queryString = search.toString();
  return queryString ? `?${queryString}` : "";
};

export const getProducts = (params: ProductListParams = {}) =>
  request<ProductListResponse>(`/products${buildQuery(params)}`, "GET");

export const getProductStats = () => request<ProductStats>("/products/stats", "GET");

export const getProductById = (id: number) => request<ProductDetail>(`/products/${id}`, "GET");

export const deleteProduct = (id: number) => request<void>(`/products/${id}`, "DELETE");

export type ProductUpdatePayload = {
  name: string;
  sku: string;
  barcode: string;
  categoryId: number;
  brandId: number;
  supplierId: number;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: number;
  status: number;
  description: string;
  isFeatured: boolean;
};

export const updateProduct = (id: number, payload: ProductUpdatePayload) =>
  request<Product>(`/products/${id}`, "PUT", payload);

export type ProductCreatePayload = {
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
  isFeatured?: boolean;
};

export const createProduct = (payload: ProductCreatePayload) =>
  request<Product>("/products", "POST", payload);
