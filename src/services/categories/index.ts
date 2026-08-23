import { request } from "../request";

export type Category = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  color: string;
};

export const getCategories = () => request<Category[]>("/categories", "GET");

export type CreateCategoryPayload = {
  name: string;
  color?: string;
};

export const createCategory = (payload: CreateCategoryPayload) =>
  request<Category>("/categories", "POST", payload);
