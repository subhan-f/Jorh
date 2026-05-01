export type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    cursor?: string;
    hasMore?: boolean;
  };
};

export function ok<T>(data: T, meta?: ApiResponse<T>["meta"]): ApiResponse<T> {
  const res: ApiResponse<T> = { data, error: null };
  if (meta !== undefined) res.meta = meta;
  return res;
}

export function err<T = null>(code: string, message: string): ApiResponse<T> {
  return { data: null, error: { code, message } };
}

export type PaginationQuery = {
  limit?: number;
  cursor?: string;
  page?: number;
};
