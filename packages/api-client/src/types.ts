export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  _id: string;
  slug: string;
  originalUrl: string;
  title?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkStats {
  linkId: string;
  slug: string;
  totalClicks: number;
  uniqueClicks: number;
  lastClickAt?: string;
}

export interface Click {
  _id: string;
  slug: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Auth
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
  password?: string;
}

// Links
export interface CreateLinkBody {
  originalUrl: string;
  slug?: string;
  title?: string;
}

export interface UpdateLinkBody {
  originalUrl?: string;
  title?: string;
}

// Analytics
export interface ClickHistoryQuery {
  page?: number;
  limit?: number;
}
