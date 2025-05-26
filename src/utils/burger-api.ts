import { TIngredient, TOrder, TUser } from './types';
import { storeCookie, retrieveCookie } from './cookie';

const API_BASE_URL = process.env.BURGER_API_URL;

const validateResponse = <T>(response: Response): Promise<T> =>
  response.ok
    ? response.json()
    : response.json().then((error) => Promise.reject(error));

type TApiResponse<T> = {
  success: boolean;
} & T;

type TTokenRefreshResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const renewAccessToken = (): Promise<TTokenRefreshResponse> =>
  fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((response) => validateResponse<TTokenRefreshResponse>(response))
    .then((tokenData) => {
      if (!tokenData.success) {
        return Promise.reject(tokenData);
      }
      localStorage.setItem('refreshToken', tokenData.refreshToken);
      storeCookie('accessToken', tokenData.accessToken);
      return tokenData;
    });

export const requestWithTokenRenewal = async <T>(
  endpoint: RequestInfo,
  requestOptions: RequestInit
) => {
  try {
    const response = await fetch(endpoint, requestOptions);
    return await validateResponse<T>(response);
  } catch (error) {
    if ((error as { message: string }).message === 'jwt expired') {
      const tokenData = await renewAccessToken();
      if (requestOptions.headers) {
        (requestOptions.headers as { [key: string]: string }).authorization =
          tokenData.accessToken;
      }
      const response = await fetch(endpoint, requestOptions);
      return await validateResponse<T>(response);
    } else {
      return Promise.reject(error);
    }
  }
};

type TMenuItemsResponse = TApiResponse<{
  data: TIngredient[];
}>;

type TOrdersStreamResponse = TApiResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const fetchMenuItemsApi = () =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then((response) => validateResponse<TMenuItemsResponse>(response))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const fetchOrdersStreamApi = () =>
  fetch(`${API_BASE_URL}/orders/all`)
    .then((response) => validateResponse<TOrdersStreamResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const fetchUserOrdersApi = () =>
  requestWithTokenRenewal<TOrdersStreamResponse>(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: retrieveCookie('accessToken') || ''
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

type TOrderSubmissionResponse = TApiResponse<{
  order: TOrder;
  name: string;
}>;

export const submitOrderApi = (itemIds: string[]) =>
  requestWithTokenRenewal<TOrderSubmissionResponse>(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: retrieveCookie('accessToken') || ''
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: itemIds
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderDetailsResponse = TApiResponse<{
  orders: TOrder[];
}>;

export const fetchOrderByIdApi = (orderNumber: number) =>
  fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => validateResponse<TOrderDetailsResponse>(response));

export type TAccountRegistration = {
  email: string;
  name: string;
  password: string;
};

type TAuthenticationResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const createAccountApi = (registrationData: TAccountRegistration) =>
  fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(registrationData)
  })
    .then((response) => validateResponse<TAuthenticationResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TAccountCredentials = {
  email: string;
  password: string;
};

export const authenticateApi = (credentials: TAccountCredentials) =>
  fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(credentials)
  })
    .then((response) => validateResponse<TAuthenticationResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const requestPasswordResetApi = (emailData: { email: string }) =>
  fetch(`${API_BASE_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(emailData)
  })
    .then((response) => validateResponse<TApiResponse<{}>>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const confirmPasswordResetApi = (resetData: {
  password: string;
  token: string;
}) =>
  fetch(`${API_BASE_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(resetData)
  })
    .then((response) => validateResponse<TApiResponse<{}>>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TAccountResponse = TApiResponse<{ user: TUser }>;

export const fetchAccountApi = () =>
  requestWithTokenRenewal<TAccountResponse>(`${API_BASE_URL}/auth/user`, {
    headers: {
      authorization: retrieveCookie('accessToken') || ''
    } as HeadersInit
  });

export const modifyAccountApi = (userData: Partial<TAccountRegistration>) =>
  requestWithTokenRenewal<TAccountResponse>(`${API_BASE_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: retrieveCookie('accessToken') || ''
    } as HeadersInit,
    body: JSON.stringify(userData)
  });

export const signOutApi = () =>
  fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((response) => validateResponse<TApiResponse<{}>>(response));
