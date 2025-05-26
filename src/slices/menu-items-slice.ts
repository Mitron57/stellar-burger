import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMenuItemsApi } from '@api';
import type { TIngredient } from '@utils-types';

export interface MenuItemsState {
  isLoading: boolean;
  availableItems: TIngredient[];
  errorMessage: string | null;
}

const defaultState: MenuItemsState = {
  isLoading: false,
  availableItems: [],
  errorMessage: null
};

export const loadMenuItemsAction = createAsyncThunk(
  'menuItems/load',
  fetchMenuItemsApi
);

const menuItemsSlice = createSlice({
  name: 'menuItems',
  initialState: defaultState,
  reducers: {},
  selectors: {
    getMenuItemsStateInfo: (state) => state,
    getAvailableMenuItems: (state) => state.availableItems
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMenuItemsAction.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loadMenuItemsAction.rejected, (state, { error }) => {
        state.isLoading = false;
        state.errorMessage = error.message as string;
      })
      .addCase(loadMenuItemsAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.availableItems = payload;
      });
  }
});

export { defaultState as menuItemsDefaultState };
export const { getMenuItemsStateInfo, getAvailableMenuItems } =
  menuItemsSlice.selectors;

export default menuItemsSlice.reducer;
