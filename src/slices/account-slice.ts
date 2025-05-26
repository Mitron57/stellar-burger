import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAccountApi,
  authenticateApi,
  fetchAccountApi,
  modifyAccountApi,
  signOutApi,
  requestPasswordResetApi,
  confirmPasswordResetApi
} from '@api';
import type { TAccountRegistration, TAccountCredentials } from '@api';
import type { TUser } from '@utils-types';
import { removeCookie, storeCookie } from '../utils/cookie';

export interface AccountState {
  isProcessing: boolean;
  currentUser: TUser | null;
  hasAccess: boolean;
  errorMessage: string | null;
}

const defaultState: AccountState = {
  isProcessing: false,
  currentUser: null,
  hasAccess: false,
  errorMessage: null
};

export const authenticateUserAction = createAsyncThunk(
  'account/authenticate',
  (credentials: TAccountCredentials) => authenticateApi(credentials)
);

export const createAccountAction = createAsyncThunk(
  'account/create',
  (registrationData: TAccountRegistration) => createAccountApi(registrationData)
);

export const signOutAction = createAsyncThunk('account/signOut', signOutApi);

export const modifyAccountAction = createAsyncThunk(
  'account/modify',
  (userData: Partial<TAccountRegistration>) => modifyAccountApi(userData)
);

export const requestPasswordResetAction = createAsyncThunk(
  'account/requestPasswordReset',
  (emailData: { email: string }) => requestPasswordResetApi(emailData)
);

export const confirmPasswordResetAction = createAsyncThunk(
  'account/confirmPasswordReset',
  (resetData: { password: string; token: string }) =>
    confirmPasswordResetApi(resetData)
);

export const fetchAccountAction = createAsyncThunk(
  'account/fetch',
  fetchAccountApi
);

export const accountSlice = createSlice({
  name: 'account',
  initialState: defaultState,
  reducers: {
    resetErrorMessage: (state) => {
      state.errorMessage = null;
    }
  },
  selectors: {
    getAccountStateInfo: (state) => state,
    getCurrentUserInfo: (state) => state.currentUser,
    checkAccessStatus: (state) => state.hasAccess,
    getAccountError: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUserAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(authenticateUserAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(authenticateUserAction.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.currentUser = payload.user;
        state.hasAccess = true;
        storeCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(createAccountAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(createAccountAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(createAccountAction.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.currentUser = payload.user;
        state.hasAccess = true;
        storeCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(signOutAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(signOutAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(signOutAction.fulfilled, (state) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.currentUser = null;
        state.hasAccess = false;
        removeCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(modifyAccountAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(modifyAccountAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(modifyAccountAction.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.currentUser = payload.user;
        state.hasAccess = true;
      })
      .addCase(requestPasswordResetAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(requestPasswordResetAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(requestPasswordResetAction.fulfilled, (state) => {
        state.isProcessing = false;
        state.errorMessage = null;
      })
      .addCase(confirmPasswordResetAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(confirmPasswordResetAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(confirmPasswordResetAction.fulfilled, (state) => {
        state.isProcessing = false;
        state.errorMessage = null;
      })
      .addCase(fetchAccountAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(fetchAccountAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(fetchAccountAction.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.hasAccess = true;
        state.currentUser = payload.user;
      });
  }
});

export { defaultState as accountDefaultState };
export const { resetErrorMessage } = accountSlice.actions;
export const {
  getAccountStateInfo,
  getCurrentUserInfo,
  checkAccessStatus,
  getAccountError
} = accountSlice.selectors;

export default accountSlice.reducer;
