export interface IBrandResponse {
  success: boolean;
  message: string;
  data: Array<IBrand>;
}

export interface IBrand {
  brandId: string;
  brandName: string;
  manufacturerName: string;
  manufacturerId: string;
  isActive: boolean,
  createdAt: string;
}
