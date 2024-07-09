export interface IProduct {
  id: string;
  productCode: string;
  productName: string;
  producDescription: string;
  picture?: {
    fileName: string;
    fileSrc: string;
  };
  isActive: boolean;
  cost: number;
  price: number;
  stockId?: string;
  brandId: string;
  categoryId: string;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

export interface INewProduct {
  productCode: string;
  ProductName: string;
  cost: number;
  price: number;
  brandId: string;
  categoryId: string;
}


export interface IProductResponse {
  success: boolean;
  message: string;
  data: Array<IProduct>;
}
