export interface PaginationResponse<T> {
  items: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}
