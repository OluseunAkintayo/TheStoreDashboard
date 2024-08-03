export interface IProduct {
  id: string;
  productCode: string;
  productName: string;
  productDescription: string;
  cost: number;
  price: number;
  stockId: string;
  quantity: number;
  reorderLevel: number;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  pictures?: Array<string>;
  isActive: boolean;
  createdBy?: string;
  modifiedAt?: string;
}

export interface INewProduct {
  productCode: string;
  productName: string;
  description: string;
  cost: number;
  price: number;
  categoryId: string;
  pictures: Array<string | undefined>;
  brandId: string;
}

export interface IProductResponse {
  success: boolean;
  message: string;
  data: Array<IProduct>;
}

export interface IUploadResponse {
  success: boolean,
  message: string,
  pictureUri: Array<string>
}
