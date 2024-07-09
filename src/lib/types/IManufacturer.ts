export interface IManufacturerResponse {
  success: boolean;
  message: string;
  data: Array<IManufacturer>;
}

export interface IManufacturer {
  id: string;
  manufacturerName: string;
  isActive: boolean,
  createdBy: string;
  createdAt: string;
  modifiedAt?: string;
  modifiedBy?: string;
}
