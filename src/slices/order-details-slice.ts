import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrderByIdApi } from '@api';
import type { TOrder } from '@utils-types';

export interface OrderDetailsState {
  isLoading: boolean;
  currentOrder: TOrder | null;
  errorMessage: string | null;
}

const defaultState: OrderDetailsState = {
  isLoading: false,
  currentOrder: null,
  errorMessage: null
};

export const loadOrderDetailsAction = createAsyncThunk(
  'orderDetails/load',
  (orderNumber: number) => fetchOrderByIdApi(orderNumber)
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState: defaultState,
  reducers: {},
  selectors: {
    getOrderDetailsInfo: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrderDetailsAction.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loadOrderDetailsAction.rejected, (state, { error }) => {
        state.isLoading = false;
        state.errorMessage = error.message as string;
      })
      .addCase(loadOrderDetailsAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.currentOrder = payload.orders[0];
      });
  }
});

export { defaultState as orderDetailsDefaultState };
export const { getOrderDetailsInfo } = orderDetailsSlice.selectors;

export default orderDetailsSlice.reducer;
