import { request } from "../request";

export type Brand = {
  id: number;
  name: string;
};

export const getBrands = () => request<Brand[]>("/brands", "GET");
