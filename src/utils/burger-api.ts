import { TIngredient, TOrder, TUser } from './types';
import { storeCookie, retrieveCookie } from './cookie';

const API_BASE_URL = process.env.BURGER_API_URL;

type TApiResponse<T> = T & { success: boolean };
type TApiError = { message: string };
type TRequestOptions = RequestInit;

type TTokenRefreshResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TMenuItemsResponse = TApiResponse<{
  data: TIngredient[];
}>;

type TOrdersStreamResponse = TApiResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrderSubmissionResponse = TApiResponse<{
  order: TOrder;
  name: string;
}>;

type TOrderDetailsResponse = TApiResponse<{
  orders: TOrder[];
}>;

type TAccountRegistration = {
  email: string;
  name: string;
  password: string;
};

type TAuthenticationResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

type TAccountResponse = TApiResponse<{
  user: TUser;
}>;

type TPasswordResetRequest = {
  email: string;
};

type TPasswordResetConfirm = {
  password: string;
  token: string;
};

type TAccountCredentials = {
  email: string;
  password: string;
};

// экспортируем типы, чтобы мы могли использовать это как контракты к нашему API
export type {
  TAccountRegistration,
  TAccountResponse,
  TAccountCredentials,
  TApiResponse,
  TAuthenticationResponse,
  TMenuItemsResponse,
  TOrderDetailsResponse,
  TOrderSubmissionResponse,
  TOrdersStreamResponse,
  TPasswordResetConfirm,
  TPasswordResetRequest,
  TTokenRefreshResponse
};

const checkResponse = <T>(response: Response): Promise<TApiResponse<T>> => {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((error) => Promise.reject(error));
};

const checkSuccess = <T>(data: TApiResponse<T>): Promise<T> => {
  if (data?.success) {
    return Promise.resolve(data);
  }
  return Promise.reject(data);
};

const request = async <T>(
  endpoint: string,
  options: TRequestOptions = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await checkResponse<T>(response);
  return checkSuccess(data);
};

const requestWithTokenRenewal = async <T>(
  endpoint: string,
  options: TRequestOptions = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        authorization: retrieveCookie('accessToken') || ''
      } as HeadersInit
    });
  } catch (error) {
    if ((error as TApiError).message === 'jwt expired') {
      const tokenData = await renewAccessToken();
      return request<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: tokenData.accessToken
        } as HeadersInit
      });
    }
    return Promise.reject(error);
  }
};

export const renewAccessToken = (): Promise<TTokenRefreshResponse> =>
  request<TTokenRefreshResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((tokenData) => {
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    storeCookie('accessToken', tokenData.accessToken);
    return tokenData;
  });

export const fetchMenuItemsApi = () =>
  request<TMenuItemsResponse>('/ingredients').then((data) => data.data);

export const fetchOrdersStreamApi = () =>
  request<TOrdersStreamResponse>('/orders/all');

export const fetchUserOrdersApi = () =>
  requestWithTokenRenewal<TOrdersStreamResponse>('/orders').then(
    (data) => data.orders
  );

export const submitOrderApi = (itemIds: string[]) =>
  requestWithTokenRenewal<TOrderSubmissionResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      ingredients: itemIds
    })
  });

export const fetchOrderByIdApi = (orderNumber: number) =>
  request<TOrderDetailsResponse>(`/orders/${orderNumber}`);

export const createAccountApi = (registrationData: TAccountRegistration) =>
  request<TAuthenticationResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(registrationData)
  });

export const authenticateApi = (credentials: TAccountCredentials) =>
  request<TAuthenticationResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(credentials)
  });

export const requestPasswordResetApi = (emailData: { email: string }) =>
  request<TApiResponse<{}>>('/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(emailData)
  });

export const confirmPasswordResetApi = (resetData: {
  password: string;
  token: string;
}) =>
  request<TApiResponse<{}>>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(resetData)
  });

export const fetchAccountApi = () =>
  requestWithTokenRenewal<TAccountResponse>('/auth/user');

export const modifyAccountApi = (userData: Partial<TAccountRegistration>) =>
  requestWithTokenRenewal<TAccountResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(userData)
  });

export const signOutApi = () =>
  request<TApiResponse<{}>>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
