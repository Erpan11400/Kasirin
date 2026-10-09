export interface ApiResponse<T = any> {
  statusCode: number;
  status: 'success' | 'failed';
  message: string;
  data: T;
}
