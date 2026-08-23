import { request } from "../request";

export type Supplier = {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
};

export const getSuppliers = () => request<Supplier[]>("/suppliers", "GET");

export type CreateSupplierPayload = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

export const createSupplier = (payload: CreateSupplierPayload) =>
  request<Supplier>("/suppliers", "POST", payload);

export type UpdateSupplierPayload = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

export const updateSupplier = (id: number, payload: UpdateSupplierPayload) =>
  request<Supplier>(`/suppliers/${id}`, "PUT", payload);
