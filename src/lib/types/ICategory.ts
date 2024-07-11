export interface ICategoryResponse {
  success: boolean;
  message: string;
  data: Array<ICategory>;
}

export interface ICategory {
  categoryName: string;
  description: string;
  isActive?: boolean,
  createdAt?: string;
}
