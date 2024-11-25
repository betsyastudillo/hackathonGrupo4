// Archivo barril
export * from "./models/companies";
export * from "./models/error";
export * from "./models/menus";
export * from "./models/user";
export * from "./models/profiles";
export * from "./models/sales";
export * from "./models/parametersApps";
export * from "./models/locations";
export * from "./models/category";
export * from "./models/report";
export * from "./models/integrationKey";
export * from "./models/push";
export * from "./models/pushUpload";
export * from "./models/pushUploadDet";
export * from "./models/paymentsMeans";

// Defino el objeto primario
export interface Data<T> {
  message: string;
  status: boolean;
  data: T
}

export interface DataRequest {
  token?: string;
  params: string;
  bodyOptions?: Array<any>;
}

export interface DataCreate {
  token: string;
  bodyOptions: Array<any>;
}