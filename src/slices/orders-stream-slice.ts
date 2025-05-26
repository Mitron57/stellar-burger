import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrdersStreamApi, fetchUserOrdersApi } from '@api';
import type { TOrder } from '@utils-types';

export interface OrdersStreamState {
  isLoading: boolean;
  ordersList: TOrder[];
  totalOrdersCount: number;
  todayOrdersCount: number;
  errorMessage: string | null;
}

const defaultState: OrdersStreamState = {
  isLoading: false,
  ordersList: [],
  totalOrdersCount: 0,
  todayOrdersCount: 0,
  errorMessage: null
};

export const loadOrdersStreamAction = createAsyncThunk(
  'ordersStream/load',
  fetchOrdersStreamApi
);

export const loadUserOrdersAction = createAsyncThunk(
  'ordersStream/loadUserOrders',
  fetchUserOrdersApi
);

const ordersStreamSlice = createSlice({
  name: 'ordersStream',
  initialState: defaultState,
  reducers: {},
  selectors: {
    getOrdersStreamStateInfo: (state) => state,
    getOrdersListData: (state) => state.ordersList
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrdersStreamAction.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loadOrdersStreamAction.rejected, (state, { error }) => {
        state.isLoading = false;
        state.errorMessage = error.message as string;
      })
      .addCase(loadOrdersStreamAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.ordersList = payload.orders;
        state.totalOrdersCount = payload.total;
        state.todayOrdersCount = payload.totalToday;
      })
      .addCase(loadUserOrdersAction.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loadUserOrdersAction.rejected, (state, { error }) => {
        state.isLoading = false;
        state.errorMessage = error.message as string;
      })
      .addCase(loadUserOrdersAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.ordersList = payload;
      });
  }
});

export { defaultState as ordersStreamDefaultState };
export const { getOrdersStreamStateInfo, getOrdersListData } =
  ordersStreamSlice.selectors;

export default ordersStreamSlice.reducer;
