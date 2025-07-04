// Unified API Interface Types
// This defines the common API structure that all stacks must implement

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
}

export interface PostFilters extends PaginationParams {
  search?: string;
  authorId?: string;
  published?: boolean;
  tags?: string[];
}

// API Methods Interface
export interface UserApi {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>>;
  getById(id: string): Promise<ApiResponse<User>>;
  getByEmail(email: string): Promise<ApiResponse<User>>;
  update(id: string, updates: Partial<User>): Promise<ApiResponse<User>>;
  delete(id: string): Promise<ApiResponse<void>>;
  list(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<User>>>;
}

export interface PostApi {
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Post>>;
  getById(id: string): Promise<ApiResponse<Post>>;
  update(id: string, updates: Partial<Post>): Promise<ApiResponse<Post>>;
  delete(id: string): Promise<ApiResponse<void>>;
  list(filters?: PostFilters): Promise<ApiResponse<PaginatedResponse<Post>>>;
  getByAuthor(authorId: string, filters?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Post>>>;
}

export interface CommentApi {
  create(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>>;
  getById(id: string): Promise<ApiResponse<Comment>>;
  update(id: string, updates: Partial<Comment>): Promise<ApiResponse<Comment>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getByPost(postId: string, filters?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Comment>>>;
}

export interface AuthApi {
  login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>>;
  register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(): Promise<ApiResponse<{ token: string }>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
}

// Main API Interface
export interface Api {
  users: UserApi;
  posts: PostApi;
  comments: CommentApi;
  auth: AuthApi;
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public fields?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
} 