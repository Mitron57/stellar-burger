import { TIngredient, TOrder, TUser } from './types';
import { storeCookie, retrieveCookie } from './cookie';

const API_BASE_URL = process.env.BURGER_API_URL;

const checkResponse = <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((error) => Promise.reject(error));
};

const checkSuccess = <T>(data: T & { success: boolean }): Promise<T> => {
  if (data?.success) {
    return Promise.resolve(data);
  }
  return Promise.reject(data);
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await checkResponse<T & { success: boolean }>(response);
  return checkSuccess(data);
};

const requestWithTokenRenewal = async <T>(
  endpoint: string,
  options: RequestInit = {}
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
    if ((error as { message: string }).message === 'jwt expired') {
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

type TTokenRefreshResponse = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
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

type TMenuItemsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const fetchMenuItemsApi = () =>
  request<TMenuItemsResponse>('/ingredients').then((data) => data.data);

type TOrdersStreamResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const fetchOrdersStreamApi = () =>
  request<TOrdersStreamResponse>('/orders/all');

export const fetchUserOrdersApi = () =>
  requestWithTokenRenewal<TOrdersStreamResponse>('/orders').then(
    (data) => data.orders
  );

type TOrderSubmissionResponse = {
  success: boolean;
  order: TOrder;
  name: string;
};

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

type TOrderDetailsResponse = {
  success: boolean;
  orders: TOrder[];
};

export const fetchOrderByIdApi = (orderNumber: number) =>
  request<TOrderDetailsResponse>(`/orders/${orderNumber}`);

export type TAccountRegistration = {
  email: string;
  name: string;
  password: string;
};

type TAuthenticationResponse = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser;
};

export const createAccountApi = (registrationData: TAccountRegistration) =>
  request<TAuthenticationResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(registrationData)
  });

export type TAccountCredentials = {
  email: string;
  password: string;
};

export const authenticateApi = (credentials: TAccountCredentials) =>
  request<TAuthenticationResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(credentials)
  });

export const requestPasswordResetApi = (emailData: { email: string }) =>
  request<{ success: boolean }>('/password-reset', {
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
  request<{ success: boolean }>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(resetData)
  });

type TAccountResponse = {
  success: boolean;
  user: TUser;
};

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
  request<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
