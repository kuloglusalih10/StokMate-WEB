import { request } from "../request";

export type Brand = {
  id: number;
  name: string;
};

export const getBrands = () => request<Brand[]>("/brands", "GET");

export type CreateBrandPayload = {
  name: string;
};

export const createBrand = (payload: CreateBrandPayload) =>
  request<Brand>("/brands", "POST", payload);
