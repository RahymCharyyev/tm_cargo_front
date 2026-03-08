import Cookies from 'js-cookie';

const API_BASE = '/api';

export const TOKEN_KEY = 'cargo_token';

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 30, sameSite: 'lax' });
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOpts } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    ...(fetchOpts.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(fetchOpts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...fetchOpts,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody.message || response.statusText, errorBody);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Convenience methods
export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined | null>) =>
    apiRequest<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    }),
};
