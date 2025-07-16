export interface PaginationMeta {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  }
  
export interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination: PaginationMeta;
    };
}

export interface DataResponse<T> {
  attributes: T,
  id: number
}