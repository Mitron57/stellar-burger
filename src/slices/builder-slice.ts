import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TOrder } from '@utils-types';
import { submitOrderApi } from '@api';

export interface BuilderState {
  isProcessing: boolean;
  selectedItems: {
    bunItem: TConstructorIngredient | null;
    fillingItems: TConstructorIngredient[];
  };
  isOrderSubmitting: boolean;
  completedOrderData: TOrder | null;
  errorMessage: string | null;
}

const defaultState: BuilderState = {
  isProcessing: false,
  selectedItems: {
    bunItem: null,
    fillingItems: []
  },
  isOrderSubmitting: false,
  completedOrderData: null,
  errorMessage: null
};

export const submitOrderAction = createAsyncThunk(
  'builder/submitOrder',
  (itemIds: string[]) => submitOrderApi(itemIds)
);

const builderSlice = createSlice({
  name: 'builder',
  initialState: defaultState,
  reducers: {
    includeItem: (state, action) => {
      if (action.payload.type === 'bun') {
        state.selectedItems.bunItem = action.payload;
      } else {
        state.selectedItems.fillingItems.push({
          ...action.payload,
          id: nanoid()
        });
      }
    },
    excludeItem: (state, action) => {
      state.selectedItems.fillingItems =
        state.selectedItems.fillingItems.filter(
          (item) => item.id !== action.payload
        );
    },
    toggleOrderSubmission: (state, action) => {
      state.isOrderSubmitting = action.payload;
    },
    clearCompletedOrder: (state) => {
      state.completedOrderData = null;
    },
    shiftItemDown: (state, action) => {
      const currentIndex = action.payload;
      const nextIndex = currentIndex + 1;
      [
        state.selectedItems.fillingItems[currentIndex],
        state.selectedItems.fillingItems[nextIndex]
      ] = [
        state.selectedItems.fillingItems[nextIndex],
        state.selectedItems.fillingItems[currentIndex]
      ];
    },
    shiftItemUp: (state, action) => {
      const currentIndex = action.payload;
      const prevIndex = currentIndex - 1;
      [
        state.selectedItems.fillingItems[currentIndex],
        state.selectedItems.fillingItems[prevIndex]
      ] = [
        state.selectedItems.fillingItems[prevIndex],
        state.selectedItems.fillingItems[currentIndex]
      ];
    }
  },
  selectors: {
    getBuilderStateInfo: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrderAction.pending, (state) => {
        state.isProcessing = true;
        state.errorMessage = null;
      })
      .addCase(submitOrderAction.rejected, (state, { error }) => {
        state.isProcessing = false;
        state.errorMessage = error.message as string;
      })
      .addCase(submitOrderAction.fulfilled, (state, { payload }) => {
        state.isProcessing = false;
        state.errorMessage = null;
        state.isOrderSubmitting = false;
        state.completedOrderData = payload.order;
        state.selectedItems = {
          bunItem: null,
          fillingItems: []
        };
      });
  }
});

export { defaultState as builderDefaultState };
export const {
  includeItem,
  excludeItem,
  toggleOrderSubmission,
  clearCompletedOrder,
  shiftItemDown,
  shiftItemUp
} = builderSlice.actions;
export const { getBuilderStateInfo } = builderSlice.selectors;

export default builderSlice.reducer;
