export interface IPagingAndSortRequest {
  page?: number;
  size?: number;
}

export interface IMeta {
  code: number;
  message: string;
}

export interface IResponse<T> {
  meta: IMeta[];
  data: T;
}

export interface IPageResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  data: T;
}


export interface IResponseN<T> {
  total: number;
  data: T;
}

export interface Auditing {
  createdBy?: string;
  createdDate?: string; // ISO timestamp
  lastModifiedBy?: string;
  lastModifiedDate?: string; // ISO timestamp
}